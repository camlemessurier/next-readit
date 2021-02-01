import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator";
import {
	BeforeInsert,
	Column,
	Entity as TOEntity,
	Index,
	OneToMany,
} from "typeorm";
import Entity from "./Entity";
import Post from "./Post";
import Vote from "./Vote";

@TOEntity("users")
export default class User extends Entity {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}

	@IsEmail(undefined, { message: "Must be a valid email address" })
	@Column({ unique: true })
	email: string;

	@Length(2, 30, { message: "Must be 3 chracters long" })
	@Column({ unique: true })
	username: string;

	@Exclude()
	@Length(2, 30, { message: "Must be 3 chracters long" })
	@Column()
	password: string;

	@OneToMany(() => Post, (post) => post.user)
	posts: [Post];

	@OneToMany(() => Vote, (vote) => vote.user)
	votes: [Vote];

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 6);
	}
}
