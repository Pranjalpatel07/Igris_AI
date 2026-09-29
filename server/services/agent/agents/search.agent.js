import { tavily } from "../config/tavily.js"


export const searchAgent = async (state) => {
    try{ 
        const results = await tavily.invoke({
            query: state.prompt
        })
        return {
            ...state,
            searchResults:results,
            images:Array.isArray(results.images)
                ? results.images.filter(image => typeof image === "string")
                : []
        }
    }catch(error){ 
        return {
            ...state,
            searchResults:null,
            images:[]
        }
    }
}