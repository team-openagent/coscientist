import { AIMessage, SystemMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { Annotation, StateGraph, messagesStateReducer, interrupt, Command } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { ConfigurableAnnotation, defaultConfiguration } from "./configuration.js";
import { TOOLS } from "./tools.js";
import { ChatOpenAI } from "@langchain/openai";

// State
class Block {}
const InputAnnotation = Annotation.Root({
  question: Annotation<string>,
  docs: Annotation<string[]>,
  old_blocks: Annotation<Block[]>
})

const OutputAnnotation = Annotation.Root({
  new_blocks: Annotation<Block[]>,
  messages: Annotation<BaseMessage[]>({reducer: messagesStateReducer}),
})
const GraphAnnotation = Annotation.Root({
  ...InputAnnotation.spec,
  ...OutputAnnotation.spec,
})


// Node
async function callModelNode(
  state: typeof GraphAnnotation.State,
  config: typeof ConfigurableAnnotation.State,
): Promise<typeof OutputAnnotation.Update> {
  config = defaultConfiguration(config);

  const model = (config.model as ChatOpenAI).bindTools(TOOLS);

  const response = await model.invoke([
    ...[
      new SystemMessage(config.promptTemplate),
      new HumanMessage(`
        Context:
        Question: ${state.question}
        Docs: ${state.docs?.join("\n")}
        Old Blocks: ${JSON.stringify(state.old_blocks, null, 2)}
      `),
    ],


  ]);

  return { messages: [response] };
}


function routeModelOutput(state: typeof GraphAnnotation.State): string {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];
  return "__end__";
  if ((lastMessage as AIMessage)?.tool_calls?.length || 0 > 0) {
    return "tools";
  } else {
    return "humanReview";
  }
}

function humanReviewNode(state: typeof GraphAnnotation.State): Command {
  const result = interrupt({
    task: "Review the output from the LLM and make any necessary edits.",
    //llm_generated: state.llm_generated,
  })
  return new Command({
    goto: "updateBlocks"
  })
  //llm_generated: result.edited_text,}
}

function updateBlocks(state: typeof GraphAnnotation.State): Command {
  return new Command({
    goto: "__end__"
  })
}


const workflow = new StateGraph({
  input: InputAnnotation,
  output: OutputAnnotation,
}, ConfigurableAnnotation)
  .addNode("callModel", callModelNode)
  .addNode("tools", new ToolNode(TOOLS))
  .addNode("humanReview", humanReviewNode)
  .addEdge("__start__", "callModel")
  .addConditionalEdges(
    "callModel",
    routeModelOutput,
  )
  //.addEdge("tools", "callModel")
  //.addEdge("callModel", "humanReview");


export const graph = workflow.compile({
  interruptBefore: [], // if you want to update the state before calling the tools
  interruptAfter: [],
});
