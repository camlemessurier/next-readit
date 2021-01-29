import express = require("express");
import morgan = require("morgan");
import "reflect-metadata";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import cookieParser = require("cookie-parser");

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import subRoutes from "./routes/subs";
import cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: process.env.WEB_URL!,
	})
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subs", subRoutes);

app.get("/", (req, res) => res.send("hello world"));

app.listen(process.env.PORT, async () => {
	console.log("Server running at localhost:" + process.env.PORT);

	try {
		await createConnection();
		console.log("Database connected");
	} catch (err) {
		console.log(err);
	}
});
