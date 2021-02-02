import Link from "next/link";
import React from "react";
import Post from "../../../server/src/entity/Post";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import classNames from "classnames";

dayjs.extend(relativeTime);

const ActionButton = ({ children }) => {
	return (
		<div className="px-1 py-1 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200">
			{children}
		</div>
	);
};

interface PostCardProps {
	post: Post;
}

const PostCard: React.FC<PostCardProps> = ({
	post: {
		identifier,
		slug,
		title,
		body,
		subName,
		createdAt,
		voteScore,
		username,
		url,
		commentCount,
		userVote,
	},
}) => {
	const vote = async (value) => {
		try {
			const res = await axios.post("/misc/vote", {
				identifier,
				slug,
				value,
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<div key={identifier} className="flex mb-4 bg-white rounded">
				<div className="w-10 py-2 text-center bg-gray-200 rounded-l">
					<div
						className="text-gray-400 rounded cursor-pointer w-6-mx-auto hover:bg-gray-300 hover:text-red-500 "
						onClick={() => vote(1)}
					>
						<i
							className={classNames("icon-arrow-up", {
								"text-red-500": userVote == 1,
							})}
						></i>
					</div>
					<p className="text-xs font-bold">{voteScore}</p>
					<div
						className="text-gray-400 rounded cursor-pointer w-6-mx-auto hover:bg-gray-300 hover:text-blue-600 "
						onClick={() => vote(-1)}
					>
						<i
							className={classNames("icon-arrow-down", {
								"text-blue-600": userVote == -1,
							})}
						></i>
					</div>
				</div>
				<div className="w-full p-2">
					<div className="flex items-center">
						<Link href={`/r/${subName}`}>
							<Image
								className="rounded-full cursor-pointer"
								src="/no-img.png"
								width={15}
								height={15}
							/>
						</Link>
						<Link href={`/r/${subName}`}>
							<a className="pl-1 text-xs font-bold cursor-pointer hover:underline">
								/r/{subName}
							</a>
						</Link>
						<p className="text-xs text-gray-500">
							<span className="mx-1">•</span>
							Posted by
							<Link href={`/u/${username}`}>
								<a className="mx-1 hover:underline">{username}</a>
							</Link>
							<Link href={url}>
								<a className="mx-1 hover:underline">
									{dayjs(createdAt).fromNow()}
								</a>
							</Link>
						</p>
					</div>
					<Link href={url}>
						<a className="my-1 text-lg font-medium">{title}</a>
					</Link>
					{body && <p className="my-1 text-sm">{body}</p>}

					<div className="flex">
						<Link href={url}>
							<a href="">
								<ActionButton>
									<i className="mr-1 fas fa-comment-alt fa-xs"></i>
									<span>{commentCount} Comments</span>
								</ActionButton>
							</a>
						</Link>
						<Link href={url}>
							<a href="">
								<ActionButton>
									<i className="mr-1 fas fa-share-alt fa-xs"></i>
									<span>Share</span>
								</ActionButton>
							</a>
						</Link>
						<Link href={url}>
							<a href="">
								<ActionButton>
									<i className="mr-1 fas fa-bookmark fa-xs"></i>
									<span>Save</span>
								</ActionButton>
							</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostCard;
