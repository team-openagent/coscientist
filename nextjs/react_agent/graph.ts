import { AIMessage, SystemMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import {StateGraph, interrupt, Command, START, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ConfigurableAnnotation, defaultConfiguration } from "./configuration.js";
//import { TOOLS } from "./tools.js";
import { ChatOpenAI } from "@langchain/openai";
import { loadPromptTemplateFromFile } from "./prompt/index.js";

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
import { PromptTemplate } from "@langchain/core/prompts";

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
const retreive = async (state: z.infer<typeof GraphAnnotation>) => {
  const retrievedDocs = await vectorStore.similaritySearch(state.input_query);
  return {context: retrievedDocs};
}


// State
import "@langchain/langgraph/zod"
import {MessagesZodState} from "@langchain/langgraph";
import { z } from "zod";
const planSchema = z.object({
  task: z.string().describe(""),
  agent: z.string().describe(""),
  section: z.optional(z.string().describe("")),
}).describe("");
const blockSchema = z.object({}).describe("");
const commentSchema = z.object({
  block_id: z.string().describe(""),
  comment: z.string().describe(""),
});
const reviewSchema = z.object({
  overall_impression: z.string().describe(""),
  major_comments: z.array(commentSchema),
  minor_comments: z.array(commentSchema),
});
let GraphAnnotation = z.object({
  input_query: z.string().describe(""),
  research_note: z.string().describe(""),
  plans: z.array(planSchema),
  reviews: z.array(reviewSchema), 
  old_draft: z.array(blockSchema),
  new_draft: z.array(blockSchema),
  final_draft: z.array(blockSchema),
  ...MessagesZodState.shape,
});

// Node
import { ChatPromptTemplate } from "@langchain/core/prompts";

async function callModelNode(
  state: typeof GraphAnnotation,
  config: typeof ConfigurableAnnotation.State,
) {
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
}


function humanReviewNode(state: z.infer<typeof GraphAnnotation>): Command {
  const result = interrupt({
    task: "Review the output from the LLM and make any necessary edits.",
    //llm_generated: state.llm_generated,
  })
  return new Command({
    goto: "updateBlocks"
  })
  //llm_generated: result.edited_text,}
}

async function SupervisorNode(
  state: z.infer<typeof GraphAnnotation>,
  config: RunnableConfig<typeof ConfigurableAnnotation.State>,
): Promise<z.infer<typeof GraphAnnotation>> {
  const promptTemplate = PromptTemplate.fromTemplate(loadPromptTemplateFromFile("supervisor"));
  const formattedPrompt = await promptTemplate.invoke({
    old_draft: state.old_draft,
    new_draft: state.new_draft,
    input_query: state.input_query,
    reviews: state.reviews,
  });
  //const prompt = ChatPromptTemplate.fromMessages([
  //  new SystemMessage({content: formattedPrompt.toString()}),
  //])

  const llm = (config.configurable?.model as ChatOpenAI).withStructuredOutput(planSchema)
  const plans = await llm.invoke([
    ...state.messages,
    new SystemMessage({content: formattedPrompt.toString()}),
  ]);

  console.log(plans);
  state.plans.push(plans);
  return state;
}


async function PlannerNode(
  state: z.infer<typeof GraphAnnotation>,
  config: RunnableConfig<typeof ConfigurableAnnotation.State>,
): Promise<z.infer<typeof GraphAnnotation>> {
  const promptTemplate = PromptTemplate.fromTemplate(loadPromptTemplateFromFile("planner"));
  const formattedPrompt = await promptTemplate.invoke({
    old_draft: state.old_draft,
    new_draft: state.new_draft,
    input_query: state.input_query,
    reviews: state.reviews,
  });
  //const prompt = ChatPromptTemplate.fromMessages([
  //  new SystemMessage({content: formattedPrompt.toString()}),
  //])

  const llm = (config.configurable?.model as ChatOpenAI).withStructuredOutput(planSchema)
  const plans = await llm.invoke([
    ...state.messages,
    new SystemMessage({content: formattedPrompt.toString()}),
  ]);

  console.log(plans);
  state.plans.push(plans);
  return state;
}

async function WriterNode(
  state: z.infer<typeof GraphAnnotation>,
  config: RunnableConfig<typeof ConfigurableAnnotation.State>,
): Promise<z.infer<typeof GraphAnnotation>> {
  const promptTemplate = PromptTemplate.fromTemplate(loadPromptTemplateFromFile("writter"));
  const formattedPrompt = await promptTemplate.invoke({
    input_query: state.input_query,
    research_note: state.research_note,
    old_draft: state.old_draft,
    reviews: state.reviews,
  });

  const llm = (config.configurable?.model as ChatOpenAI).withStructuredOutput(z.array(blockSchema))
  const newDraft = await llm.invoke([
    ...state.messages,
    new SystemMessage({content: formattedPrompt.toString()}),
  ]);

  state.new_draft = newDraft;
  return state;
}

async function ReviewerNode(
  state: z.infer<typeof GraphAnnotation>,
  config: RunnableConfig<typeof ConfigurableAnnotation.State>,
): Promise<z.infer<typeof GraphAnnotation>> {
  let draftToReview = state.new_draft;
  if (state.reviews.length == 0) {
    draftToReview = state.old_draft;
  }
  const promptTemplate = PromptTemplate.fromTemplate(loadPromptTemplateFromFile("reviewer"));
  const formattedPrompt = await promptTemplate.invoke({
    draft: draftToReview,
  });

  const llm = (config.configurable?.model as ChatOpenAI).withStructuredOutput(reviewSchema);
  const review = await llm.invoke([
    ...state.messages,
    new SystemMessage({content: formattedPrompt.toString()}),
  ]);

  state.reviews.push(review);
  return state;
}

import { LangGraphRunnableConfig } from "@langchain/langgraph";
async function FinalizerNode(
  state: z.infer<typeof GraphAnnotation>,
  config: LangGraphRunnableConfig<typeof ConfigurableAnnotation.State>,
): Promise<z.infer<typeof GraphAnnotation>> {
  const promptTemplate = PromptTemplate.fromTemplate(loadPromptTemplateFromFile("finalizer"));
  config.store;
  const formattedPrompt = await promptTemplate.invoke({
    instruction: state.input_query,
    reviews: state.reviews,
    old_draft: state.old_draft,
    new_draft: state.new_draft,
  });

  const llm = (config.configurable?.model as ChatOpenAI).withStructuredOutput(z.array(blockSchema));
  const finalDraft = await llm.invoke([
    ...state.messages,
    new SystemMessage({content: formattedPrompt.toString()}),
  ]);

  state.final_draft.push(finalDraft);
  return state;
}

const workflow = new StateGraph(GraphAnnotation , ConfigurableAnnotation)
  .addNode("supervisor", SupervisorNode, {
    ends: ["planner", "reviewer", "finalizer"]
  })
  .addNode("planner", PlannerNode, {
    ends: ["writer"]
  })
  .addNode("writer", WriterNode, {
    ends: ["reviewer"]
  })
  .addNode("reviewer", ReviewerNode, {
    ends: ["supervisor"]
  })
  .addNode("finalizer", FinalizerNode, {
    ends: [END]
  })
  .addEdge(START, "supervisor")

export const graph = workflow.compile({
  checkpointer: checkpointer,
  interruptBefore: [], // if you want to update the state before calling the tools
  interruptAfter: [],
});
