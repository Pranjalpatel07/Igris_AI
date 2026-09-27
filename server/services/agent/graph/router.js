import { getModel } from "../config/llmModels.js"

export const router = async (state) => {
    const llm = await getModel("router")
    const prompt = `You are a agent router 
    Available agents:
    -chat
    -coding
    
    Rules:

    chat:
    General conversation, explanations, learning, and all requests that do not require writing or debugging code.

    coding:
    Generate code, debug code, build projects, architecture, API design.

    Return only one word:

    chat 
    search
    coding
    pdf
    ppt
    vision

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