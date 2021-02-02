import { isEmpty } from "class-validator";
import { NextFunction, Response, Router } from "express";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { getRepository } from "typeorm";
import Post from "../entity/Post";
import Sub from "../entity/Sub";
import User from "../entity/User";
import auth from "../middleware/auth";
import user from "../middleware/user";
import randomString from "../utils/randomString";
import makeid from "../utils/randomString";
import fs from "fs";

const createSub = async (req: Request, res: Response) => {
	const { name, title, description } = req.body;

	const user: User = res.locals.user;

	try {
		let errors: any = {};

		if (isEmpty(name)) errors.name = "name must not be empty";
		if (isEmpty(name)) errors.title = "title must not be empty";

		const sub = await getRepository(Sub)
			.createQueryBuilder("sub")
			.where("lower(sub.name) = :name", { name: name.toLowerCase() })
			.getOne();

		if (sub) errors.name = "Sub exists already";

		if (Object.keys(errors).length > 0) {
			throw errors;
		}
	} catch (error) {
		return res.status(400).json(error);
	}

	try {
		const sub = new Sub({ name, description, title, user });
		await sub.save();

		return res.json(sub);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

const getSub = async (req: Request, res: Response) => {
	const { name } = req.params;

	try {
		const sub = await Sub.findOneOrFail({ name });

		const posts = await Post.find({
			where: { sub },
			relations: ["comments", "votes"],
			order: { createdAt: "DESC" },
		});

		sub.posts = posts;

		if (res.locals.user) {
			sub.posts.forEach((p) => p.setUserVote(res.locals.user));
		}

		return res.json(sub);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error });
	}
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
	const user: User = res.locals.user;

	try {
		const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });

		if (sub.username !== user.username) {
			return res.status(403).json({ error: "You don't own this sub" });
		}

		res.locals.sub = sub;

		return next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

const upload = multer({
	storage: multer.diskStorage({
		destination: "public/images",
		filename: (req, file, callback) => {
			const name = randomString(15);
			callback(null, name + path.extname(file.originalname));
		},
	}),
	fileFilter: (_, file: any, callback: FileFilterCallback) => {
		if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
			callback(null, true);
		} else {
			callback(new Error("not an image"));
		}
	},
});

const uploadSubImage = async (req: Request, res: Response) => {
	//
	const sub: Sub = res.locals.sub;

	try {
		const type = req.body.type;

		if (type !== "image" && type !== "banner") {
			fs.unlinkSync(req.file.path);
			return res.status(400).json({ error: "invalide type" });
		}

		const urn = req.file.filename;

		if (type === "image") {
			sub.imageUrn = urn;
		} else {
			sub.bannerUrn = urn;
		}

		await sub.save();

		return res.json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "something went wrong" });
	}
};

const router = Router();
router.post("/", user, auth, createSub);
router.get("/:name", user, getSub);
router.post(
	"/:name/image",
	user,
	auth,
	ownSub,
	upload.single("file"),
	uploadSubImage
);

export default router;
