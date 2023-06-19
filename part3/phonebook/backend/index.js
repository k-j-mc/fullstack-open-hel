const express = require("express");
const app = express();
const cors = require("cors");

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

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

let contacts = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/", (request, response) => {
	response.send("<h1>Backend</h1>");
});

app.get("/api/contacts", (request, response) => {
	response.json(contacts);
});

const generateLength = () => {
	const contactsLength = contacts.length;

	return contactsLength;
};

const generateDate = () => {
	let date = new Date();

	return date;
};

const generateId = () => {
	let min = generateLength();
	const max = 1000;

	const contactId = Math.floor(Math.random() * (max - min + 1)) + min;

	return contactId;
};

app.post("/api/contacts", (request, response) => {
	const body = request.body;

	if (!body.name) {
		return response.status(400).json({
			error: "name missing",
		});
	}

	if (!body.number) {
		return response.status(400).json({
			error: "number missing",
		});
	}

	exists = contacts.find((contact) => contact.name === body.name);

	if (!exists) {
		const contact = {
			id: generateId(),
			name: body.name,
			number: body.number,
		};

		contacts = contacts.concat(contact);

		return response.json(contacts);
	} else {
		return response.status(409).json({
			error: "contact exists",
		});
	}
});

app.put("/api/contacts/:id", (request, response) => {
	const id = Number(request.params.id);
	const exists = contacts.find((contact) => contact.id === id);
	const foundIndex = contacts.findIndex(
		(contact) => Number(contact.id) === id
	);

	const body = request.body;

	if (exists) {
		contacts[foundIndex].number = body.number;
		response.json({ message: `${exists.name} updated successfully` });
	} else {
		response
			.status(404)
			.json({
				error: "contact could not be updated as they do not exist",
			})
			.end();
	}
});

app.get("/api/contacts/:id", (request, response) => {
	const id = Number(request.params.id);
	const contact = contacts.find((contact) => contact.id === id);

	if (contact) {
		response.json(contact);
	} else {
		response
			.status(404)
			.json({
				error: "contact does not exist",
			})
			.end();
	}
});

app.delete("/api/contacts/:id", (request, response) => {
	const id = Number(request.params.id);
	const exists = contacts.find((contact) => contact.id === id);

	contacts = contacts.filter((contact) => contact.id !== id);

	if (exists) {
		response
			.json({
				message: "contact deleted",
			})
			.status(204)
			.end();
	} else {
		response
			.status(404)
			.json({
				error: "contact could not be deleted",
			})
			.end();
	}
});

app.get("/info", (request, response) => {
	response.send(
		`<p>
        Phonebook has information for ${generateLength()} people 
        <br/>
        ${generateDate()}
        </p>`
	);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});
