/**
 * Define the configurable parameters for the agent.
 */
import { Annotation } from "@langchain/langgraph";
import { PROMPT_TEMPLATE } from "./prompts.js";

export const ConfigurableAnnotation = Annotation.Root({
  model: Annotation<string>,
  promptTemplate: Annotation<string>,
});

export function defaultConfiguration(
  config: typeof ConfigurableAnnotation.State,
): typeof ConfigurableAnnotation.State {
  const configurable = config ?? {};
  return {
    model: configurable.model ?? "gpt-5-mini",
    promptTemplate: configurable.promptTemplate ?? PROMPT_TEMPLATE,
  };
}
