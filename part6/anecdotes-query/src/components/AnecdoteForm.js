const AnecdoteForm = ({ newAnecdoteMutation }) => {
	const generateId = () => Number((Math.random() * 1000000).toFixed(0));

	const addAnecdote = async (event) => {
		event.preventDefault();

		const content = event.target.anecdote.value;
		event.target.anecdote.value = "";

		newAnecdoteMutation.mutate({
			content: content,
			votes: 0,
			id: generateId(),
		});
	};

	return (
		<div>
			<h3>create new</h3>
			<form onSubmit={addAnecdote}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
