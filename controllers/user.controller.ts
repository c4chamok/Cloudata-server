import dotenv from "dotenv";
dotenv.config();
import { Request, RequestHandler, Response } from "express";
import User from "../models/users.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import transporter from "../utilities/nodemailer";
import { AuthenticatedRequest } from "../middlewares/verifyToken";
import blacklistedToken from "../models/blacklistedToken.model";

const jwtSecret = process.env.JWT_SECRET as string;

export const userRegister = async (req: Request, res: Response) => {
  const { email, userName, password } = req.body;
  try {
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      userName,
      completed: true,
      hashedPassword,
      isLoggedIn: true,
    });
    await newUser.save();
    const objectId = newUser._id.toString();
    const token = jwt.sign({ userId: objectId }, jwtSecret, {
      expiresIn: "5h",
    });
    res.status(201).send({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

export const userLogin: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.send({ message: "Invalid email or password" });
      return;
    }
    const isMatched = await bcrypt.compare(
      password,
      existingUser.hashedPassword
    );
    if (isMatched) {
      existingUser.isLoggedIn = true;
      await existingUser.save();
      const objectId = existingUser._id.toString();
      const token = jwt.sign({ userId: objectId }, jwtSecret, {
        expiresIn: "5h",
      });
      res.send({ token });
    } else {
      res.send({ message: "Invalid email or password" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.send({ message: "no user found" });
      return;
    }
    existingUser.resetOTP = Math.ceil(100000 + Math.random() * 900000);
    existingUser.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await existingUser.save();

    await transporter.sendMail({
      to: email,
      subject: "Pass Reset Email",
      html: ` 
            from : Cloudera <br />
            here is your reset OTP <b> ${existingUser.resetOTP}</b>`,
    });
    res.send({ message: "An OTP has been sent to the email" });
  } catch (err: any) {
    res.send({ error: err.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    resetOTP: otp,
    resetOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({ error: "Invalid or expired OTP" });
    return;
  }

  const resetToken = jwt.sign({ email }, jwtSecret, { expiresIn: "10m" });

  res.json({ message: "OTP verified", resetToken });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, jwtSecret) as JwtPayload;
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    if (user.resetOTP === undefined || user.resetOTPExpires === undefined) {
      res.status(400).send({ error: "expired reset token" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.hashedPassword = await bcrypt.hash(newPassword, salt);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired reset token" });
  }
};

export const userLogout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(400).json({ message: "No authorization header provided" });
    return;
  }
  try {
    const token = authHeader.split(" ")[1];
    const newBlacklistedToken = new blacklistedToken({ token });
    await newBlacklistedToken.save();
    res.send({ message: "user logged out successfully" });
  } catch (error: any) {
    res.send({ error: error.message });
  }
};
