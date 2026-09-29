import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/Memory.js"

export const chatAgent = async (state) => {
    const llm = await getModel("chat")
    const history = await getMemory(state.conversationId, state.userId)
    const searchContext = state.searchResults?`Web search results:
    ${JSON.stringify(state.searchResults)} Answer the user using only the above search result`:""

    const systemPrompt = `You are Igris AI, an intelligent AI assistant.
    ${searchContext}
    If searchContext exists:
    -Use search results to answer.
    -Do not mention internal tools.

    
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

    messages.push(new HumanMessage(state.prompt))
    console.log(messages)
    const response = await llm.invoke(messages) 

    return {
        ...state,
        aiResponse: response.content
    }
}