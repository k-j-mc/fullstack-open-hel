import { useDispatch, useSelector } from "react-redux";

import { voteForAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
	return (
		<ul>
			<p>{anecdote.content}</p>
			has {anecdote.votes} <button onClick={handleClick}>Votes</button>
		</ul>
	);
};

const AnecdoteList = () => {
	const dispatch = useDispatch();
	const anecdotes = useSelector((state) => {
		const anecdoteSort = [...state.anecdotes].sort((a, b) =>
			a.votes > b.votes ? -1 : 1
		);

		if (state.filter === "") {
			return anecdoteSort;
		} else {
			const ancedoteFilter = anecdoteSort.filter((obj) =>
				obj.content.toLowerCase().includes(state.filter.toLowerCase())
			);

			return ancedoteFilter;
		}
	});

	const handleVote = (event) => {
		dispatch(voteForAnecdote(event));
		dispatch(setNotification("Liked: " + event.content, 5000));
	};

	return (
		<ul>
			{anecdotes.map((anecdote) => (
				<Anecdote
					key={anecdote.id}
					anecdote={anecdote}
					handleClick={() => handleVote(anecdote)}
				/>
			))}
		</ul>
	);
};

export default AnecdoteList;
