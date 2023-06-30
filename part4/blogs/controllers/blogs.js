const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({});

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

blogsRouter.post("/", async (request, response) => {
	const { author, likes, title, url } = request.body;

	const blog = new Blog({
		author: author,
		likes: likes,
		title: title,
		url: url,
	});

	const savedBlog = await blog.save();
	response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
	const { author, likes, title, url } = request.body;

	const blog = {
		author: author,
		likes: likes,
		title: title,
		url: url,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	});

	if (updatedBlog) {
		response.status(204).json(updatedBlog);
	} else {
		response.status(400).end();
	}
});

module.exports = blogsRouter;
