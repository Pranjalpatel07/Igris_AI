import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import {ChatOpenRouter} from "@langchain/openrouter"
const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    
    apiKey: process.env.GROQ_API_KEY
})

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash",
   
    apiKey: process.env.GOOGLE_API_KEY
    // other params...
})

const openrouter = new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
    maxTokens:1500,
    apiKey: process.env.OPENROUTER_API_KEY
})

export const getModel = async (agent) => {
    switch(agent) {
        case "chat":
            return groq;
        case "search":
            return groq;
        case "coding" :
            return openrouter;
        case "image":
            return groq
        default:
            return groq;
    }
}