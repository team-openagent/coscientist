import { TavilySearch } from "@langchain/tavily";
import { ArxivRetriever } from "@langchain/community/retrievers/arxiv";
import { tool } from"@langchain/core/tools";
import { z } from "zod";

const searchTavily = new TavilySearch({
  maxResults: 3,
});

const arxivRetriever = new ArxivRetriever({
  getFullDocuments: true,
  maxSearchResults: 5,
});
const arxivSearchTool = tool(
  async function ({query, draft}) {
    const documents = await arxivRetriever.invoke(`
      Instruction: ${query}
      Draft: ${draft}
    `);
  },
  {
    name: "arxiv_search",
    description: "",
    schema: z.object({
      query: z.string().describe(""),
      draft: z.string().describe(""),
    })
  }
);
const retrieveReference = {};
const editBlocks = {};


export const TOOLS = [searchTavily];
