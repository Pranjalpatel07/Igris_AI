import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import fs from "fs";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const imageAnalyzer = async (state) => {
  const filePath = state?.file?.path

  try {
    await checkAgentLimit(state.userId,"image")
    if (!filePath) {
      return { ...state, aiResponse: "No image file was uploaded." }
    }

    const llm = await getModel("imageAnalyzer");

    const imageBuffer = fs.readFileSync(filePath);
    const base64image = imageBuffer.toString("base64");
    const messages = [
      new SystemMessage(
        `You are Igris AI image Analyzer agent.
Rule:

-Analyze only the uploaded image.
-Answer the user's question accurately.
-If text exists in the image, extract it.
-If charts or tables exist, explain them.
-If something is unclear, say so.
-Use Markdown when helpful.
-Do not hallucinate.
`
      ),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "analyze the image",
          },
          {
            type:"image_url",
            "image_url":{
                url:`data:${state.file.mimetype};base64,${base64image}`
            }
          }
        ],
      }),
    ];
    const response = await llm.invoke(messages)
    const answer = typeof response.content === "string"
      ? response.content
      : Array.isArray(response.content)
        ? response.content
            .filter((part) => part?.type === "text" && typeof part.text === "string")
            .map((part) => part.text)
            .join("\n")
        : ""

    if (!answer.trim()) {
      throw new Error("The image model returned an empty response.")
    }

    await deductCredits(state.userId,"vision")
    return{
        ...state,
        aiResponse:answer
    }

  } catch (error) {
    console.error("Image analysis error:", error)
    return{
            ...state,
            aiResponse:error?.data.message || "Failed to analyze image."
        }
  }finally{
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
};
