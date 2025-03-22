import dotenv from "dotenv";
import app from "./app";
import mongoose from "mongoose";

dotenv.config();


const mongoDBConnect = async () => {
    await mongoose.connect(`${process.env.MONGO_URI}`);
  };
  mongoDBConnect()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => console.error("Connection error", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});