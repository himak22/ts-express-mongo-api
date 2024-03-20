import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables
const app = express();
const mongoUrl = process.env.MONGO_URI;

app.use(
  // Enable CORS
  cors({
    credentials: true, // Allow cookies to be sent
  })
);

app.use(compression()); // Compress all routes
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.json()); // Parse JSON

const server = http.createServer(app); // Create server

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});

mongoose.Promise = Promise; // Use native promises
mongoose.connect(mongoUrl); // Connect to MongoDB
mongoose.connection.on("error", (error: Error) => console.log(error)); // Log errors

app.use("/", router()); // Use the router
