import { getModel } from "../config/llmModels.js"

export const codingAgent = async (params) => {
	const llm = await getModel("coding")
	const response = await llm.invoke([
		{
			role:"system",
			content:"You are Igris AI, a careful software engineering assistant. Provide correct, practical code and explain important assumptions briefly."
		},
		{
			role:"user",
			content:params.prompt
		}
	])

	return {
		...params,
		aiResponse:response.content
	}
}