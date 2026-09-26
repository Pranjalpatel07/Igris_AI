import React, { useEffect } from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessage'
import { setMessages } from '../redux/messageSlice'
function ChatArea() {
  useEffect(()=>{
    const {selectorConversation}=useSelector(state=>state.conversation)
    const dispatch = useDispatch()
    const getMessage = async () => {
      if(selectorConversation){
        const data = await getMessages(selectorConversation?._id)
        dispatch(setMessages(data))
      }
    }
    getMessage()
  })
  return (
    <div className='flex-1 flex flex-col'>
      <Nav/>
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea
