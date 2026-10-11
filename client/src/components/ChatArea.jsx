import { useEffect } from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector, useStore } from 'react-redux'
import getMessages from '../features/getMessage'
import { setArtifacts, setMessages } from '../redux/messageSlice'
function ChatArea() {
  const dispatch = useDispatch()
  const store = useStore()
  const selectedConversation = useSelector((state) => state.conversation.selectedConversation)

  useEffect(() => {
    const conversationId = selectedConversation?._id
    if (!conversationId) {
      dispatch(setMessages([]))
      dispatch(setArtifacts([]))
      return
    }

    let isCurrentConversation = true
    const getMessage = async () => {
      const data = await getMessages(conversationId)
      if (!isCurrentConversation) return

      const loadedMessages = Array.isArray(data) ? data : []
      const pendingMessages = store.getState().message.messages.filter(
        (message) => message?.conversationId === conversationId && !message?._id
      )
      const messages = [...loadedMessages]
      for (const pendingMessage of pendingMessages) {
        const alreadyLoaded = messages.some(
          (message) =>
            message.role === pendingMessage.role &&
            message.content === pendingMessage.content
        )
        if (!alreadyLoaded) messages.push(pendingMessage)
      }

      dispatch(setMessages(messages))
      const latestArtifacts = [...messages].reverse().find(
        (msg) => Array.isArray(msg?.artifacts) && msg.artifacts.length > 0
      )
      dispatch(setArtifacts(latestArtifacts?.artifacts ?? []))
    }

    getMessage()
    return () => {
      isCurrentConversation = false
    }
  }, [dispatch, store, selectedConversation?._id])
  return (
    <div className='flex-1 flex flex-col min-w-0'>
      <Nav/>
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea
