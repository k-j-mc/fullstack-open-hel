const initialState = [
	{ content: "If it hurts, do it more often", votes: 5, id: 1 },
	{
		content: "Adding manpower to a late software project makes it later!",
		votes: 4,
		id: 2,
	},
	{
		content:
			"The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
		votes: 1,
		id: 3,
	},
	{
		content:
			"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
		votes: 15,
		id: 4,
	},
	{
		content: "Premature optimization is the root of all evil.",
		votes: 9,
		id: 5,
	},
	{
		content:
			"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
		votes: 12,
		id: 6,
	},
	{ content: "But it works in my machine...", votes: 15, id: 7 },
	{ content: "Some other test anecdote...", votes: 8, id: 8 },
	{ content: "Something something?", votes: 25, id: 9 },
];

const anecdoteReducer = (state = initialState, action) => {
	switch (action.type) {
		case "NEW_ANECDOTE":
			return [...state, action.payload];
		case "VOTE": {
			const id = action.payload.id;
			const anecdoteToChange = state.find((n) => n.id === id);
			const changedAnecdote = {
				...anecdoteToChange,
				votes: anecdoteToChange.votes + 1,
			};
			return state.map((anecdote) =>
				anecdote.id !== id ? anecdote : changedAnecdote
			);
		}
		default:
			return state;
	}
};

const generateId = () => Number((Math.random() * 1000000).toFixed(0));

export const createAnecdote = (content) => {
	return {
		type: "NEW_ANECDOTE",
		payload: {
			content,
			votes: 0,
			id: generateId(),
		},
	};
};

export const vote = (id) => {
	return {
		type: "VOTE",
		payload: { id },
	};
};

export default anecdoteReducer;
