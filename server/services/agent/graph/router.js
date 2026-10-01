import { getModel } from "../config/llmModels.js"

export const router = async (state) => {
    const requestedAgent = typeof state.agent === "string"
        ? state.agent.trim().toLowerCase()
        : "auto"

    if(requestedAgent !== "auto") {
        return{
            ...state,
            agent:requestedAgent
        }
    }
    const llm = await getModel("router")
    const prompt = `You are a agent router 
    Available agents:
    -chat
    -search
    -coding
    
    Rules:

    chat:
    General conversation, explanations, learning, and all requests that do not require writing or debugging code.

    search:
    Requests for current information, web research, or related images.

    coding:
    Generate code, debug code, build projects, architecture, API design.

    Return only one word: chat, search, or coding.

    User Query :
     ${state.prompt}

    `
    const response = await llm.invoke(prompt)

    return {
        ...state,
        agent:response.content
                    .trim()
                    .toLowerCase()
    }
}