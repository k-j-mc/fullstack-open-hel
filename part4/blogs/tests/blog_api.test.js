const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
	await Blog.deleteMany({});

	const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
	const promiseArray = blogObjects.map((blog) => blog.save());
	await Promise.all(promiseArray);
});
describe("receive and add blog data", () => {
	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all blogs are returned", async () => {
		const response = await api.get("/api/blogs");

		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test("a specific blog is within the returned blogs", async () => {
		const response = await api.get("/api/blogs");

		const titles = response.body.map((obj) => obj.title);
		expect(titles).toContain("Blog 2 about hats");
	});

	test("a valid blog can be added", async () => {
		const newBlog = {
			title: "Blog 3 about mice",
			author: "Mickey Rat",
			url: "https://mouse-blog.fi/mouse-blog",
			likes: 13,
		};

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		const titles = blogsAtEnd.map((obj) => obj.title);
		expect(titles).toContain("Blog 3 about mice");
	});
});

describe("Rejecting invalid data", () => {
	test("blog without title is not added", async () => {
		const newBlog = {
			author: "Mickey Rat",
			url: "https://mouse-blog.fi/mouse-blog",
			likes: 13,
		};

		await api.post("/api/blogs").send(newBlog).expect(400);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});

describe("data validations", () => {
	test("blog with missing title or url receive default values", async () => {
		const newBlog = {
			author: "Dudley Ronald",
			likes: 1,
		};

		if (!newBlog.title) {
			newBlog.title = "Default title";
		}

		if (!newBlog.url) {
			newBlog.url = "https://default.blog.net";
		}

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		const newestEntry = blogsAtEnd[blogsAtEnd.length - 1];

		expect(newestEntry.title).toBe("Default title");
		expect(newestEntry.url).toBe("https://default.blog.net");
	});

	test("blog with missing likes value defaults to 0", async () => {
		const newBlog = {
			title: "Blog 3 about mice",
			author: "Mickey Rat",
			url: "https://mouse-blog.fi/mouse-blog",
		};

		if (!newBlog.likes) {
			newBlog.likes = 0;
		}

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		const newestEntry = blogsAtEnd[blogsAtEnd.length - 1];

		expect(newestEntry.likes).toBeDefined();
		expect(newestEntry.likes).toBe(0);
	});

	test("id is correctly named as id (not _id)", async () => {
		const response = await api.get("/api/blogs");
		const responseKeys = Object.keys(response.body[0]);

		expect(responseKeys).toContain("id");
		expect(response.body[0].id).toBeDefined();
	});
});

describe("deletion of a blog", () => {
	test("succeeds with status code 204 if id is valid", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart[0];

		await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

		const contents = blogsAtEnd.map((obj) => obj.id);

		expect(contents).not.toContain(blogToDelete.id);
	});
});

describe("editing a blog post's likes", () => {
	test("succeeds with status code 204 if id is valid", async () => {
		const blogs = await helper.blogsInDb();
		const blogToEdit = blogs[0];

		const editedBlog = { ...blogToEdit, likes: 14 };

		await api.put(`/api/blogs/${editedBlog.id}`).expect(204);

		expect(blogs).toHaveLength(helper.initialBlogs.length);
		expect(editedBlog.likes).toBe(14);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
