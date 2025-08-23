import { AIMessage, SystemMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { Annotation, StateGraph, messagesStateReducer, interrupt, Command } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ConfigurableAnnotation, defaultConfiguration } from "./configuration.js";
//import { TOOLS } from "./tools.js";
import { ChatOpenAI } from "@langchain/openai";

// Setting store
import { connectToDatabase } from "@/lib/mongodb";
const client = (await connectToDatabase()).connection.getClient();

import { MongoDBStore } from "@langchain/mongodb";
const storeCollection = client.db("test").collection("LongtermMemory");
const store = new MongoDBStore({
  collection: storeCollection
});

// Setting checkpointer
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
const checkpointer = new MongoDBSaver({
  client: client
});

// RAG: Load & Split & Store
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import path from "path";
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large"
});
const vectorStoreCollection = client.db("test").collection("VectorStore")
const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection: vectorStoreCollection,
  indexName: "vector_index",
  textKey: "text",
  embeddingKey: "embedding",
})
const directoryLoader = new DirectoryLoader("../../path", {
  ".pdf": (path: string) => new PDFLoader(path),
})
const dirDocs = await directoryLoader.load();
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
})
const splitDocs = await textSplitter.splitDocuments(dirDocs);

// index chunks
await vectorStore.addDocuments(splitDocs);
const retreive = async (state:  typeof GraphAnnotation.State) => {
  const retrievedDocs = await vectorStore.similaritySearch(state.input_query);
  return {context: retrievedDocs};
}


// State
type Block = Object
const GraphAnnotation = Annotation.Root({
  input_query: Annotation<string>,
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

// const model = (config.model as ChatOpenAI).bindTools(TOOLS);

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
  checkpointer: checkpointer,
  interruptBefore: [], // if you want to update the state before calling the tools
  interruptAfter: [],
});
