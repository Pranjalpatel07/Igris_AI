import axios from "axios"

export const getConversationMessages = async (conversationId, userId) => {
    const response = await axios.get(`${process.env.CHAT_SERVICE}/get-message/${conversationId}`, {
        headers: {"x-user-id": userId}
    })

    return response.data.reverse()
}