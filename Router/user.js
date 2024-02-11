const Router = require("express");
const userRouter = Router();
const chessUser = require("../Model/userModal");
const bcrypt = require("bcrypt");

userRouter.post("/register", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const isUser = await chessUser.findOne({ userName });
    
    if (isUser?.userName) {
      return res.send({ message: "username already taken" });
    }
    if (!userName || !password) {
      return res.send({ message: "enter all credientals" });
    } 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new chessUser({
      userName,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(200).send({ message: "successfully signup with email" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "error occurred", error });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
 
    const validUser = await chessUser.findOne({ userName });
    console.log(validUser)
    if (!userName || !password) {
      return res.send({ message: "fill all the details" });
    }

    if (!validUser) {
      return res.send({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, validUser.password);
   
    if (!isMatch) {
      return res.send({ message: "Invalid Credentials" });
    }

    res.status(201).send({
      message: "Login successful",
      userDetails: validUser.name,
    });
  } catch (error) {
    return res.status(500).send({ message: "login error", error });
  }
});

module.exports = userRouter;
