import Head from "next/head";
import { useRouter } from "next/router";
import React, { ChangeEvent, createRef, useEffect, useState } from "react";
import useSWR from "swr";
import Post from "../../../../server/src/entity/Post";
import Sub from "../../../../server/src/entity/Sub";
import PostCard from "../../components/PostCard";
import Image from "next/image";
import { useAuthState } from "../../context/auth";
import classNames from "classnames";
import axios from "axios";

export default function SubComp() {
	const router = useRouter();

	const subName = router.query.sub;

	const { authenticated, user } = useAuthState();

	const { data: sub, error, revalidate } = useSWR<Sub>(
		subName ? `/subs/${subName}` : null
	);

	const fileInputRef = createRef<HTMLInputElement>();

	const [ownSub, setOwnSub] = useState(false);

	useEffect(() => {
		if (!sub) return;
		setOwnSub(authenticated && user.username === sub.username);
	}, [sub]);

	const openFileInput = (type: string) => {
		if (!ownSub) return;
		fileInputRef.current.name = type;
		fileInputRef.current.click();
	};

	const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", fileInputRef.current.name);

		try {
			const res = await axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			revalidate();
		} catch (error) {
			console.log(error);
		}
	};

	if (error) {
		console.log(error);
		return <div>{error.error.message}</div>;
	}

	let postsMarkup;
	if (!sub) {
		postsMarkup = <p className="text-lg text-center">Loading..</p>;
	} else if (sub.posts.length === 0) {
		postsMarkup = <p className="text-lg text-center">No posts yet.</p>;
	} else {
		console.log(sub.imageUrl);
		postsMarkup = sub.posts.map((post) => (
			<PostCard key={post.identifier} post={post} />
		));
	}

	return (
		<>
			<Head>
				<title>{sub?.title}</title>
			</Head>
			{sub && (
				<>
					<input
						type="file"
						hidden={true}
						ref={fileInputRef}
						onChange={uploadImage}
					/>
					<div className="">
						<div
							className={classNames("bg-blue-500", {
								"cursor-pointer": ownSub,
							})}
							onClick={() => openFileInput("banner")}
						>
							{sub.bannerUrl ? (
								<div
									className="h-56 bg-blue-500"
									style={{
										backgroundImage: `url(${sub.bannerUrl})`,
										backgroundRepeat: "no-repeat",
										backgroundSize: "cover",
										backgroundPosition: "center",
									}}
								></div>
							) : (
								<div className="h-20"></div>
							)}
						</div>
						<div className="h-20 bg-white">
							<div className="container relative flex">
								<div className="absolute" style={{ top: -10 }}>
									<Image
										src={sub.imageUrl}
										alt="sub"
										className={classNames("rounded-full", {
											"cursor-pointer": ownSub,
										})}
										onClick={() => openFileInput("image")}
										width={70}
										height={70}
									></Image>
								</div>
								<div className="pt-2 pl-24">
									<div className="flex items-center">
										<h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
									</div>
									<p className="text-sm font-bold text-gray-500">{sub.name}</p>
								</div>
							</div>
						</div>
					</div>
					<div className="container flex pt-5">
						{sub && <div className="w-160">{postsMarkup}</div>}
					</div>
				</>
			)}
		</>
	);
}
