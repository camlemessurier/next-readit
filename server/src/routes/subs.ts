import { isEmpty } from "class-validator";
import { Response, Router } from "express";
import { Request } from "express";
import { getRepository } from "typeorm";
import Sub from "../entity/Sub";
import User from "../entity/User";
import auth from "../middleware/auth";
import user from "../middleware/user";

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

const router = Router();

router.post("/", user, auth, createSub);

export default router;
