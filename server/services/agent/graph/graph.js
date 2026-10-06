import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { visionAgent } from "../agents/imageGen.agent.js"
import { pdfAgent } from "../agents/pdf.agent.js"
import { pptAgent } from "../agents/ppt.agent.js"

const workflow = new StateGraph(agentState)

workflow.addNode("router",router)
workflow.addNode("chat",chatAgent)
workflow.addNode("coding",codingAgent)
workflow.addNode("search",searchAgent)
workflow.addNode("vision",visionAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("ppt",pptAgent)

workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router",(state)=>["coding", "search","image", "pdf", "ppt"].includes(state.agent) ? state.agent : "chat",{
    chat:"chat",
    coding:"coding",
    search:"search",
    vision:"vision",
    pdf:"pdf",
    ppt:"ppt",
})

workflow.addEdge("chat", "__end__") 
workflow.addEdge("coding", "__end__")
workflow.addEdge("search", "chat")
workflow.addEdge("vision","__end__")
workflow.addEdge("pdf", "__end__")
workflow.addEdge("ppt", "__end__")

export const graph = workflow.compile()

