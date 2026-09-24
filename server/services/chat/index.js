import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";

dotenv.config()
const app = express()
connectDB()
app.use(express.json())

const port = process.env.PORT

// app.use("/",router)

app.get("/",(req,res) => {
    res.json({message:"hello from chat"})
})

app.listen(port,() => {
    console.log(`chat is running in port ${port}`)
})