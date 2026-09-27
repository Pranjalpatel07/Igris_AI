import api from '../../utils/axios'

async function sendMessage(payload) {
  
    try {
        const {data} = await api.post("/api/agent/chat",payload)
        return data
    } catch (error) {
        console.error("Agent request failed:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        })
        return null
    }
  
}

export default sendMessage
