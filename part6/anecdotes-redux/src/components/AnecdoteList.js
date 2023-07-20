import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";

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
	const initialAnecdotes = useSelector((state) => state);

	const anecdotes = initialAnecdotes.sort((a, b) =>
		a.votes > b.votes ? -1 : 1
	);

	return (
		<ul>
			{anecdotes.map((anecdote) => (
				<Anecdote
					key={anecdote.id}
					anecdote={anecdote}
					handleClick={() => dispatch(vote(anecdote.id))}
				/>
			))}
		</ul>
	);
};

export default AnecdoteList;
