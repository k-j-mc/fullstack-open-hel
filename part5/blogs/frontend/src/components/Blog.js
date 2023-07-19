import { forwardRef, useImperativeHandle, useState } from "react";

import PropTypes from "prop-types";

const Blog = forwardRef((props, refs) => {
	const { blog, user, handleLikeBlog, handleDeleteBlog } = props;

	const [visible, setVisible] = useState(false);
	const [visibleText, setVisibleText] = useState("View");

	const showWhenVisible = { display: visible ? "" : "none" };

	const toggleVisibility = () => {
		setVisible(!visible);
		setVisibleText(visible ? "View" : "Hide");
	};

	useImperativeHandle(refs, () => {
		return {
			toggleVisibility,
		};
	});

	const likeBlog = (blog) => {
		const likedBlog = { ...blog, likes: blog.likes + 1 };

		handleLikeBlog(likedBlog);
	};

	return (
		<div id="blog" className="blog">
			<div className="blogTitle">
				{blog.title} ({blog.author})
				<button id="blog-view" onClick={toggleVisibility}>
					{visibleText}
				</button>
			</div>

			<div id="blog-details" style={showWhenVisible}>
				<p>Url: {blog.url}</p>
				<div>
					Likes: {blog.likes}{" "}
					<button
						id="blog-like"
						className="blog-like"
						onClick={() => likeBlog(blog)}
					>
						Like
					</button>
				</div>
				<p>Uploaded by: {blog.user.name}</p>
				{blog.user.id === user.id && (
					<button
						id="blog-delete"
						onClick={() => handleDeleteBlog(blog)}
					>
						Remove
					</button>
				)}
			</div>
		</div>
	);
});

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	handleLikeBlog: PropTypes.func.isRequired,
	handleDeleteBlog: PropTypes.func.isRequired,
};

export default Blog;
