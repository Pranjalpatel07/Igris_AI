import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { codingAgent } from "../agents/coding.agent.js";

const workflow = new StateGraph(agentState)

workflow.addNode("router",router)
workflow.addNode("chat",chatAgent)
workflow.addNode("coding",codingAgent)

workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router",(state)=>state.agent === "coding" ? "coding" : "chat",{
    chat:"chat",
    coding:"coding"
})

workflow.addEdge("chat", "__end__") 
workflow.addEdge("coding", "__end__")

export const graph = workflow.compile()

