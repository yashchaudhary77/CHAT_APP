import express from "express";
import authRoutes from "./routes/authRoute.js"
import messageRoutes from "./routes/messageRoute.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./controllers/lib/db.js";
import cors from 'cors';
import path from "path"
import { app, server } from "./controllers/lib/socket.js";
dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(express.json({limit:"5mb"}));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}
));
connectDB();
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,'../frontend/dist')))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}
server.listen(PORT,()=>{
    console.log("Running on Port "+PORT);
})
