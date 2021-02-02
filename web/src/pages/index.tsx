import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "../../../server/src/entity/Post";
import Link from "next/link";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import PostCard from "../components/PostCard";
import useSWR from "swr";

dayjs.extend(relativeTime);

export default function Home() {
	const { data: posts } = useSWR("/posts");

	return (
		<>
			<Head>
				<title>Readit</title>
			</Head>
			<div className="container flex pt-4">
				<div className="w-160">
					{posts?.map((post) => (
						<PostCard post={post} key={post.identifier} />
					))}
				</div>
			</div>
		</>
	);
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	try {
// 		const res = await axios.get("/posts");

// 		return { props: { posts: res.data } };
// 	} catch (error) {
// 		return { props: { error: "Something went wrong" } };
// 	}
// };
