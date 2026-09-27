import { getModel } from "../config/llmModels.js"

export const chatAgent = async (params) => {
    const llm = await getModel("chat")
    const systemPrompt = `You are Igris AI, an intelligent AI assistant.
    Rules: 
    - For simple questions, greetings and short queries, respond naturally in plain text.
    - For technical, educational, coding, or detailed topics, use clean Markdown.
    
    Formatting: 
    -Use # for title and ## for sections.
    -Leave a blank line after headings.
    -Use bullet ponits for lists.
    -Use numbered lists for stops.
    -Use fenced code blocks with language tags for code.
    -Keep paragaphs short and readale.
    -Never write headings and content on the same line.
    -Never generate large walls of text.`
    const response = await llm.invoke([
        {
            "role" : "system",
            "content": systemPrompt
        },
        {
            "role" : "user",
            "content" : params.prompt
        }
    ]) 

    return {
        ...params,
        aiResponse: response.content
    }
}