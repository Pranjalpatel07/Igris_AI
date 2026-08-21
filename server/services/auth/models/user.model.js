import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid:{
        type:String,
        unique:true
    },
    name:String,
    email:String,
    avatar:String

},{timestamps:true})

const User = mongoose.model("user",userSchema)

export default User;