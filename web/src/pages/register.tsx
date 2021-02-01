import axios from "axios";
import Head from "next/head";
import NextLink from "next/link";
import { FormEvent, useState } from "react";
import classNames from "classnames";
import InputGroup from "../components/InputGroup";
import { useRouter } from "next/router";
import { useAuthState } from "../context/auth";

export default function Register() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [agreement, setAgreement] = useState(false);
	const [errors, setErrors] = useState<any>({});

	const router = useRouter();

	const { authenticated } = useAuthState();

	if (authenticated) router.push("/");

	const submitForm = async (e: FormEvent) => {
		e.preventDefault();

		if (!agreement) {
			setErrors({ ...errors, agreement: "You Must agree to t and c;s" });
			return;
		}

		try {
			await axios.post("/auth/register", {
				email,
				password,
				username,
			});

			router.push("/login");
		} catch (error) {
			setErrors(error.response.data);
		}
	};

	return (
		<div className="flex bg-white">
			<Head>
				<title>Register</title>
			</Head>
			<div className="w-40 h-screen bg-blue-500 bg-cover"></div>
			<div className="flex flex-col justify-center pl-6 w-70">
				<h1 className="mb-2 text-lg">Sign Up</h1>
				<p className="mb-5 text-xs">Privacy policies</p>
				<form action="" className="mb-6" onSubmit={submitForm}>
					<input
						type="checkbox"
						className="mb-2 mr-2 cursor-pointer"
						id="agreement"
						checked={agreement}
						onChange={(e) => setAgreement(e.target.checked)}
					/>
					<label htmlFor="agreement" className="text-xs cursor-pointer">
						I agree
					</label>
					<small className="block font-medium text-red-600 d">
						{errors.agreement}
					</small>

					<InputGroup
						className="mt-4 mb-2"
						value={email}
						setValue={setEmail}
						placeholder="Email"
						error={errors.email}
						type="email"
					/>
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
						Sign Up
					</button>
				</form>
				<small>
					Already a redditor?{" "}
					<NextLink href="/login">
						<a href="" className="text-blue-500 ml1">
							Log in
						</a>
					</NextLink>
				</small>
			</div>
		</div>
	);
}
