import { Request, Response, Router } from "express";
import Comment from "../entity/Comment";
import Post from "../entity/Post";
import User from "../entity/User";
import Vote from "../entity/Vote";
import auth from "../middleware/auth";
import user from "../middleware/user";

const router = Router();

const vote = async (req: Request, res: Response) => {
	const { identifier, slug, commentIdentifer, value } = req.body;

	// validate value

	if (![-1, 1, 0].includes(value)) {
		return res.status(400).json({ value: "value must be asdfa" });
	}

	try {
		const user: User = res.locals.user;

		let post = await Post.findOneOrFail({ identifier, slug });
		let vote: Vote | undefined;
		let comment: Comment | undefined;

		if (commentIdentifer) {
			comment = await Comment.findOneOrFail({ identifier: commentIdentifer });
			vote = await Vote.findOne({ user, comment });
		} else {
			vote = await Vote.findOne({ user, post });
		}

		if (!vote && value === 0) {
			return res.status(404).json({ error: "vote not found" });
		} else if (!vote) {
			vote = new Vote({ user, value });
			if (comment) vote.comment = comment;
			else vote.post = post;
			await vote.save();
		} else if (value === 0) {
			await vote.remove();
		} else if (vote.value !== value) {
			vote.value = value;
			await vote.save();
		}

		post = await Post.findOneOrFail(
			{ identifier, slug },
			{ relations: ["comments", "comments.votes", "sub", "votes"] }
		);

		post.setUserVote(user);

		post.comments.forEach((c) => c.setUserVote(user));

		return res.json(post);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

router.post("/vote", user, auth, vote);

export default router;
