import { getModel } from "../config/llmModels.js"

export const chatAgent = async (params) => {
    const llm = getModel("chat")
    const prompt = "You are Igris AI, an intelligent AI assistant."
    const response = await llm.invoke([
        {
            "Role" : "system",
            "content": systemPrompt
        },
        {
            "role" : "human",
            "content" : state.prompt
        }
    ]) 

    return {
        ...state,
        aiResponse: response.content
    }
}