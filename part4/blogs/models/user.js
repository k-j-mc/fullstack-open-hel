const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 3,
	},
	name: String,
	passwordHash: String,

	blogs: [
		{
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Blog",
			},
			title: {
				type: mongoose.Schema.Types.String,
				ref: "Blog",
			},
			author: {
				type: mongoose.Schema.Types.String,
				ref: "Blog",
			},
			url: {
				type: mongoose.Schema.Types.String,
				ref: "Blog",
			},
		},
	],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
