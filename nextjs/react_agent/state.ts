import {MessagesZodState} from "@langchain/langgraph";
import { z } from "zod";

export const planSchema = z.object({
  task: z.string().describe(""),
  agent: z.string().describe(""),
  section: z.optional(z.string().describe("")),
}).describe("");

export const blockSchema = z.object({
  type: z.string().describe(""),
  data: z.object({
    text: z.optional(z.string()).describe(""),
    level: z.optional(z.number()).describe(""),
    file: z.optional(z.object({
      url: z.string().describe("")
    })).describe(""),
    math: z.optional(z.string()).describe(""),
  }),
  tunes: z.object({
    alignmentTuneTool: z.object({
      alignment: z.string().default("left").describe("")
    })
  }).describe(""),
});

export const commentSchema = z.object({
  block_id: z.string().describe(""),
  comment: z.string().describe(""),
});
export const reviewSchema = z.object({
  overall_impression: z.string().describe(""),
  major_comments: z.array(commentSchema),
  minor_comments: z.array(commentSchema),
});

export const GraphAnnotation = z.object({
  input_query: z.string().describe(""),
  research_note: z.string().describe(""),
  plans: z.array(planSchema),
  reviews: z.array(reviewSchema), 
  old_draft: z.array(blockSchema),
  new_draft: z.array(blockSchema),
  final_draft: z.array(blockSchema),
  ...MessagesZodState.shape,
});

export const ResearchAbstraction = z.object({
    title: z.string().describe("The full title of the paper."),
    problem_statement: z.array(z.string()).describe("A concise summary of the problem in current research that this paper addresses."),
    research_questions: z.array(z.string()).describe("The specific question the paper aims to answer."),
    hypothesis: z.array(z.string()).describe("The testable prediction of the study."),
    keywords: z.array(z.string()).describe("Key terms for categorization and discoverability."),
})
