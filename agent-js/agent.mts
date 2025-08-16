// Optinal add tracing in LangSmith
//process.env.LANGCHAIN_API_KEY = "";
//process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
//process.env.LANGCHAIN_TRACING_V2 = "true";
//process.env.LANGCHAIN_PROJECT = "QUICKstart: LangGraphJS";


process.env.OPENAI_API_KEY = "";
process.env.TAVILY_API_KEY = "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";


import { TavilySearchResponse } from "@langchain/tavily"
import { ChatOpenAI } from "@langchain/openai"
import { MemorySaver } from "@langchain/langgraph"
import { HumanMessage } from "@langchain/core/messages"
import { createReactAgent } from "@langchain/langgraph/prebuilt";


const agentTools = []; //[new TavilySearchResponse({ maxResults:3 })];
const agentModel = new ChatOpenAI({ temperature: 0});
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
    llm: agentModel,
    tools: agentTools,
    checkpointSaver: agentCheckpointer,
})

const agentFinalState = await agent.invoke(
    {messages: [new HumanMessage("what is the current weather in sf")]},
    {configurable: { thread_id: "42"}},
)

console.log(agentFinalState.messages[agentFinalState.messages.length-1].content);

