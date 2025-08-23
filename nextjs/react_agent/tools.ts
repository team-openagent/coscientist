import { TavilySearch } from "@langchain/tavily";

const searchTavily = new TavilySearch({
  maxResults: 3,
});


const searchArxiv = {};
const retrieveReference = {};
const editBlocks = {};


export const TOOLS = [searchTavily];
