const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const Routes = require("./Routes/routes");

app.use(
  cors({
    origin: ["*", "http://localhost:5173"],
    method: ["GET", "POST", "PUT", "PATCH"],
    Credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const url =
  "mongodb+srv://krishnapriyama185:iAdnppPlKKArri2h@cluster0.qos9zgn.mongodb.net/Voltix-MERN";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Sucessfully Installed");
  })
  .catch((err) => {
    console.log(err.message, "---dbError");
  });

app.listen(4000, () => {
  console.log("Server Started on Port 4000");
});

app.use(express.json());
app.use(cookieParser());
app.use("/", Routes);
