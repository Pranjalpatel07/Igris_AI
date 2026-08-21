import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";

dotenv.config()
const app = express()
connectDB()

const port = process.env.PORT


app.get("/",(req,res) => {
    res.json({message:"hello from auth"})
})

app.listen(port,() => {
    console.log(`AUTH is running in port ${port}`)
})