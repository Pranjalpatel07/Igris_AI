import { useEffect } from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessage'
import { setMessages } from '../redux/messageSlice'
function ChatArea() {
  const dispatch = useDispatch()
  const selectedConversation = useSelector((state) => state.conversation.selectedConversation)

  useEffect(() => {
    const conversationId = selectedConversation?._id
    if (!conversationId) {
      dispatch(setMessages([]))
      return
    }

    const getMessage = async () => {
      const data = await getMessages(conversationId)
      dispatch(setMessages(data))
    }

    getMessage()
  }, [dispatch, selectedConversation?._id])
  return (
    <div className='flex-1 flex flex-col min-w-0'>
      <Nav/>
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea
