import dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import blacklistedToken from "../models/blacklistedToken.model";


const jwtSecret = process.env.JWT_SECRET as string;

export interface AuthenticatedRequest extends Request {
  user: { userId?: string };
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try{
      const token = req.headers.authorization.split(" ")[1];
      const isBlacklisted = await blacklistedToken.findOne({token});
      if(isBlacklisted){
        throw new Error("token is blacklisted ")
      }
      const decoded = jwt.verify(token, jwtSecret) as { userId?: string };
      (req as AuthenticatedRequest).user = decoded
      next();
  }catch(err: any){
    res.status(401).json({ message: "Unauthorized" });
  }
};
