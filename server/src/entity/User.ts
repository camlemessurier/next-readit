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

@TOEntity("users")
export default class User extends Entity {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}

	@IsEmail()
	@Column({ unique: true })
	email: string;

	@Length(2, 30, { message: "username must be longer" })
	@Column({ unique: true })
	username: string;

	@Exclude()
	@Length(2, 30, { message: "username must be longer" })
	@Column()
	password: string;

	@OneToMany(() => Post, (post) => post.user)
	posts: [Post];

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 6);
	}
}