import { response, Response, Router } from "express";
import { Request } from "express";
import Comment from "../entity/Comment";
import Post from "../entity/Post";
import Sub from "../entity/Sub";
import auth from "../middleware/auth";

const createPost = async (req: Request, res: Response) => {
	const { title, body, sub } = req.body;
	const user = res.locals.user;

	if (title.trim() === "") {
		return res.status(400).json({ title: "title must not be empty" });
	}

	try {
		const subRecord = await Sub.findOneOrFail({ name: sub });

		const post = new Post({ title, body, user, sub: subRecord });
		await post.save();

		return res.json(post);
	} catch (error) {
		console.log(error);
		return res.json(error);
	}
};

const getPosts = async (req: Request, res: Response) => {
	try {
		const posts = await Post.find({
			order: { createdAt: "DESC" },
		});

		return res.json(posts);
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
};

const getPost = async (req: Request, res: Response) => {
	const { identifier, slug } = req.params;

	try {
		const posts = await Post.findOneOrFail(
			{ identifier, slug },
			{
				relations: ["sub"],
			}
		);

		return res.json(posts);
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
};

const commentOnPost = async (req: Request, res: Response) => {
	const { identifier, slug } = req.params;
	const { body } = req.body;

	try {
		const post = await Post.findOneOrFail({ identifier, slug });

		const comment = new Comment({ body, user: res.locals.user, post });

		await comment.save();

		return res.json(comment);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ error: "post not found" });
	}
};

const router = Router();

router.post("/", auth, createPost);
router.get("/", auth, getPosts);
router.get("/:identifier/:slug", getPost);
router.get("/:identifier/:slug/comments", auth, commentOnPost);

export default router;
