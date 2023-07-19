import TestBlog from "../../src/tests/TestData/TestBlog";

describe("Blog app", function () {
	const user = Cypress.env("USER");
	const name = Cypress.env("NAME");
	const password = Cypress.env("PASSWORD");

	Cypress.Commands.add("zeroDataBase", () => {
		cy.request("POST", `${Cypress.env("RESET")}`);
		cy.visit("");
	});

	Cypress.Commands.add("testUser", ({ username, password, name }) => {
		cy.request("POST", `${Cypress.env("USERS")}`, {
			username: username,
			password: password,
			name: name,
		});
	});

	Cypress.Commands.add("getToken", ({ username, password }) => {
		cy.request("POST", `${Cypress.env("LOGIN")}`, {
			username: username,
			password: password,
		}).then(({ body }) => {
			localStorage.setItem("loggedBlogappUser", JSON.stringify(body));
			cy.visit("");
		});
	});

	Cypress.Commands.add("logout", () => {
		localStorage.clear();
		cy.visit("");
	});

	Cypress.Commands.add("login", ({ username, password }) => {
		cy.get("#username").type(username);
		cy.get("#password").type(password);
		cy.get("#login-button").click();
	});

	Cypress.Commands.add("createBlog", ({ title, author, url, likes }) => {
		cy.request({
			url: `${Cypress.env("BLOGS")}`,
			method: "POST",
			body: { title, author, url, likes },
			headers: {
				Authorization: `Bearer ${
					JSON.parse(localStorage.getItem("loggedBlogappUser")).token
				}`,
			},
		});
		cy.visit("");
	});

	this.beforeEach(function () {
		cy.zeroDataBase();
		cy.testUser({ username: user, password: password, name: name });
	});

	it("login form is shown", function () {
		cy.contains("log in to application");
	});

	it("login fails with wrong password", function () {
		cy.login({ username: "not going", password: "to work" });

		cy.get(".error")
			.should("contain", "invalid username or password")
			.and("have.css", "color", "rgb(255, 0, 0)")
			.and("have.css", "border-style", "solid");

		cy.get("html").should("not.contain", `${name} logged in`);
	});

	it("user can login", function () {
		cy.login({ username: user, password: password });

		cy.contains(`${name} logged in`);
	});

	describe("when logged in", function () {
		beforeEach(function () {
			cy.login({ username: user, password: password });
			cy.getToken({ username: user, password: password });
		});

		it("a new blog can be created", function () {
			cy.contains("New blog").click();
			cy.get("#blog-title").type(TestBlog.title);
			cy.get("#blog-author").type(TestBlog.author);
			cy.get("#blog-url").type(TestBlog.url);
			cy.get("#blog-likes").type(TestBlog.likes);
			cy.get("#blog-save").click();
			cy.contains(`${TestBlog.title} (${TestBlog.author})`);
		});
	});

	describe("and a blog exists", function () {
		beforeEach(function () {
			cy.login({ username: user, password: password });
			cy.getToken({ username: user, password: password });

			cy.createBlog({
				title: "first blog",
				author: "someone",
				url: "someurl.com",
				likes: 9,
			});
		});

		it("blog can be viewed", function () {
			cy.contains("first blog")
				.parent()
				.find("button")
				.should("contain", "View");

			cy.get("#blog-view").click();

			cy.get("#blog");
			cy.should("contain", "first blog (someone)");
			cy.should("contain", "Url: someurl.com");
			cy.should("contain", "Likes: 9");
			cy.should("contain", `Uploaded by: ${name}`);
		});
	});

	describe("and several notes exist", function () {
		beforeEach(function () {
			cy.login({ username: user, password: password });
			cy.getToken({ username: user, password: password });

			cy.createBlog({
				title: "first blog",
				author: "someone",
				url: "someurl.com",
				likes: 9,
			});
			cy.createBlog({
				title: "second blog",
				author: "someone2",
				url: "someurl--2.com",
				likes: 19,
			});
			cy.createBlog({
				title: "third blog",
				author: "someone3",
				url: "someurl-3.com",
				likes: 29,
			});
		});

		it("one of those can be liked", function () {
			cy.contains("third blog (someone3)")
				.parent()
				.find("button")
				.should("contain", "View");

			cy.get("#blog-view").click();

			cy.get("#blog-like").click();

			cy.get("#blog");
			cy.should("contain", "Likes: 30");
		});
	});

	describe("Multiple users", function () {
		beforeEach(function () {
			cy.testUser({
				username: "Fake User",
				password: "Fake User",
				name: "Fake User",
			});

			cy.login({ username: "Fake User", password: "Fake User" });
			cy.getToken({ username: "Fake User", password: "Fake User" });

			cy.createBlog({
				title: "first blog",
				author: "someone",
				url: "someurl.com",
				likes: 10,
			});

			cy.logout();

			cy.login({ username: user, password: password });
			cy.getToken({ username: user, password: password });

			cy.createBlog({
				title: "second blog",
				author: "someone2",
				url: "someurl--2.com",
				likes: 9,
			});
		});

		it("one of those can be deleted", function () {
			cy.contains("second blog (someone2)")
				.find("button")
				.should("contain", "View")
				.click();

			cy.get("#blog-delete").click();

			cy.get("#blog");
			cy.should("not.contain", "second blog (someone2)");

			cy.get(".success")
				.should("contain", "second blog was successfully deleted")
				.and("have.css", "color", "rgb(0, 128, 0)")
				.and("have.css", "border-style", "solid");
		});

		it("user cannot delete another's blog", function () {
			cy.contains("first blog (someone)")
				.find("button")
				.should("contain", "View")
				.click();

			cy.get("#blog");
			cy.should("contain", "Url: someurl.com");
			cy.should("not.contain", "Remove");
		});

		it("blogs should be ordered in descending likes", function () {
			cy.get(".blog").eq(0).should("contain", "first blog (someone)");
			cy.get(".blog").eq(1).should("contain", "second blog (someone2)");

			cy.get(".blog").eq(1).contains("View").click();

			cy.get(".blog").eq(1).contains("Like").click();
			cy.wait(500); // eslint-disable-line
			cy.get(".blog").eq(1).contains("Like").click();
			cy.wait(500); // eslint-disable-line

			cy.get(".blog").eq(0).should("contain", "second blog (someone2)");
			cy.get(".blog").eq(1).should("contain", "first blog (someone)");
		});
	});
});
