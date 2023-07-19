const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		setupNodeEvents(on, config) {
			config.env.USER = process.env.REACT_APP_TEST_USER;
			config.env.NAME = process.env.REACT_APP_TEST_NAME;
			config.env.PASSWORD = process.env.REACT_APP_TEST_PASSWORD;

			return config;
		},
	},
	env: {
		BACKEND: "http://localhost:3003/api",
		LOGIN: "http://localhost:3003/api/login",
		BLOGS: "http://localhost:3003/api/blogs",
		RESET: "http://localhost:3003/api/testing/reset",
		USERS: "http://localhost:3003/api/users",
	},
	video: false,
});
