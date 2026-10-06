import { getModel } from "../config/llmModels.js"

export const visionAgent = async (state) => {
    const llm = await getModel("image")
    llm.invoke(state.prompt)
    console.log("hello from vision agent")
}