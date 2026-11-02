import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, Paperclip, Presentation, Send, X, Zap} from 'lucide-react'
import { useEffect, useState } from 'react'
import sendMessage from '../features/sendMessage';
import { useDispatch, useSelector } from 'react-redux';
import {addMessage, setArtifacts, setIsLoading} from '../redux/messageSlice'
import {createConversation} from '../features/createConversation'
import { addConversation, setConvTitle, setSelectConversation } from '../redux/conversationSlice';
import { updateConversation } from '../features/updateConversation';
import getCurrentUser from '../features/getCurrentUser';
import { setUserData } from '../redux/userSlice';
import { useRef } from 'react';

function ChatInput() {
  const [value,setValue] = useState("");
  const [selectedAgent,setSelectedAgent] = useState("auto")
  const [isSending,setIsSending] = useState(false)
  const {selectedConversation} = useSelector(state => state.conversation)
  const [selectedFile,setSelectedFile] = useState(null);
  const [listening,setListening] = useState(false);
  const [speechError,setSpeechError] = useState("");
  const recognitionRef = useRef(null);
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const speechSupported = typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(()=>{
    const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)
    if(!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang="en-US"
    recognition.interimResults=false
    recognition.continuous=false
    recognition.onresult=(event)=>{
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result)=>result[0]?.transcript || "")
        .join(" ")
        .trim()

      if (transcript) {
        setValue((currentValue)=>[currentValue.trim(),transcript].filter(Boolean).join(" "))
      }
    }
    recognition.onerror=(event)=>{
      setListening(false)
      setSpeechError(`Speech recognition failed: ${event.error}.`)
    }
    recognition.onend=()=>setListening(false)
    recognitionRef.current=recognition

    return ()=>{
      recognition.onresult=null
      recognition.onerror=null
      recognition.onend=null
      recognition.abort()
      recognitionRef.current=null
    }
  }, [])

  const handleToggleListening = () => {
    const recognition = recognitionRef.current
    if (!recognition) return

    setSpeechError("")
    if (listening) {
      recognition.stop()
      setListening(false)
      return
    }

    try {
      recognition.start()
      setListening(true)
    } catch (error) {
      setSpeechError(`Could not start speech recognition: ${error.message}`)
    }
  }

  const handleSendMessage = async () => {
    let conversation = selectedConversation
    const prompt = value.trim()
    if (!prompt || isSending) {
      console.warn("Message not sent: enter a prompt first.")
      return
    }
    setIsSending(true)
    dispatch(setIsLoading(true))
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

      const formData = new FormData()
      formData.append("prompt", prompt)
      formData.append("conversationId", conversation._id)
      formData.append("agent", selectedAgent)
      if (selectedFile) {
        formData.append("file", selectedFile)
      }

      dispatch(addMessage({role:"user",content:prompt,conversationId:conversation._id}))
      setValue("")

      const data = await sendMessage(formData)
      setSelectedFile(null)
      if (!data) return
      dispatch(setArtifacts(data.artifacts || []))
      dispatch(addMessage({
        role:"assistant",
        content:data?.answer,
        images:data.images,
        conversationId:conversation._id
      }))
      const updatedUser = await getCurrentUser()
      if (updatedUser) dispatch(setUserData(updatedUser))
    } finally {
      setIsSending(false)
      dispatch(setIsLoading(false))
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
      id:"vision",
      icon:ImageIcon,
      label:"vision"
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

          {
          selectedFile && (
            <div className='my-3'>

              <div className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2'>

              {
                selectedFile.type === "application/pdf" ? <FileText size={16} className='text-red-400'/> : selectedFile.type.startsWith("image/") && <img src={URL.createObjectURL(selectedFile)} className='h-10 w-10 rounded-xl object-cover mt-3'/>
              }

              <div>
                <p className='text-us text-white'>
                  {selectedFile?.name}
                </p>
                <p className='text-[10px] text-slate-500'>
                  {Math.ceil(selectedFile.size)}KB
                </p>
              </div>
                <button onClick={()=>{setSelectedFile(null); fileRef.current.value=""}} className='ml-2 '><X size={14} className='text-slate-500 hover:text-white'/></button>

              </div>

            </div>
          )}

          <textarea 
          placeholder='Ask Anything...'
          onChange={(e)=>setValue(e.target.value)}
          value={value}
          disabled={isSending}
          className='w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed scrollbar-none [&::-white-scrollbar]:hidden disabled:opacity-50' rows={3}/>

          <div className='flex items-centre justify-between'>
            <div className='flex items-center gap-1'>
              <input type="file" accept="application/pdf,image/*,.png,.jpg,.jpeg,.webp" hidden ref={fileRef} onChange={(e)=>{
                const file = e.target.files[0]
                if (file) {
                  setSelectedFile(file)
                }
              }} />

                <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer' onClick={()=>fileRef.current.click()}>
                    <Paperclip size={16}/>
                </button>
                <button
                  type="button"
                  onClick={handleToggleListening}
                  disabled={!speechSupported || isSending}
                  aria-label={listening ? "Stop speech recognition" : "Start speech recognition"}
                  aria-pressed={listening}
                  title={speechSupported ? (listening ? "Stop listening" : "Start voice input") : "Speech recognition is not supported"}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg border border-transparent transition-all duration-150 bg-transparent ${speechSupported && !isSending ? "text-slate-600 hover:text-slate-400 hover:bg-white/5 cursor-pointer" : "text-slate-700 cursor-not-allowed"} ${listening ? "text-red-400" : ""}`}
                >
                    <Mic size={16}/>
                </button>
                {(listening || speechError || !speechSupported) && (
                  <span role={speechError || !speechSupported ? "alert" : "status"} className={`text-xs ${speechError || !speechSupported ? "text-red-400" : "text-indigo-300"}`}>
                    {speechError || (speechSupported ? "Listening..." : "Speech recognition is not supported in this browser.")}
                  </span>
                )}
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
