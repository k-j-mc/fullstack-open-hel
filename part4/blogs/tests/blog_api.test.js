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

	await User.deleteMany({ username: { $ne: process.env.USER_NAME } });

	const passwordHash = await bcrypt.hash(helper.initialUser.password, 10);
	const user = new User({
		username: helper.initialUser.username,
		name: helper.initialUser.name,
		passwordHash,
	});

	await user.save();
});

const getToken = async () => {
	const userData = {
		username: process.env.USER_NAME,
		password: process.env.PASSWORD,
	};

	const response = await api
		.post("/api/login")
		.send(userData)
		.expect(200)
		.expect("Content-Type", /application\/json/);

	return response.body.token;
};

describe("test and validate user endpoints", () => {
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
		const token = await getToken();

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(helper.newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		const titles = blogsAtEnd.map((obj) => obj.title);
		expect(titles).toContain("Blog 3 about mice");
	});

	test("invalid blog can not be added 401", async () => {
		await api
			.post("/api/blogs")
			// .set("Authorization", `Bearer N0T-a-V@l1D-t0kEN`)
			.send(helper.newBlog)
			.expect(401)
			.expect("Content-Type", /application\/json/);
	});

	test("blog without title is not added", async () => {
		const token = await getToken();

		const newBlog = { ...helper.newBlog, title: null };

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});

	test("blog with missing title or url receive default values", async () => {
		const token = await getToken();

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
			.set("Authorization", `Bearer ${token}`)
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
		const token = await getToken();

		const newBlog = { ...helper.newBlog, likes: null };

		if (!newBlog.likes) {
			newBlog.likes = 0;
		}

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
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

	test("editing succeeds with status code 204 if id is valid", async () => {
		const token = await getToken();

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(helper.editBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogs = await helper.blogsInDb();
		const blogToEdit = blogs[2];

		const editedBlog = { ...blogToEdit, likes: 14 };

		await api
			.put(`/api/blogs/${editedBlog.id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(204);

		expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
		expect(editedBlog.likes).toBe(14);
	});

	test("deletion succeeds with status code 204 if id is valid", async () => {
		const token = await getToken();

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(helper.editBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart[2];

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

		const contents = blogsAtEnd.map((obj) => obj.id);

		expect(contents).not.toContain(blogToDelete.id);
	});

	test("creation succeeds with a fresh username", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "test-user",
			name: "Mrs Test",
			password: process.env.PASSWORD,
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
			username: process.env.USER_NAME,
			name: "Superuser",
			password: process.env.PASSWORD,
		};

		const response = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(response.body.error).toContain(
			"expected `username` to be unique"
		);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	test("user cannot be created with empty or missing username", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: "Some new user withoout a username",
			password: process.env.PASSWORD,
		};

		const response = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(response.body.error).toContain("User validation failed");

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	test("user cannot be created with short username", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "ew",
			name: "Some new user with a short username",
			password: process.env.PASSWORD,
		};

		const response = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(response.body.error).toContain("User validation failed");

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	test("user cannot be created with empty or missing password", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = { ...helper.testUser, password: "" };

		const response = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(response.body.error).toContain("Password must be submitted");

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	test("user cannot be created with short password", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = { ...helper.testUser, password: "12" };

		const response = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(response.body.error).toContain(
			"Password must be more than 3 characters"
		);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
