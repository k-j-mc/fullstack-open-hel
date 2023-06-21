const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const Contact = require("./models/contact");

const morgan = require("morgan");
morgan("tiny");

morgan.token("body", (request) => {
	if (request.method === "POST") {
		return JSON.stringify(request.body);
	} else {
		return " ";
	}
});

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :body"
	)
);

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

const generateLength = () => {
	const count = Contact.countDocuments()
		.then((result) => {
			return result;
		})
		.catch((error) => next(error));

	return count;
};

const generateDate = () => {
	let date = new Date();

	return date;
};
app.get("/api/contacts", (request, response, next) => {
	Contact.find({})
		.then((contacts) => {
			response.json(contacts);
		})
		.catch((error) => next(error));
});

app.post("/api/contacts", async (request, response, next) => {
	const { name, number } = request.body;

	exists = await Contact.findOne({ name });

	if (!exists) {
		const contact = new Contact({
			name: name,
			number: number,
			date: generateDate(),
		});

		contact
			.save({ new: true, runValidators: true, context: "query" })
			.then((savedContact) => {
				response.json(savedContact);
			})
			.catch((error) => next(error));
	} else {
		return response.status(409).json({
			error: "contact exists",
		});
	}
});

app.get("/api/contacts/:id", (request, response, next) => {
	Contact.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})

		.catch((error) => next(error));
});

app.put("/api/contacts/:id", (request, response, next) => {
	const { name, number } = request.body;

	Contact.findByIdAndUpdate(
		request.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((updatedContact) => {
			response.json(updatedContact);
		})
		.catch((error) => next(error));
});

app.delete("/api/contacts/:id", (request, response, next) => {
	Contact.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.get("/info", async (request, response) => {
	response.send(`<p>
	         Phonebook has information for ${await generateLength()} people
	         <br />
	         ${generateDate()}
	         </p>
	         `);
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.log(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});
