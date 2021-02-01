import Link from "next/link";
import Image from "next/image";
import { useAuthDispatch, useAuthState } from "../context/auth";
import axios from "axios";

const Navbar: React.FC = () => {
	const { authenticated, loading } = useAuthState();
	const dispatch = useAuthDispatch();

	const logout = () => {
		axios
			.get("/auth/logout")
			.then(() => {
				dispatch("LOGOUT");
				window.location.reload();
			})
			.catch((err) => console.log());
	};

	return (
		<div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
			{/* Logo and title */}
			<div className="flex items-center">
				<Link href="/">
					<a className="w-8 h-8 mr-2 ">
						<Image src="/favicon.svg" width={50} height={50} />
					</a>
				</Link>
				<Link href="/">
					<a className="w-8 h-8 mr-2 ">
						<span className="text-xl font-semibold">Readit</span>
					</a>
				</Link>
			</div>
			<div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
				<i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
				<input
					type="text"
					className="py-1 pr-3 bg-transparent rounded focus:outline-none w-160"
					placeholder="Search"
				/>
			</div>
			<div className="flex">
				{!loading &&
					(authenticated ? (
						<button
							className="w-32 py-1 mr-5 leading-5 hollow blue button"
							onClick={logout}
						>
							Log out
						</button>
					) : (
						<>
							<Link href="/login">
								<a className="w-32 py-1 mr-5 leading-5 hollow blue button">
									log in
								</a>
							</Link>
							<Link href="/signup">
								<a className="w-32 py-1 leading-5 blue button">sign up</a>
							</Link>
						</>
					))}
			</div>
		</div>
	);
};

export default Navbar;
