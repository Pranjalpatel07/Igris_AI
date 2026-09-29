import mongoose from "mongoose"
import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const createConversations = async (req,res) => {
    try {
        const userId = req.headers["x-user-id"]
        if (!userId) return res.status(401).json({message:"Unauthorized"})
        const conversation = await Conversation.create({
            userId:userId
        })

        return res.status(200).json(conversation)
    } catch (error) {
        console.error("create conversation error",error)
        return res.status(500).json({message:"Failed to create conversation"})
        
    }
}

export const getConversations = async (req,res) => {
    try {
        const userId = req.headers["x-user-id"]
        if (!userId) return res.status(401).json({message:"Unauthorized"})
        const conversation = await Conversation.find({
            userId:userId
        }).sort({updatedAt:-1})

        return res.status(200).json(conversation)
    } catch (error) {
        console.error("get conversations error",error)
        return res.status(500).json({message:"Failed to get conversations"})
        
    }
}

export const updateConversation = async (req,res) => {
    try {
        const {id,title}=req.body
        const userId = req.headers["x-user-id"]
        if (!userId) return res.status(401).json({message:"Unauthorized"})
        if (!mongoose.isValidObjectId(id) || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({message:"A valid conversation id and title are required"})
        }
        const conversation = await Conversation.findOneAndUpdate(
            {_id:id,userId},
            {title:title.trim()},
            {new:true,runValidators:true}
        )
        if (!conversation) return res.status(404).json({message:"Conversation not found"})

        return res.status(200).json(conversation)
    } catch (error) {
        console.error("update conversation error",error)
        return res.status(500).json({message:"Failed to update conversation"})
        
    }
}

export const saveMessage = async (req,res) => {
    try {
        const {conversationId,role,content,images} = req.body
        const userId = req.headers["x-user-id"]
        if (!userId) return res.status(401).json({message:"Unauthorized"})
        if (!mongoose.isValidObjectId(conversationId) || !["user","assistant"].includes(role) || typeof content !== "string" || !content.trim()) {
            return res.status(400).json({message:"A valid conversation, role, and message content are required"})
        }
        const conversation = await Conversation.exists({_id:conversationId,userId})
        if (!conversation) return res.status(404).json({message:"Conversation not found"})
        const message = await Message.create({
            conversationId,
            role,
            content,
            images
        })
        return res.status(200).json(message)

    } catch (error) {
        console.error("save message error",error)
        return res.status(500).json({message:"Failed to save message"})
        
        
    }
}

export const getMessages = async (req,res) => {
    try {
        const userId = req.headers["x-user-id"]
        const {conversationId} = req.params
        if (!userId) return res.status(401).json({message:"Unauthorized"})
        if (!mongoose.isValidObjectId(conversationId)) {
            return res.status(400).json({message:"A valid conversation id is required"})
        }
        const conversation = await Conversation.exists({_id:conversationId,userId})
        if (!conversation) return res.status(404).json({message:"Conversation not found"})
        const messages = await Message.find({
            conversationId
        }).sort({createdAt : 1})
        return res.status(200).json(messages)
    } catch (error) {
        console.error("get messages error",error)
        return res.status(500).json({message:"Failed to get messages"})
    }
}