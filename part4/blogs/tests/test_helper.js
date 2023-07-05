const Blog = require("../models/blog");
const User = require("../models/user");

const initialUser = {
	username: "testUser1",
	name: "testName",
	password: "testPassword",
};

const testUser = {
	username: "testUser2",
	name: "testName2",
	password: "testPassword2",
};

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

const newBlog = {
	title: "Blog 3 about mice",
	author: "Mickey Rat",
	url: "https://mouse-blog.fi/mouse-blog",
	likes: 13,
};

const editBlog = {
	title: "Blog 4 about something",
	author: "Test Author",
	url: "https://test-blog.com/test-blog",
	likes: 13,
};

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

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

module.exports = {
	initialUser,
	testUser,
	initialBlogs,
	editBlog,
	newBlog,
	nonExistingId,
	blogsInDb,
	usersInDb,
};
