import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { NextFunction, Request } from "express";
import { Response } from "express";
import User from "../entity/User";

dotenv.config();

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user: User | undefined = res.locals.user;

		if (!user) {
			throw new Error("Not authenticated");
		}

		return next();
	} catch (error) {
		console.log(error);
		return res.status(401).json(error.message);
	}
};
