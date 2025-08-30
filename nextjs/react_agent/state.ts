import { z } from "zod";

export const blockSchema = z.object({
  id: z.string().describe("Unique identifier of the block").optional().nullable(),
  type: z.string().describe("The type of content block (e.g., 'paragraph', 'heading', 'code', 'image', 'math')"),
  data: z.object({
    text: z.string().optional().nullable().describe("The textual content of the block"),
    level: z.number().optional().nullable().describe("The heading level (1-3) for heading blocks"),
    file: z.object({
      url: z.string().describe("The URL or path to the referenced file when type is 'image'")
    }).optional().nullable().describe("File attachment information for the block"),
    math: z.string().optional().nullable().describe("Mathematical expression or equation in LaTeX format when type is 'math'"),
  }),
  tunes: z.object({
    alignmentTuneTool: z.object({
      alignment: z.string().default("left").optional().nullable().describe("Text alignment: 'left', 'center', 'right'")
    })
  }).describe("Styling and formatting options for the block"),
});

export const commentSchema = z.object({
  block_id: z.string().optional().nullable().describe("Unique identifier of the block being commented on. Use when you want to comment on a specific block."),
  comment: z.string().describe("The comment text providing feedback or suggestions"),
});
export const reviewSchema = z.object({
  overall_impression: z.string().describe("General assessment and overall quality rating of the content"),
  comments: z.array(commentSchema).describe("Critical issues and significant changes needed"),
});

export const GraphAnnotation = z.object({
  input_query: z.string().describe("The original research question or problem statement"),
  research_note: z.string().describe("Key findings and insights from research"),
  reviews: z.array(reviewSchema).describe("Peer review feedback and quality assessments"),
  old_draft: z.array(blockSchema).describe("Previous version of the document content"),
  new_draft: z.array(blockSchema).describe("Current working version with recent changes"),
  final_draft: z.array(blockSchema).describe("Polished and finalized version ready for submission"),
  reasonings: z.array(z.string()).describe("The reasoning history of the agent"),
  recursion_count: z.number().default(0).describe("Counter to track recursion cycles and prevent infinite loops"),
  metadata: z.object({
    final: z.boolean().optional().nullable().describe("Whether the final version of the document is being generated"),
  }).optional().nullable(),
});

export const ResearchAbstraction = z.object({
    title: z.string().describe("The full title of the paper."),
    problem_statement: z.array(z.string()).describe("A concise summary of the problem in current research that this paper addresses."),
    research_questions: z.array(z.string()).describe("The specific question the paper aims to answer."),
    hypothesis: z.array(z.string()).describe("The testable prediction of the study."),
    keywords: z.array(z.string()).describe("Key terms for categorization and discoverability."),
})
