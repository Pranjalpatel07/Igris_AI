import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/Memory.js"

export const chatAgent = async (params) => {
    const llm = await getModel("chat")
    const history = await getMemory(params.conversationId, params.userId)
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
    const messages = [
        new SystemMessage(systemPrompt)

    ]
    history.forEach(msg => {
        if(msg.role == "user"){
            messages.push(new HumanMessage(msg.content))
        }if(msg.role == "assistant"){
            messages.push(new AIMessage(msg.content))
        }
    })

    messages.push(new HumanMessage(params.prompt))
    console.log(messages)
    const response = await llm.invoke(messages) 

    return {
        ...params,
        aiResponse: response.content
    }
}