import { useState } from "react";

import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");
	const [likes, setLikes] = useState(0);

	const addBlog = (event) => {
		event.preventDefault();

		createBlog({
			author: author,
			title: title,
			url: url,
			likes: likes,
		});

		setTitle("");
		setAuthor("");
		setUrl("");
		setLikes(0);
	};

	return (
		<form onSubmit={addBlog}>
			<div>
				title:{" "}
				<input
					type="text"
					name="newBlogTitle"
					value={title}
					onChange={({ target }) => setTitle(target.value)}
				/>
			</div>
			<div>
				author:{" "}
				<input
					type="text"
					name="newBlogAuthor"
					value={author}
					onChange={({ target }) => setAuthor(target.value)}
				/>
			</div>
			<div>
				Url:{" "}
				<input
					type="text"
					name="newBlogUrl"
					value={url}
					onChange={({ target }) => setUrl(target.value)}
				/>
			</div>
			<div>
				likes:{" "}
				<input
					type="number"
					name="newBlogLikes"
					value={likes}
					onChange={({ target }) => setLikes(target.value)}
				/>
			</div>
			<div>
				<button type="submit">save blog</button>
			</div>
		</form>
	);
};

BlogForm.propTypes = {
	createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
