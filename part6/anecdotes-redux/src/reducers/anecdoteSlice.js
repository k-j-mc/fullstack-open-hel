import { createSlice } from "@reduxjs/toolkit";

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

const generateId = () => Number((Math.random() * 1000000).toFixed(0));

const anecdoteSlice = createSlice({
	name: "anecdotes",
	initialState,
	reducers: {
		createAnecdote(state, action) {
			const content = action.payload;
			state.push({
				content,
				votes: 0,
				id: generateId(),
			});
		},
		vote(state, action) {
			const id = action.payload;
			const anecdoteToChange = state.find((n) => n.id === id);
			const changedAnecdote = {
				...anecdoteToChange,
				votes: anecdoteToChange.votes + 1,
			};

			return state.map((anecdote) =>
				anecdote.id !== id ? anecdote : changedAnecdote
			);
		},
	},
});

export const { createAnecdote, vote } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
