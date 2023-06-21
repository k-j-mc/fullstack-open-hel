const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const URL = process.env.MONGO_DB_URL;

mongoose
	.connect(URL)
	.then((result) => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const contactSchema = new mongoose.Schema({
	id: Number,
	name: {
		type: String,
		minLength: [3, "Name not long enough"],
		required: [true, "Contact name required"],
		trim: true,
	},
	number: {
		type: String,
		validate: {
			validator: function (v) {
				return /\d{2,3}-\d{7}/.test(v);
			},

			message: (props) => `${props.value} is not a valid phone number!`,
		},
		required: [true, "Contact number required"],
		trim: true,
	},
	date: Date,
});

contactSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Contact", contactSchema);
