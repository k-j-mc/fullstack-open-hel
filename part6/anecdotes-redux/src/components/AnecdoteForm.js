import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteSlice";
import { addNotification } from "../reducers/notificationSlice";

const AnecdoteForm = () => {
	const dispatch = useDispatch();

	const addAnecdote = (event) => {
		event.preventDefault();
		const content = event.target.anecdote.value;

		event.target.anecdote.value = "";
		dispatch(createAnecdote(content));

		dispatch(addNotification("Created: " + content));
	};

	return (
		<form onSubmit={addAnecdote}>
			<input name="anecdote" />
			<button type="submit">add</button>
		</form>
	);
};

export default AnecdoteForm;
