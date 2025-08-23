import { AIMessage, SystemMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { Annotation, StateGraph, messagesStateReducer, interrupt, Command } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { ConfigurableAnnotation, defaultConfiguration } from "./configuration.js";
import { TOOLS } from "./tools.js";
import { ChatOpenAI } from "@langchain/openai";

type Block = Object
const GraphAnnotation = Annotation.Root({
    paper_sections: Annotation<string[]>,
    research_notes: Annotation<string>,
    plan: Annotation<string>,
    draft: Annotation<Block[]>,
    review: Annotation<string>,
    final_draft: Annotation<Block[]>,
    messages: Annotation<BaseMessage[]>({reducer: messagesStateReducer}),
})


// Node
async function callModelNode(
  state: typeof GraphAnnotation.State,
  config: typeof ConfigurableAnnotation.State,
): Promise<typeof GraphAnnotation.Update> {
  config = defaultConfiguration(config);

  const model = (config.model as ChatOpenAI).bindTools(TOOLS);

//  const response = await model.invoke([
//    ...[
//      new SystemMessage(config.promptTemplate),
//      new HumanMessage(`
//        Context:
//        Question: ${state.question}
//        Docs: ${state.docs?.join("\n")}
//        Old Blocks: ${JSON.stringify(state.old_blocks, null, 2)}
//      `),
//    ],
//  ]);

  return { messages: [new AIMessage("HELLO")] };
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

function PlannerNode(
  state: typeof GraphAnnotation.State,
  config: typeof ConfigurableAnnotation.State,
): typeof GraphAnnotation.Update {
  const messages = state.messages;
  return {messages: [new AIMessage("HELLO")] };
}

function WriterNode(
  state: typeof GraphAnnotation.State,
  config: typeof ConfigurableAnnotation.State,
): typeof GraphAnnotation.Update {
  return {messages: [new AIMessage("HELLO")] };
}

function ReviewerNode(
  state: typeof GraphAnnotation.State,
  config: typeof ConfigurableAnnotation.State,
): Command {
  const gotoA = "planner";
  const gotoB = "writer";
  const gotoC = "finalizer";
  return new Command({
    goto: gotoA,
    update:{"my_state_key": "my_state_value"}
  });
}

function FinalizerNode(
  state: typeof GraphAnnotation.State,
  config: typeof ConfigurableAnnotation.State,
): typeof GraphAnnotation.Update {
  return {messages: [new AIMessage("HELLO")]};
}


const workflow = new StateGraph({
  input: GraphAnnotation,
  output: GraphAnnotation,
}, ConfigurableAnnotation)
  .addNode("planner", PlannerNode)
  .addNode("writer", WriterNode)
  .addNode("reviewer", ReviewerNode)
  .addNode("finalizer", FinalizerNode)
  .addEdge("__start__", "planner")
  .addEdge("planner", "writer")
  .addEdge("writer", "reviewer")
  .addEdge("finalizer", "__end__")

export const graph = workflow.compile({
  interruptBefore: [], // if you want to update the state before calling the tools
  interruptAfter: [],
});
