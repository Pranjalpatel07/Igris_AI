import express from 'express'
import {createConversation, getConversations, updateConversation, getMessages} from "../controllers/chat.controller.js"

const router = express.Router()

router.post("/create-conversation",createConversation)
router.get("/get-conversations",getConversations)
router.post("/update-conversations",updateConversation)
router.post("/save-message",saveMessage)
router.get("/get-message/:conversationId",getMessages)
