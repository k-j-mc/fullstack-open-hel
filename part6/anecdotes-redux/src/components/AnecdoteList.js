import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteSlice";
import {
	addNotification,
	removeNotification,
} from "../reducers/notificationSlice";

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
		dispatch(vote(event.id));
		dispatch(addNotification("Liked: " + event.content));
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
