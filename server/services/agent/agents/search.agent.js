import { deductCredits } from "../utils/deductCredits.js"
import { tavily } from "../config/tavily.js"
import { checkAgentLimit } from "../config/agentLimit.js"


export const searchAgent = async (state) => {
    try{ 
        await checkAgentLimit(state.userId,"search")
        const results = await tavily.invoke({
            query: state.prompt
        })
        await deductCredits(state.userId,"search")
        return {
            ...state,
            searchResults:results,
            images:Array.isArray(results.images)
                ? results.images.filter(image => typeof image === "string")
                : []
        }
    }catch(error){ 
        return{
            ...state,
            aiResponse:error?.data.message || "Failed to generate pdf.",
            searchResults:null,
            images:[]
        }
    }
}