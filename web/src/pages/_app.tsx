import "../styles/globals.css";
import "../styles/style.css";

import type { AppProps } from "next/app";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import React from "react";
import { AuthProvider } from "../context/auth";

axios.defaults.baseURL = "http://localhost:4000/api";
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
	const { pathname } = useRouter();
	const authRoutes = ["/register", "/login"];
	const authRoute = authRoutes.includes(pathname);

	return (
		<AuthProvider>
			{!authRoute && <Navbar />}
			<Component {...pageProps} />{" "}
		</AuthProvider>
	);
}

export default MyApp;
