import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { searchAgent } from "../agents/search.agent.js";

const workflow = new StateGraph(agentState)

workflow.addNode("router",router)
workflow.addNode("chat",chatAgent)
workflow.addNode("coding",codingAgent)
workflow.addNode("search",searchAgent)

workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router",(state)=>["coding", "search"].includes(state.agent) ? state.agent : "chat",{
    chat:"chat",
    coding:"coding",
    search:"search"
})

workflow.addEdge("chat", "__end__") 
workflow.addEdge("coding", "__end__")
workflow.addEdge("search", "chat")

export const graph = workflow.compile()

