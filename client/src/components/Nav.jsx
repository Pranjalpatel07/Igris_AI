import React from 'react'
import {MessageSquare} from 'lucide-react'
import {useSelector} from 'react-redux'
function Nav() {
    const {selectorConversation}=useSelector(state=>state.conversation)
    const {messages}=useSelector(state=>state.message)
  return (

    
      <div className='h-14 flex items-center px-5 border-b border-white/6 bg-[#0d0f14]'>
        <div>
            <MessageSquare/>
        </div>
        <div>
            {selectorConversation?.title || "New Chat"}
        </div>
        <div>
            {messages?.length} Messages
        </div>
      </div>
    
  )
}

export default Nav
