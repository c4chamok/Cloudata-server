import mongoose, { Document } from "mongoose";

export interface IUser extends Document{
    _id: mongoose.Types.ObjectId,
    userName: string,
    email: string,
    hashedPassword: string,
    resetOTP: number | undefined,
    resetOTPExpires: Date | undefined,
    createdAt: Date,
    completed: boolean,
    isLoggedIn: boolean
}

const userSchema = new mongoose.Schema<IUser>({
    userName: { type: String },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    resetOTP: { type: Number },
    resetOTPExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: true },
    isLoggedIn: { type: Boolean }
})

const User = mongoose.model<IUser>("User", userSchema);

export default User