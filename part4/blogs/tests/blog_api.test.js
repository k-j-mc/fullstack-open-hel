const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

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
		const usersAtStart = await helper.usersInDb();

		const newBlog = {
			title: "Blog 3 about mice",
			author: "Mickey Rat",
			url: "https://mouse-blog.fi/mouse-blog",
			likes: 13,
			userId: usersAtStart[0].id,
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
		const usersAtStart = await helper.usersInDb();
		const newBlog = {
			author: "Mickey Rat",
			url: "https://mouse-blog.fi/mouse-blog",
			likes: 13,
			userId: usersAtStart[0].id,
		};

		await api.post("/api/blogs").send(newBlog).expect(400);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});

describe("data validations", () => {
	test("blog with missing title or url receive default values", async () => {
		const usersAtStart = await helper.usersInDb();

		const newBlog = {
			author: "Dudley Ronald",
			likes: 1,
			userId: usersAtStart[0].id,
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
		const usersAtStart = await helper.usersInDb();

		const newBlog = {
			title: "Blog 3 about mice",
			author: "Mickey Rat",
			url: "https://mouse-blog.fi/mouse-blog",
			userId: usersAtStart[0].id,
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

describe("when there is initially one user at db", () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash("sekret", 10);
		const user = new User({
			username: "root",
			passwordHash,
		});

		await user.save();
	});

	test("creation succeeds with a fresh username", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "mluukkai",
			name: "Matti Luukkainen",
			password: "salainen",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		expect(usernames).toContain(newUser.username);
	});

	test("creation fails with proper statuscode and message if username already taken", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "root",
			name: "Superuser",
			password: "salainen",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(result.body.error).toContain("expected `username` to be unique");

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
