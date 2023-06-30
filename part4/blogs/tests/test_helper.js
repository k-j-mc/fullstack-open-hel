const Blog = require("../models/blog");

const initialBlogs = [
	{
		title: "Blog 1 about dogs",
		author: "Al Hill",
		url: "https://blogz.biz/dog-blog",
		likes: 1,
	},
	{
		title: "Blog 2 about hats",
		author: "Dennis Something",
		url: "https://blog-hat.net/hat-blog",
		likes: 3,
	},
];

const nonExistingId = async () => {
	const blog = new Blog({ content: "willremovethissoon" });
	await blog.save();
	await blog.deleteOne();

	return blog._id.toString();
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb,
};
