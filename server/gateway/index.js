import express from "express";
import dotenv from "dotenv"
import proxy from "express-http-proxy";

dotenv.config()
const app = express()

const port = process.env.PORT

app.use("/auth",proxy(process.env.AUTH_SERVICE))


app.listen(port,() => {
    console.log("GATEWAY is listening on port 8000")
})