import { TavilySearch } from "@langchain/tavily";

export const tavily = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeImages: true,
  apiKey: process.env.TAVILY_API_KEY,
});