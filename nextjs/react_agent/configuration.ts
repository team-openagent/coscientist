/**
 * Define the configurable parameters for the agent.
 */
import { Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { GENERATE_BLOCKS_AGENT } from "./prompts.js";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export const ConfigurableAnnotation = Annotation.Root({
  model: Annotation<BaseChatModel>,
  promptTemplate: Annotation<string>,
});

export function defaultConfiguration(
  config: typeof ConfigurableAnnotation.State,
): typeof ConfigurableAnnotation.State {
  const configurable = config ?? {};
  return {
    model: new ChatOpenAI({
      model: "gpt-5-mini",
    }),
    promptTemplate: configurable.promptTemplate ?? GENERATE_BLOCKS_AGENT,
  };
}
