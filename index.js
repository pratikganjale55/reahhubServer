const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const connection = require("./Database/Connection");
const playerEndPointRoute = require("./Router/playerEndPoint");
const userRouter = require("./Router/user");

dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("files"));
 

app.get("/", (req, res) => {
  res.send({ message: "Welcome to Chess app" });
});
app.use("/", playerEndPointRoute);
app.use("/", userRouter);

app.listen(process.env.PORT || 8080, async () => {
  await connection;
  console.log(`Server start at ${process.env.PORT}`);
});
