import express from "express";
import userControl from "./routecontroller/users.js";
import logger from "./middleware/logger.js";
import errorHandle from "./middleware/error.js";
import connectDB from "./config/db.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(logger);
app.use(cors({ origin: process.env.FRONTEND_URI }));

app.get("/", (req, res) => {
  res.json({ name: "Bejjanki Kalyan Reddy" });
});

app.use("/users", userControl);
app.use(errorHandle);

const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => console.log(`Backend started at port ${port}`));
