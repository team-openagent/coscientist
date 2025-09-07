
import * as hub from "langchain/hub/node";
import { RunnableConfig } from "@langchain/core/runnables";
import {StateGraph, START, END } from "@langchain/langgraph";
//import { TOOLS } from "./tools.js";
import { ChatOpenAI } from "@langchain/openai";
import { GraphAnnotation,reviewSchema, blockSchema } from "./state";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

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
import { ConfigurableAnnotation } from "./configuration";
const checkpointer = new MongoDBSaver({
  client: client
});

async function EditorNode(
  state: z.infer<typeof GraphAnnotation>,
  config: RunnableConfig<typeof ConfigurableAnnotation.State>,
): Promise<z.infer<typeof GraphAnnotation>> {
  const prompt = await hub.pull("editor-prompt");
  const model = new ChatOpenAI({
    model: "gpt-5-mini",
  }).withStructuredOutput(z.object({
    new_draft: z.array(blockSchema).describe("The new draft of the paper"),
    explanation: z.string().describe("The explanation of the agent response"),
  }));
  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    "old_draft": state.old_draft,
    "input_query": state.input_query,
  })

  state.new_draft = response.new_draft.map((block) => ({
    ...block,
    id: uuidv4(),
  }));
  state.explanations.push(response.explanation);
  return {...state};
}


async function ReviewerNode(
  state: z.infer<typeof GraphAnnotation>,
  config: RunnableConfig<typeof ConfigurableAnnotation.State>,
): Promise<z.infer<typeof GraphAnnotation>> {
  const draftToReview = state.new_draft;
  const prompt = await hub.pull("reviewer-prompt");
  const model = new ChatOpenAI({
    model: "gpt-5-mini",
  }).withStructuredOutput(z.object({
    review: reviewSchema,
    explanation: z.string().describe("The explanation of the agent response"),
  }));
  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    "draft_to_review": draftToReview,
  });

  state.reviews.push(response.review);
  state.explanations.push(response.explanation);
  return {...state};
}

const workflow = new StateGraph(GraphAnnotation, ConfigurableAnnotation)
  .addNode("editor", EditorNode)
  .addNode("reviewer", ReviewerNode)
  .addEdge(START, "editor")
  .addEdge("editor", "reviewer")
  .addEdge("reviewer", END)
  .addEdge("editor", END)

export const graph = workflow.compile({
  checkpointer: checkpointer,
  interruptBefore: [], // if you want to update the state before calling the tools
  interruptAfter: [],
});
