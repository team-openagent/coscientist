import { TavilySearch } from "@langchain/tavily";
import { ArxivRetriever } from "@langchain/community/retrievers/arxiv";
import { tool } from"@langchain/core/tools";
import { z } from "zod";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import { connectToDatabase } from "@/lib/mongo/connection";
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


const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large"
});


const client = (await connectToDatabase()).connection.getClient();
const vectorStoreCollection = client.db("test").collection("VectorStore")
const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection: vectorStoreCollection,
  indexName: "vector_index",
  textKey: "text",
  embeddingKey: "embedding",
})
const directoryLoader = new DirectoryLoader("../../path", {
  ".pdf": (path: string) => new PDFLoader(path),
})
const dirDocs = await directoryLoader.load();
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
})
const splitDocs = await textSplitter.splitDocuments(dirDocs);
await vectorStore.addDocuments(splitDocs);
const retreive = tool(
  async function (question: string) {
    const retrievedDocs = await vectorStore.similaritySearch(question);
    return {context: retrievedDocs};
  },
  {
    name: "retrieve",
    description: "Retrieve relevant documents from the vector store",
    schema: z.object({
      question: z.string().describe("The question to retrieve relevant documents from the vector store"),
    })
  }
)

export const TOOLS = [searchTavily, retreive];
