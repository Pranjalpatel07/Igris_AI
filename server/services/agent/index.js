import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

const port = process.env.PORT

const app = express()
app.use(express.json())
app.use("/",router)

app.get("/",(req,res) => {
    res.json({message:"hello from agent"})
})

const start = async () => {
    try {
        if (!port) throw new Error("PORT is required")
        await connectDB()
        app.listen(port,() => {
            console.log(`AGENT is running in port ${port}`)
        })
    } catch (error) {
        console.error("AGENT startup failed",error)
        process.exit(1)
    }
}

start()