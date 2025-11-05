import cloudinary from "./lib/cloudinary.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { getRecieveSocketId } from "./lib/socket.js";
import { io } from "./lib/socket.js";

export const getUsersForSidebar = async(req,res)=>{
    try {
        const loggedInUser = req.user._id;
        const filteredUser = await User.find({_id:{$ne:loggedInUser}}).select("-password");
        res.status(200).json(filteredUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server error"}) 
    }
}
export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId , reciverId:userToChatId},
                {senderId:userToChatId,reciverId:myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server error"})
    }
}
export const sendMessage = async(req,res)=>{
    try {
        const {text,image} = req.body;
        const{id:reciverId}=req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadRespone = await cloudinary.uploader.upload(image);
            imageUrl = uploadRespone.secure_url;
        }
        const newMessage = new Message({
            senderId,
            reciverId,
            text,
            image:imageUrl,
        });
        await newMessage.save();
        const reciverSocketId = getRecieveSocketId(reciverId);
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage",newMessage);
        }
        // realtime functionality by using socket.io
        res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server error"})
    }
}