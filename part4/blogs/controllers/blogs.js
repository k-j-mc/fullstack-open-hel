const blogsRouter = require("express").Router();

const { userExtractor } = require("../utils/middleware");

const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
	});

	if (blogs) {
		response.status(200).json(blogs);
	} else {
		response.status(400).end();
	}
});

blogsRouter.get("/:id", async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}
});

blogsRouter.post("/", userExtractor, async (request, response) => {
	const { author, likes, title, url } = request.body;

	const user = request.user;

	if (!user._id) {
		return response.status(404).json({ error: "User not found" });
	} else {
		const blog = new Blog({
			author: author,
			likes: likes,
			title: title,
			url: url,
			user: {
				id: user.id,
				username: user.username,
				name: user.name,
			},
		});

		const savedBlog = await blog.save();

		user.blogs = user.blogs.concat(savedBlog);
		await user.save();

		response.status(201).json(savedBlog);
	}
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
	const user = request.user;

	if (!user._id) {
		return response.status(404).json({ error: "User not found" });
	} else {
		const blog = await Blog.findById(request.params.id).populate("user", {
			id: 1,
		});

		if (!blog) {
			response.status(404).json({ error: "Resource does not exist" });
		}

		if (user._id.toString() === blog.user.id.toString()) {
			await User.findOneAndUpdate(
				{
					_id: user._id,
				},
				{
					$pull: {
						blogs: {
							_id: request.params.id,
						},
					},
				}
			);

			await Blog.findByIdAndRemove(request.params.id);
			response.status(204).end();
		} else {
			response
				.status(401)
				.json({ error: "Incorrect credentials to perform task" });
		}
	}
});

blogsRouter.put("/:id", userExtractor, async (request, response) => {
	const { author, likes, title, url } = request.body;

	const user = request.user;

	if (!user._id) {
		return response.status(404).json({ error: "User not found" });
	} else {
		const blog = await Blog.findById(request.params.id).populate("user", {
			id: 1,
		});

		const newBlog = {
			author: author,
			likes: likes,
			title: title,
			url: url,
		};

		if (!blog) {
			response.status(404).json({ error: "Resource does not exist" });
		}

		if (user._id.toString() === blog.user.id.toString()) {
			await Blog.findByIdAndUpdate(request.params.id, newBlog, {
				new: true,
			});

			response.status(204).end();
		} else {
			response
				.status(401)
				.json({ error: "Incorrect credentials to perform task" });
		}
	}
});

module.exports = blogsRouter;
