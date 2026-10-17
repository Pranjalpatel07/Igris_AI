import fs from "fs"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { QdrantVectorStore } from "@langchain/qdrant"
import { getModel } from "../config/llmModels.js"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { embeddings } from "../config/embeddings.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"

export const pdfRag = async (state) => {
  const filePath = state?.file?.path

  try {
    await checkAgentLimit(state.userId,"pdf")
    if (!filePath) {
      return { ...state, aiResponse: "No PDF file was uploaded." }
    }

    const buffer = fs.readFileSync(filePath)
    const pdf = new PDFParse({ data: buffer })
    const result = await pdf.getText()
    const text = typeof result === "string" ? result : result?.text || ""

    if (!text.trim()) {
      return { ...state, aiResponse: "The uploaded PDF is empty or unreadable." }
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })

    const docs = await splitter.createDocuments([text])
    let context = text

    if (process.env.QDRANT_URL) {
      const collectionName = `pdf-${Date.now()}`
      const store = await QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: process.env.QDRANT_URL,
        collectionName,
      })

      const relevantDocs = await store.similaritySearch(state.prompt, 5)
      context = relevantDocs.map((doc) => doc.pageContent).join("\n\n")
    }

    const llm = await getModel("pdf-rag")

    const messages = [
      new SystemMessage(`You are Igris AI PDF Assistant.
Rules:

- Answer ONLY from the uploaded PDF.
- Never make up information.
- If the answer is not present in the PDF, reply:
  "I couldn't find this information in the uploaded PDF."
- Use Markdown formatting.
`),
      new HumanMessage(`Context:\n${context}\n\nQuestion:\n${state.prompt}`),
    ]

    const response = await llm.invoke(messages)
    await deductCredits(state.userId, "pdf")

    return {
      ...state,
      aiResponse: response?.content || "I couldn't find this information in the uploaded PDF.",
    }
  } catch (error) {
    console.error("PDF RAG error:", error)
    return{
            ...state,
            aiResponse:error?.data.message || "Failed to analyze pdf."
        }
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
}