const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate("blogs", {
		title: 1,
		author: 1,
		url: 1,
		likes: 1,
		blogs: [
			{
				id: 1,
				author: 1,
				title: 1,
				likes: 1,
				url: 1,
			},
		],
	});
	response.json(users);
});

usersRouter.post("/", async (request, response) => {
	const { username, name, password } = request.body;

	if (!password) {
		response.status(400).json({ error: "Password must be submitted" });
	}

	if (password.length < 3) {
		response
			.status(400)
			.json({ error: "Password must be more than 3 characters" });
	} else {
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const user = new User({
			username,
			name,
			passwordHash,
		});

		const savedUser = await user.save();

		response.status(201).json(savedUser);
	}
});

module.exports = usersRouter;
