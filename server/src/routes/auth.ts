import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../entity/User";
import { Request, Response, Router } from "express";
import { isEmpty, validate } from "class-validator";
import jwt from "jsonwebtoken";
import cookie, { CookieSerializeOptions } from "cookie";
import auth from "../middleware/auth";

dotenv.config();

const register = async (req: Request, res: Response) => {
	const { email, username, password } = req.body;

	try {
		let errors: any = {};
		const emailUser = await User.findOne({ email });
		const usernameUser = await User.findOne({ username });

		if (emailUser) errors.email = "Email is already taken";
		if (usernameUser) errors.username = "username is already taken";

		const user = new User({ email, username, password });

		const error = await validate(user);

		if (Object.keys(error).length > 0) {
			return res.status(400).json(error);
		}

		await user.save();

		return res.status(200).json(user);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error });
	}
};

const cookieSettings: CookieSerializeOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict",
	path: "/",
};

const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	try {
		let errors: any = {};
		if (isEmpty(username)) errors.username = "Username must not be empty";
		if (isEmpty(password)) errors.password = "Password must not be empty";

		if (Object.keys(errors).length > 0) {
			return res.status(400).json(errors);
		}

		const user = await User.findOne({ username });

		if (!user) return res.status(404).json({ error: "user not found" });

		const passwordMatches = await bcrypt.compare(password, user.password);

		if (!passwordMatches) {
			return res.status(401).json({ password: "doens't match" });
		}

		const token = jwt.sign({ username }, process.env.JWT_SECRET!);

		res.set(
			"Set-Cookie",
			cookie.serialize("token", token, {
				...cookieSettings,
				maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
			})
		);

		return res.json(user);
	} catch (error) {
		console.log(error);
	}
};

const me = (req: Request, res: Response) => {
	return res.json(res.locals.user);
};

const logout = async (_: Request, res: Response) => {
	res.set(
		"Set-Cookie",
		cookie.serialize("token", "invalid token", {
			...cookieSettings,
			expires: new Date(0),
		})
	);

	return res.status(200).json({ success: true });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.get("/logout", auth, logout);

export default router;
