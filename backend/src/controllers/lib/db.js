import mongoose from "mongoose"

export const connectDB =async () => {
    try {
        const connection = mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.log(err);
        
    }
}