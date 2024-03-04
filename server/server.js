import { config } from "dotenv";
config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import nodemailer from "nodemailer";
import mongoose, { Schema, model } from "mongoose";
import otpGenerator from "otp-generator";
import cors from "cors";
//middlewares & server creation...
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
// console.log(process.env.DBURL);
//DB connection...
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((error) => console.log(error));
//cors origin...
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
//schemas...
const conversationSchema = new Schema({
  sender: String,
  receiver: String,
  message: String,
  time: String,
});

const contactListSchema = new Schema({
  FullName: String,
  Email: String,
  Conversation: [conversationSchema],
});

const userSchema = new Schema({
  FullName: String,
  Email: String,
  OTP: Number,
  Verified: Boolean,
  ContactList: [contactListSchema],
});
//models...
const User = model("User", userSchema);
//Api's
app.post("/get_contacts", async (req, res) => {
  const { Email } = req.body;
  const currentUser = await User.findOne({ Email: Email });
  const contacts = currentUser.ContactList;
  const name = currentUser.FullName;
  // console.log(contacts);
  res.json({ contacts: contacts, name: name });
});
app.post("/handleSignIn", async (req, res) => {
  const { FullName, Email } = req.body;
  if (await User.findOne({ Email: Email })) {
    res.json({ response: "Email Exists" });
  } else {
    // console.log(FullName, Email);
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    // console.log(otp);
    var transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shaikmehatab333786333@gmail.com",
        pass: "ednv ntaj dufl toan",
      },
    });

    const mailOptions = {
      from: "shaikmehatab333786333@gmail.com",
      to: Email,
      subject: "Email Verification",
      text: `${otp} is the OTP to verify your email`,
      html: `<p style="font-size: 16px; color: green;" >${otp} is the OTP to verify your email<p>`,
    };
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.sendStatus(400);
      } else {
        console.log("Email sent: ", info.messageId);
        res.sendStatus(200);
      }
    });
    const newUser = new User({
      FullName: FullName,
      Email: Email,
      OTP: otp,
      Verified: false,
    });
    await newUser
      .save()
      .then(() => console.log("saved user!"))
      .catch((err) => console.error(err));
  }
});
app.post("/handleOPTVerification", async (req, res) => {
  const { VerificationCode, Email } = req.body;
  const currentUser = await User.findOne({ Email: Email });
  if (currentUser.OTP == VerificationCode) {
    res.json({ response: "matched" });
    currentUser.Verified = true;
    await currentUser.save();
  } else {
    res.json({ response: "not matched" });
  }
});
app.post("/handleLogIn", async (req, res) => {
  const { Email } = req.body;
  const currentUser = await User.findOne({ Email: Email });
  if (currentUser) {
    res.json({ message: "found" });
  } else {
    res.json({ message: "not found" });
  }
});
app.post("/handleNewContact", async (req, res) => {
  const { FullName, Email, Contact } = req.body;
  if (await User.findOne({ Email: Contact })) {
    const currentUser = await User.findOne({ Email: Email });
    currentUser.ContactList.push({ FullName: FullName, Email: Contact });
    await currentUser.save();
    const contacts = currentUser.ContactList;
    res.json({ contacts: contacts });
  } else {
    res.json({ message: "not found" });
  }
});
app.post("/get_conversation", async (req, res) => {
  const { userEmail, chatEmail } = req.body;
  const currentUser = await User.findOne({ Email: userEmail });
  const key = "Email";
  const value = chatEmail;
  const chatUser = () => {
    for (const obj of currentUser.ContactList) {
      if (key in obj && obj[key] === value) {
        return obj;
      }
    }
    return null;
  };
  const chatUserObj = chatUser();
  // console.log("user....", chatUserObj.Conversation);
  res.send(chatUserObj.Conversation);
});
//web sockets...
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("sendMessage", async (data) => {
    console.log(data);
    //save to the sender
    const sender = await User.findOne({ Email: data.sender });
    const key = "Email";
    const value = data.receiver;
    const receiverUser = () => {
      for (const obj of sender.ContactList) {
        if (key in obj && obj[key] === value) {
          return obj;
        }
      }
      return null;
    };
    const receiverUserObj = receiverUser();
    const sendersMessage = {
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      time: data.time,
    };
    receiverUserObj.Conversation.push(sendersMessage);
    await sender.save();

    //save to the receiver
    const receiver = await User.findOne({ Email: data.receiver });
    const hasSender = receiver.ContactList.some(
      (item) => item.Email === data.sender
    );
    if (!hasSender) {
      const AddNewContact = {
        FullName: data.name,
        Email: data.sender,
      };
      receiver.ContactList.push(AddNewContact);
      await receiver.save();
    }
    const keys = "Email";
    const values = data.sender;
    const senderUser = () => {
      for (const obj of receiver.ContactList) {
        if (key in obj && obj[keys] === values) {
          return obj;
        }
      }
      return null;
    };
    const senderUserObj = senderUser();
    const receiverMessage = {
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      time: data.time,
    };
    // console.log("..............................", receiverMessage);
    senderUserObj.Conversation.push(receiverMessage);
    await receiver.save();

    socket.to(data.receiver).emit("received", {
      message: data.message,
      sender: data.sender,
      receiver: data.receiver,
    });
  });
  socket.on("joinRoom", (data) => {
    console.log(data.roomID);
    socket.join(data.roomID);
  });
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});

server.listen(5000, () => {
  console.log("server running at http://localhost:5000");
});