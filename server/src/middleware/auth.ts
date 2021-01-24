import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { NextFunction, Request } from "express";
import { Response } from "express";
import User from "../entity/User";

dotenv.config();

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { token } = req.cookies;

		if (!token) {
			throw new Error("Unauthenticated");
		}

		const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);

		const user = await User.findOne({ username });

		if (!user) throw new Error("Unauthenticated");

		res.locals.user = user;

		next();
	} catch (error) {
		console.log(error);
		return res.status(401).json(error.message);
	}
};
