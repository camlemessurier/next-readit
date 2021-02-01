import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator";
import {
	BeforeInsert,
	Column,
	Entity as TOEntity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from "typeorm";
import Comment from "./Comment";
import Entity from "./Entity";
import Post from "./Post";
import User from "./User";

@TOEntity("votes")
export default class Vote extends Entity {
	constructor(vote: Partial<Vote>) {
		super();
		Object.assign(this, vote);
	}

	@Column()
	value: number;
	@ManyToOne(() => User)
	@JoinColumn({ name: "username", referencedColumnName: "username" })
	user: User;

	@Column()
	username: string;

	@ManyToOne(() => Post)
	post: Post;

	@ManyToOne(() => Post)
	comment: Comment;
}
