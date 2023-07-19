describe("Note app", function () {
	let user;
	let name;
	let password;

	Cypress.Commands.add("login", ({ username, password }) => {
		cy.request("POST", `${Cypress.env("LOGIN")}`, {
			username,
			password,
		}).then(({ body }) => {
			localStorage.setItem("loggedNoteappUser", JSON.stringify(body));
			cy.visit("");
		});
	});

	Cypress.Commands.add("createNote", ({ content, important }) => {
		cy.request({
			url: `${Cypress.env("NOTES")}`,
			method: "POST",
			body: { content, important },
			headers: {
				Authorization: `Bearer ${
					JSON.parse(localStorage.getItem("loggedNoteappUser")).token
				}`,
			},
		});

		cy.visit("");
	});

	before(() => {
		user = Cypress.env("USER");
		name = Cypress.env("NAME");
		password = Cypress.env("PASSWORD");
	});

	beforeEach(function () {
		cy.visit("");
		cy.request("POST", `${Cypress.env("RESET")}`);

		const loginInfo = {
			name: name,
			username: user,
			password: password,
		};

		cy.request("POST", `${Cypress.env("USERS")}`, loginInfo);
	});

	it("front page can be opened", function () {
		cy.contains("Notes");
		cy.contains(
			"Note app, Department of Computer Science, University of Helsinki 2023"
		);
	});

	it("login form can be opened", function () {
		cy.contains("log in").click();
	});

	it("login fails with wrong password", function () {
		cy.contains("log in").click();
		cy.get("#username").type("mluukkai");
		cy.get("#password").type("wrong");
		cy.get("#login-button").click();

		cy.get(".error")
			.should("contain", "wrong credentials")
			.and("have.css", "color", "rgb(255, 0, 0)")
			.and("have.css", "border-style", "solid");

		cy.get("html").should("not.contain", `${name} logged in`);
	});

	it("user can login", function () {
		cy.contains("log in").click();
		cy.get("#username").type(user);
		cy.get("#password").type(password);
		cy.get("#login-button").click();

		cy.contains(`${name} logged in`);
	});

	describe("when logged in", function () {
		beforeEach(function () {
			cy.login({ username: user, password: password });
		});

		it("a new note can be created", function () {
			cy.contains("new note").click();
			cy.get("input").type("a note created by cypress");
			cy.contains("save").click();
			cy.contains("a note created by cypress");
		});

		describe("and a note exists", function () {
			beforeEach(function () {
				cy.createNote({
					content: "another note cypress",
					important: true,
				});
			});

			it("it can be made not important", function () {
				cy.contains("another note cypress")
					.parent()
					.find("button")
					.as("theButton")
					.should("contain", "make not important")
					.click();

				cy.contains("another note cypress")
					.parent()
					.get("@theButton")
					.should("contain", "make important");
			});
		});

		describe("and several notes exist", function () {
			beforeEach(function () {
				cy.createNote({ content: "first note", important: false });
				cy.createNote({ content: "second note", important: false });
				cy.createNote({ content: "third note", important: false });
			});

			it("one of those can be made important", function () {
				cy.contains("second note")
					.parent()
					.find("button")
					.as("theButton");
				cy.get("@theButton").click();
				cy.get("@theButton").should("contain", "make not important");
			});
		});
	});
});
