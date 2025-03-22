import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
    token: { type: String },
    tokenExpires: { 
        type: Date, 
        required: true, 
        default: () => new Date(Date.now() + 5 * 60 * 60 * 1000), 
        index: { expires: 1 } 
    },
})


const blacklistedToken = mongoose.model("blacklistedToken", blacklistedTokenSchema);

export default blacklistedToken