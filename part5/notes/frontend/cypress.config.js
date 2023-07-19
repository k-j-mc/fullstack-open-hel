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
		BACKEND: "http://localhost:3001/api",
		LOGIN: "http://localhost:3001/api/login",
		NOTES: "http://localhost:3001/api/notes",
		RESET: "http://localhost:3001/api/testing/reset",
		USERS: "http://localhost:3001/api/users",
	},
	video: false,
});
