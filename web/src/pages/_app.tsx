import "../styles/globals.css";
import "../styles/style.css";

import type { AppProps } from "next/app";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import React from "react";
import { AuthProvider } from "../context/auth";
import { SWRConfig } from "swr";

axios.defaults.baseURL = "http://localhost:4000/api";
axios.defaults.withCredentials = true;

const fetcher = (url: string) =>
	axios
		.get(url)
		.then((res) => res.data)
		.catch((err) => {
			console.log(err);
			throw err.response.data;
		});

function MyApp({ Component, pageProps }: AppProps) {
	const { pathname } = useRouter();
	const authRoutes = ["/register", "/login"];
	const authRoute = authRoutes.includes(pathname);

	return (
		<SWRConfig value={{ fetcher }}>
			<AuthProvider>
				{!authRoute && <Navbar />}
				<div className={authRoute ? "" : "pt-12"}>
					<Component {...pageProps} />{" "}
				</div>
			</AuthProvider>
		</SWRConfig>
	);
}

export default MyApp;
