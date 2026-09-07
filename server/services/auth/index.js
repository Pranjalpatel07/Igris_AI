import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import router from "./routes/auth.route.js";

dotenv.config()
const app = express()
connectDB()
app.use(express.json())

const port = process.env.PORT

app.use("/",router)

app.get("/",(req,res) => {
    res.json({message:"hello from auth"})
})

app.listen(port,() => {
    console.log(`AUTH is running in port ${port}`)
})