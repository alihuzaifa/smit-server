import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import router from "./routes/userRoutes.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import Path from "path";

// BASIC INITIALLIZATION
const app = express();
const mongodbURI =
  process.env.mongodbURI ||
  "mongodb+srv://huzaifa:huzaifa123@cluster0.p2sb1ug.mongodb.net/?retryWrites=true&w=majority";
const port = process.env.PORT || 5000;

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
  })
);
app.use("/api", router);

const __dirname = Path.resolve();
app.use(
  "/",
  express.static(Path.join(__dirname, "./Admin-Hackathon-main/build"))
);
app.use(
  "*",
  express.static(Path.join(__dirname, "./Admin-Hackathon-main/build"))
);

app.listen(port, () => {
  console.log("object");
});

// Connect Server with mongodb
mongoose.connect(mongodbURI);
mongoose.set("strictQuery", true);

// mongodb connected disconnected all events

//connected
mongoose.connection.on("connected", function () {
  console.log("Mongoose is connected");
});

//disconnected
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose is disconnected");
  process.exit(1);
});

//any error
mongoose.connection.on("error", function (err) {
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

//this function will run jst before app is closing
process.on("SIGINT", function () {
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
