import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/chat.routes.js";

const app = express()
app.use(express.json())

const port = process.env.PORT

app.use("/",router)

app.get("/",(req,res) => {
    res.json({message:"hello from chat"})
})

const start = async () => {
    try {
        if (!port) throw new Error("PORT is required")
        await connectDB()
        app.listen(port,() => {
            console.log(`CHAT is running in port ${port}`)
        })
    } catch (error) {
        console.error("CHAT startup failed",error)
        process.exit(1)
    }
}

start()