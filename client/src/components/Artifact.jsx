import {Code2, PanelRightClose} from "lucide-react"
import { useSelector } from "react-redux"

function Artifact() {
  const {artifacts} = useSelector(state=>state.message)
  return (
    <div className="hidden lg:flex h-full border-l border-white/6 flex-col overflow-hidden shrink-0 w-75">
      <div className="flex flex-col h-full bg-[#0d0f14]">
        <div className="h-14 px-4 border-b border-white/6 flex items-center gap-3 shrink-0">
          <button className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-poniter shrink-0">
            <PanelRightClose size={16}/>
          </button>
          <div >
            <Code2/>
          </div>
          <div className="">{artifacts[0].title}</div>
        </div>
      </div>
    </div>
  )
}

export default Artifact
