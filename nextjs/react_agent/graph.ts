import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { v4 as uuidv4 } from 'uuid';
import {StateGraph, interrupt, Command, START, END } from "@langchain/langgraph";
import { ConfigurableAnnotation } from "./configuration.js";
//import { TOOLS } from "./tools.js";
import { ChatOpenAI } from "@langchain/openai";
import { loadPromptTemplateFromFile } from "./prompt/index";
import { GraphAnnotation,reviewSchema, blockSchema } from "./state";
import { z } from "zod";

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
//const directoryLoader = new DirectoryLoader("../../path", {
//  ".pdf": (path: string) => new PDFLoader(path),
//})
//const dirDocs = await directoryLoader.load();
//const textSplitter = new RecursiveCharacterTextSplitter({
//  chunkSize: 1000,
//  chunkOverlap: 200,
//})
//const splitDocs = await textSplitter.splitDocuments(dirDocs);
//
//// index chunks
//await vectorStore.addDocuments(splitDocs);
//const retreive = async (state: z.infer<typeof GraphAnnotation>) => {
//  const retrievedDocs = await vectorStore.similaritySearch(state.input_query);
//  return {context: retrievedDocs};
//}


// Node
import { ChatPromptTemplate } from "@langchain/core/prompts";

async function callModelNode(
  state: typeof GraphAnnotation,
  config: typeof ConfigurableAnnotation.State,
) {
  // config = defaultConfiguration(config);

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
): Promise<Command> {
  // Increment recursion counter
  state.recursion_count = (state.recursion_count || 0) + 1;
  
  const promptTemplate = PromptTemplate.fromTemplate(loadPromptTemplateFromFile("supervisor"));
  const formattedPrompt = await promptTemplate.invoke({
    input_query: state.input_query,
    old_draft: state.old_draft,
    new_draft: state.new_draft,
    review: state.reviews[state.reviews.length - 1],
  });

  const llm = (config.configurable?.model as ChatOpenAI).withStructuredOutput(z.object({
    route: z.enum(["editor", "reviewer", "finalizer"]),
  }));
  const response = await llm.invoke([
    ...state.reasonings.map((reasoning) => new AIMessage({content: reasoning})),
    new SystemMessage({content: formattedPrompt.toString()}),
  ]);

  // Check recursion limit - if reached, force go to finalizer
  const RECURSION_LIMIT = 5; // Maximum number of cycles before forcing finalization
  if (state.recursion_count > RECURSION_LIMIT) {
    return new Command({ goto: "finalizer" });
  }

  if (response.route === "editor") {
    return new Command({ goto: "editor" ,update: state});
  } else if (response.route === "reviewer") {
    return new Command({ goto: "reviewer" ,update: state});
  } else if (response.route === "finalizer") {
    return new Command({ goto: "finalizer" ,update: state});
  } else {
    throw new Error(`Unknown next_node: ${response.route}`);
  }
}


async function EditorNode(
  state: z.infer<typeof GraphAnnotation>,
  config: RunnableConfig<typeof ConfigurableAnnotation.State>,
): Promise<Command> {

  const promptTemplate = PromptTemplate.fromTemplate(loadPromptTemplateFromFile("editor"));
  const formattedPrompt = await promptTemplate.invoke({
    input_query: state.input_query,
    research_note: state.research_note,
    draft: state.new_draft,
    review: state.reviews[state.reviews.length - 1],
  });

  const llm = (config.configurable?.model as ChatOpenAI).withStructuredOutput(z.object({
    new_draft: z.array(blockSchema),
    reasoning: z.string().describe("The reasoning of the agent"),
  }))
  const response = await llm.invoke([
    ...state.reasonings.map((reasoning) => new AIMessage({content: reasoning})),
    new SystemMessage({content: formattedPrompt.toString()}),
  ]);
  console.log("Response review: ", state.reviews);
  state.new_draft = response.new_draft.map((block) => ({
    ...block,
    id: uuidv4(),
  }));
  state.reasonings.push(response.reasoning);
  return new Command({
    goto: "reviewer",
    update: state,
  });
}

async function ReviewerNode(
  state: z.infer<typeof GraphAnnotation>,
  config: RunnableConfig<typeof ConfigurableAnnotation.State>,
): Promise<Command> {
  const draftToReview = state.new_draft;
  // if (state.reviews.length == 0) {
  //   draftToReview = state.old_draft;
  // }
  const promptTemplate = PromptTemplate.fromTemplate(loadPromptTemplateFromFile("reviewer"));
  const formattedPrompt = await promptTemplate.invoke({
    input_query: state.input_query,
    draft: draftToReview,
  });

  const llm = (config.configurable?.model as ChatOpenAI).withStructuredOutput(z.object({
    review: reviewSchema,
    reasoning: z.string().describe("The reasoning history of the agent"),
  }));
  const response = await llm.invoke([
    ...state.reasonings.map((reasoning) => new AIMessage({content: reasoning})),
    new SystemMessage({content: formattedPrompt.toString()}),
  ]);

  state.reviews.push(response.review);
  state.reasonings.push(response.reasoning);
  return new Command({
    goto: "supervisor",
    update: state,
  });
}

import { MessageHistory } from "@/domain/model";
async function FinalizerNode(
  state: z.infer<typeof GraphAnnotation>,
  config: RunnableConfig<typeof ConfigurableAnnotation.State>,
): Promise<Command> {
  // Store the final stat 
  const checkpoint = await checkpointer.getTuple({
    configurable: {
      thread_id: config.configurable?.thread_id,
    }
  });
  const checkpoint_id = checkpoint?.config.configurable?.checkpoint_id;
  const messageHistory = new MessageHistory({
    topic_id: config.configurable?.thread_id,
    checkpoint_id: checkpoint_id,
  });
  await messageHistory.save();

  return new Command({goto: END });
  // TODO:
  // tool call to store the final draft into the IPaper of @/lib/mongodb.ts in the mongodb database 
  //const promptTemplate = PromptTemplate.fromTemplate(loadPromptTemplateFromFile("finalizer"));
  //const formattedPrompt = await promptTemplate.invoke({
  //  instruction: state.input_query,
  //  reviews: state.reviews,
  //  old_draft: state.old_draft,
  //  new_draft: state.new_draft,
  //});

  //const llm = (config.configurable?.model as ChatOpenAI).withStructuredOutput(z.object({
  //  final_draft: z.array(blockSchema),
  //}));
  //const response = await llm.invoke([
  //  ...state.reasonings.map((reasoning) => new AIMessage({content: reasoning})),
  //  new SystemMessage({content: formattedPrompt.toString()}),
  //]);

  //state.final_draft = response.final_draft;
  //return new Command({
  //  goto: END,
  //  update: state,
  //});
}

const workflow = new StateGraph(GraphAnnotation , ConfigurableAnnotation)
  .addNode("supervisor", SupervisorNode, {
    ends: ["editor", "reviewer", "finalizer"]
  })
  .addNode("editor", EditorNode, {
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
