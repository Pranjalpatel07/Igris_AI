import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/auth.route.js";

const app = express()
app.use(express.json())

const port = process.env.PORT

app.use("/",router)

app.get("/",(req,res) => {
    res.json({message:"hello from auth"})
})

const start = async () => {
    try {
        if (!port) throw new Error("PORT is required")
        await connectDB()
        app.listen(port,() => {
            console.log(`AUTH is running in port ${port}`)
        })
    } catch (error) {
        console.error("AUTH startup failed",error)
        process.exit(1)
    }
}

start()