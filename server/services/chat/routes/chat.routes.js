import express from 'express'
import {createConversations, getConversations, updateConversation, getMessages, saveMessage} from "../controllers/chat.controller.js"

const router = express.Router()

router.post("/create-conversation",createConversations)
router.get("/get-conversations",getConversations)
router.post("/update-conversations",updateConversation)
router.post("/save-message",saveMessage)
router.get("/get-message/:conversationId",getMessages)

export default router