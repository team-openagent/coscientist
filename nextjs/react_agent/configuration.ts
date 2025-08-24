/**
 * Define the configurable parameters for the agent.
 */
import { Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

export const ConfigurableAnnotation = Annotation.Root({
  thread_id: Annotation<string>,
  model: Annotation<BaseChatModel>,
});

export function defaultConfiguration(
  config: typeof ConfigurableAnnotation.State,
): typeof ConfigurableAnnotation.State {
  const configurable = config ?? {};
  return {
    thread_id: "1",
    model: new ChatOpenAI({model: "gpt-5-mini"}),
  };
}
