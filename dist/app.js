"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_controller_1 = require("./controllers/user.controller");
const verifyToken_1 = require("./middlewares/verifyToken");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello, Express with TypeScript!");
});
app.post("/api/auth/register", user_controller_1.userRegister);
app.post("/api/auth/login", user_controller_1.userLogin);
app.post("/api/auth/forgotpassword", user_controller_1.forgotPassword);
app.post("/api/auth/verifyotp", user_controller_1.verifyOTP);
app.post("/api/auth/reset-password", user_controller_1.resetPassword);
app.post("/api/auth/logout", verifyToken_1.verifyToken, user_controller_1.userLogout);
exports.default = app;
