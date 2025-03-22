import express, { Request, Response } from "express";
import cors from "cors";
import { forgotPassword, resetPassword, userLogin, userLogout, userRegister, verifyOTP } from "./controllers/user.controller";
import { verifyToken } from "./middlewares/verifyToken";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

app.post("/api/auth/register", userRegister);
app.post("/api/auth/login", userLogin);
app.post("/api/auth/forgotpassword", forgotPassword);
app.post("/api/auth/verifyotp", verifyOTP);
app.post("/api/auth/reset-password", resetPassword);
app.post("/api/auth/logout", verifyToken, userLogout);


export default app;