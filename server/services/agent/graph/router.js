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
    const prompt = `You are an agent router.
    Available agents:
    - chat
    - search
    - coding
    - vision
    - pdf
    - ppt

    Rules:

    chat:
    General conversation, explanations, learning, and all requests that do not require writing code, web research, PDF work, image generation, or presentations.

    search:
    Requests for current information, web research, or live data lookup.

    coding:
    Generate code, debug code, build projects, architecture, API design, and technical implementations.

    vision:
    Requests to generate or edit images, visuals, or artwork.

    pdf:
    Requests involving PDF files, summarization, extraction, or document analysis.

    ppt:
    Requests to create, edit, or generate PowerPoint presentations and slide decks.

    Return only one word: chat, search, coding, vision, pdf, or ppt.

    User Query:
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