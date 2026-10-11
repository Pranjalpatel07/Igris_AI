import axios from "axios"


export const deductCredits = async (userId,agent) => {
    const response = await axios.post(`${process.env.AUTH_SERVICE}/deduct-credits`, {
        userId,agent
    })

    return response.data
}