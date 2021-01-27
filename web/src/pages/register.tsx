import Head from "next/head";
import NextLink from "next/link";

export default function Register() {
	return (
		<div className="flex">
			<Head>
				<title>Register</title>
			</Head>
			<div className="w-40 h-screen bg-blue-500 bg-cover"></div>
			<div className="flex flex-col justify-center pl-6 w-70">
				<h1 className="mb-2 text-lg">Sign Up</h1>
				<p className="mb-5 text-xs">Privacy policies</p>
				<form action="" className="mb-6">
					<input
						type="checkbox"
						className="mb-6 mr-2 cursor-pointer"
						id="agreement"
					/>
					<label htmlFor="agreement" className="text-xs cursor-pointer">
						I agree
					</label>

					<div className="mb-2">
						<input
							type="email"
							className="w-full p-3 transition duration-200 border border-gray-300 rounded-lg outline-none bg-gray-50 focus:bg-white hover:bg-white"
							placeholder="Email"
						/>
					</div>

					<div className="mb-2">
						<input
							type="text"
							className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-gray-50 focus:bg-white hover:bg-white"
							placeholder="Username"
						/>
					</div>

					<div className="mb-2">
						<input
							type="password"
							className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-gray-50 focus:bg-white hover:bg-white"
							placeholder="Password"
						/>
					</div>
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
