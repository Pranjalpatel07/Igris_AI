import mongoose from "mongoose";


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database is connected")
    }catch(err){
        console.log("database connection error",err)
    }
}

export default connectDB