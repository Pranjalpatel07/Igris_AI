import axios from "axios"
import {graph} from "../graph/graph.js"
import {addMessage} from '../config/Memory.js'
export const agent = async (req,res) => {
    try {
        const {prompt , conversationId} = req.body
        const userId = req.headers["x-user-id"]
        if (!userId) return res.status(401).json({message:"Unauthorized"})
        if (typeof prompt !== "string" || !prompt.trim() || !conversationId) {
            return res.status(400).json({message:"A prompt and conversation id are required"})
        }

        
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,
            role:"user",
            content:prompt
        },{
            headers:{"x-user-id":userId}
        })
        
        const result = await graph.invoke({
            prompt ,
            conversationId,
            userId
        })
        const response = result.aiResponse
        
        if (typeof response !== "string" || !response.trim()) {
            throw new Error("Agent did not produce a response")
        }

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,
            role:"assistant",
            content:response
        },{
            headers:{"x-user-id":userId}
        })
        await addMessage(conversationId,"assistant",response)
        
        return res.status(200).json(response)
    } catch (error) {
        console.error("agent request error",error)
        return res.status(500).json({message:"Agent request failed"})
        
    }
}