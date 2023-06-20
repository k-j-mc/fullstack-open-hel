const dotenv = require("dotenv").config();

const mongoose = require("mongoose");

const password = process.argv[2];

const contactName = process.argv[3];

const contactNumber = process.argv[4];

const url = `mongodb+srv://FullStack-test_mongo-Db:${password}@test-mongodb.0hwoasm.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
	id: Number,
	name: String,
	number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

const contact = new Contact({
	id: 1,
	name: contactName,
	number: contactNumber,
});

Contact.find({}).then((contacts) => {
	console.log("Contacts:");
	contacts.map((item) => {
		console.log(item.name, item.number);
	});

	mongoose.connection.close();
});
