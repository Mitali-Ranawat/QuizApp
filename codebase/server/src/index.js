const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
// const path = require("path");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(morgan("tiny"));
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connection established successfully");
});

const userRouter = require("./routes/v1/user");
const quizRouter = require("./routes/v1/quizes");
app.use("/api/v1/user", userRouter);
app.use("/api/v1/quizes", quizRouter);

app.listen(port, console.log(`listing at port ${port}`));
