import express from "express";
import User from "../models/user.js";
import Token from "../models/token.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().lean();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:email", async (req, res, next) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ mail: email });

    if (!user) {
      res.status(404).json({ message: `User not found with mail: ${email}` });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ mail: req.body.mail });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid) {
      res.status(200).json({ message: "You are logged in", user: user });
    } else {
      res.status(401).json({ message: "Bad credentials" });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      password: req.body.password,
    };

    const checkuser = await User.findOne({ mail: data.mail });

    if (checkuser) {
      const error = new Error("user already exist with mentioned mail id ");
      return next(error);
    }

    const saltCount = 10;
    data.password = await bcrypt.hash(data.password, saltCount);

    const user = await User.create(data);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/forgotpassword", async (req, res, next) => {
  try {
    const user = await User.findOne({ mail: req.body.mail });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const newTokenString = `${Math.floor(Math.random() * 1000000)}${
      user.firstname
    }`;

    const saltCount = 10;
    let hashedToken = await bcrypt.hash(newTokenString, saltCount);
    while (hashedToken.includes("/")) {
      hashedToken = await bcrypt.hash(newTokenString, saltCount);
    }

    const token = await Token.create({
      id: user._id,
      mail: user.mail,
      token: hashedToken,
    });

    console.log("Token saved", token.id);

    const mailTransporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "accounts@oiaes.com",
      to: req.body.mail,
      subject: `Reset Password - Login DEMO`,
      text: `Hi ${user.firstname}, \n
      Please use below link to reser your password, this link will expire in 20 minutes. \n
      ${process.env.FRONTEND_URI}/resetpassword/${encodeURIComponent(
        hashedToken
      )}`,
    };

    console.log(mailOptions);

    const info = await mailTransporter.sendMail(mailOptions);

    console.log("Mail sent", info);

    res.status(200).json({ token: newTokenString });
  } catch (err) {
    next(err);
  }
});

router.get("/resetpasswordvalidation/:token", async (req, res, next) => {
  try {
    const token = decodeURIComponent(req.params.token);
    console.log("validation token:", token);
    const tokenData = await Token.findOne({ token });

    console.log("Token", tokenData);

    const curTime = Date.now() - tokenData.createdAt;
    console.log(curTime);
    if (curTime < 1200000) {
      console.log("Valid request");
      return res.status(200).json({ message: "Valid Url" });
    } else {
      return res.status(401).json({ message: "Token expired" });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/changepassword", async (req, res, next) => {
  try {
    const token = decodeURIComponent(req.headers.token);
    console.log("headers token: ", token);
    const tokenUser = await Token.findOne({ token });
    console.log(tokenUser);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const userPassUpdate = await User.findOneAndUpdate(
      {
        mail: tokenUser.mail,
      },
      { password: hashedPassword }
    );

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
});

router.put("/:mail", async (req, res, next) => {
  try {
    const mail = req.params.mail;

    console.log(mail);

    const user = await User.findOneAndUpdate({ mail }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:mail", async (req, res, next) => {
  try {
    const mail = req.params.mail;
    const user = await User.findOneAndDelete({ mail }, { new: true });
    if (!user) {
      const err = new Error(`User not exist with mail id:${mail}`);
      return next(err);
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
