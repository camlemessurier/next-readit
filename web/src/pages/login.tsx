import axios from "axios";
import Head from "next/head";
import NextLink from "next/link";
import { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../context/auth";
import User from "../../../server/src/entity/User";

export default function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<any>({});

	const router = useRouter();

	const dispatch = useAuthDispatch();

	const { authenticated } = useAuthState();

	if (authenticated) router.push("/");

	const submitForm = async (e: FormEvent) => {
		e.preventDefault();

		try {
			const res = await axios.post("/auth/login", {
				password,
				username,
			});

			dispatch("LOGIN", res.data);

			router.push("/");
		} catch (error) {
			setErrors(error.response.data);
		}
	};

	return (
		<div className="flex bg-white">
			<Head>
				<title>Login</title>
			</Head>
			<div className="w-40 h-screen bg-blue-500 bg-cover"></div>
			<div className="flex flex-col justify-center pl-6 w-70">
				<h1 className="mb-2 text-lg">Log in</h1>
				<form action="" className="mb-6" onSubmit={submitForm}>
					<InputGroup
						className="mb-2"
						value={username}
						setValue={setUsername}
						placeholder="Username"
						error={errors.username}
						type="text"
					/>
					<InputGroup
						className="mb-4"
						value={password}
						setValue={setPassword}
						placeholder="Password"
						error={errors.password}
						type="password"
					/>

					<button className="w-full py-2 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded mg-4">
						Log in
					</button>
				</form>
				<small>
					No account?{" "}
					<NextLink href="/register">
						<a href="" className="text-blue-500 ml1">
							Register
						</a>
					</NextLink>
				</small>
			</div>
		</div>
	);
}
