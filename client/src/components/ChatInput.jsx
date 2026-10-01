import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, Paperclip, Presentation, Send, Shrink, Zap} from 'lucide-react'
import { useState } from 'react'
import sendMessage from '../features/sendMessage';
import { useDispatch, useSelector } from 'react-redux';
import {addMessage, setArtifacts} from '../redux/messageSlice'
import {createConversation} from '../features/createConversation'
import { addConversation, setConvTitle, setSelectConversation } from '../redux/conversationSlice';
import { updateConversation } from '../features/updateConversation';

function ChatInput() {
  const [value,setValue] = useState("");
  const [selectedAgent,setSelectedAgent] = useState("auto")
  const [isSending,setIsSending] = useState(false)
  const {selectedConversation} = useSelector(state => state.conversation)
  const dispatch = useDispatch()

  const handleSendMessage = async () => {
    let conversation = selectedConversation
    const prompt = value.trim()
    if (!prompt || isSending) {
      console.warn("Message not sent: enter a prompt first.")
      return
    }
    setIsSending(true)
    try {
      if (!conversation) {
        const conv = await createConversation()
        if (!conv?._id) return
        dispatch(setSelectConversation(conv))
        dispatch(addConversation(conv))
        conversation=conv
      }
      if(conversation.title === "New Chat"){
        const title = prompt
        dispatch(setConvTitle({conversationId:conversation._id,title}))
        const updatedConversation = await updateConversation({id:conversation._id,title})
        conversation = updatedConversation || {...conversation,title}
      }

      const payload = {
        prompt,conversationId:conversation._id,
        agent:selectedAgent
      }

      dispatch(addMessage({role:"user",content:prompt}))
      setValue("")

      const data = await sendMessage(payload)
      if (!data) return
      dispatch(setArtifacts(data.artifacts || []))
      dispatch(addMessage({role:"assistant",content:data?.answer,images:data.images}))
    } finally {
      setIsSending(false)
    }
  }

  const agents = [
    {
      id:"auto",
      icon:Zap,
      label:"Auto"
    },
    {
      id:"chat",
      icon:MessageSquare,
      label:"Chat"
    },
    {
      id:"coding",
      icon:Code2,
      label:"Coding"
    },
    {
      id:"pdf",
      icon:FileText,
      label:"PDF"
    },
    {
      id:"ppt",
      icon:Presentation,
      label:"PPT"
    },
    {
      id:"image",
      icon:ImageIcon,
      label:"Image"
    },
    {
      id:"search",
      icon:Globe,
      label:"Search"
    }
  ]


  return (
    <div>
      <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/6 bg-[#0d0f14]'>
        <div className='flex flex-col gap-2 bg-white/3 border border-white/7 rounded-2xl px-4 pt-3.5 pb-3'>

          <div className='flex w-[80%] gap-2 flex-wrap '>
              {agents.map((agent) => {
                  const isActive = selectedAgent === agent.id
                  const Icon = agent.icon
                  return(
                    <div key={agent.id} onClick={() => {setSelectedAgent(agent.id)}} className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer
                    ${isActive ? "bg-linear-to-b from-indigo-500 to-violet-600 text-white border-transparent shadow[0_1px_8Px_rgba(99,102,241,35)]" : "bg-white/3 text-slate-600 border-white/6 hover:bg-white/7"}`}>

                      <Icon size={14} className={isActive ? "text-white" : "text-slate-500"}/>
                      {agent.label}

                    </div>
                  )
              })}
          </div>

          <textarea 
          placeholder='Ask Anything...'
          onChange={(e)=>setValue(e.target.value)}
          value={value}
          disabled={isSending}
          className='w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed scrollbar-none [&::-white-scrollbar]:hidden disabled:opacity-50' rows={3}/>

          <div className='flex items-centre justify-between'>
            <div>
                <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer'>
                    <Paperclip size={16}/>
                </button>
                <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer'>
                    <Mic size={16}/>
                </button>
            </div>
            <button disabled={!value.trim() || isSending} onClick={handleSendMessage} className='flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 bg-linear-to-r from-indigo-500 to-violet-700 hover:opacity-90 text-white'>
              <Send size={15}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
