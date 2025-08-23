import { BaseMessage } from "@langchain/core/messages";
import { Annotation, messagesStateReducer } from "@langchain/langgraph";
import { z } from "zod";

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

const ResearchAbstraction = z.object({
    title: z.string().describe("The full title of the paper."),
    problem_statement: z.array(z.string()).describe("A concise summary of the problem in current research that this paper addresses."),
    research_questions: z.array(z.string()).describe("The specific question the paper aims to answer."),
    hypothesis: z.array(z.string()).describe("The testable prediction of the study."),
    keywords: z.array(z.string()).describe("Key terms for categorization and discoverability."),
})




