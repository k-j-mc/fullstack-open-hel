import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const generateId = () => Number((Math.random() * 1000000).toFixed(0));

const getAll = async () => {
	const response = await axios.get(baseUrl);

	return response.data;
};

const createNew = async (content) => {
	const object = { content, votes: 0, id: generateId() };
	const response = await axios.post(baseUrl, object);

	return response.data;
};

const voteAnecdote = async (content) => {
	const response = await axios.put(baseUrl + `/${content.id}`, content);

	return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	getAll,
	createNew,
	voteAnecdote,
};
