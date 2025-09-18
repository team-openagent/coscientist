/**
 * Define the configurable parameters for the agent.
 */
import { Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export const ConfigurableAnnotation = Annotation.Root({
  thread_id: Annotation<string>,
  model: Annotation<BaseChatModel>,
});

export function defaultConfiguration(): typeof ConfigurableAnnotation.State {
  return {
    thread_id: "68afa28aac183d3329bd2989",
    model: new ChatOpenAI({model: "gpt-5-mini"}),
  };
}
