const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (request, response) => {
	const notes = await Note.find({});

	if (notes) {
		response.status(200).json(notes);
	} else {
		response.status(400).end();
	}
});

notesRouter.get("/:id", async (request, response) => {
	const note = await Note.findById(request.params.id);
	if (note) {
		response.json(note);
	} else {
		response.status(404).end();
	}
});

notesRouter.post("/", async (request, response) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false,
	});

	const savedNote = await note.save();
	response.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (request, response) => {
	await Note.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

notesRouter.put("/:id", async (request, response) => {
	const body = request.body;

	const note = {
		content: body.content,
		important: body.important,
	};

	const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
		new: true,
	});

	if (updatedNote) {
		response.status(204).json(updatedNote);
	} else {
		response.status(400).end();
	}
});

module.exports = notesRouter;
