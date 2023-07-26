import { useQuery, useMutation, useQueryClient } from "react-query";
import { getAnecdotes, createAnecdote, updateAnecdote } from "./requests";

import { useNotificationDispatch } from "./NotificationContext";

import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();

	const newAnecdoteMutation = useMutation(createAnecdote, {
		onSuccess: (newAnecdote) => {
			const anecdotes = queryClient.getQueryData("anecdotes");
			queryClient.setQueryData(
				"anecdotes",
				anecdotes.concat(newAnecdote)
			);
		},
		onError: (newAnecdote) => {
			dispatch({ type: "ERROR", error: newAnecdote.response.data.error });
		},
	});

	const updateAnecdoteMutation = useMutation(updateAnecdote, {
		onSuccess: () => {
			queryClient.invalidateQueries("anecdotes");
		},
	});

	const handleVote = (anecdote) => {
		updateAnecdoteMutation.mutate({
			...anecdote,
			votes: anecdote.votes + 1,
		});
		dispatch({ type: "VOTE", anecdote });
	};

	const result = useQuery("anecdotes", getAnecdotes, {
		refetchOnWindowFocus: false,
		retry: 3,
	});

	if (result.isLoading) {
		return <div>loading data...</div>;
	}

	if (!result.data) {
		return <div>Error communicating with the anecdote server</div>;
	}

	const anecdotes = result.data.sort((a, b) => (a.votes > b.votes ? -1 : 1));

	return (
		<div>
			<h3>Anecdote app</h3>
			<Notification />
			<AnecdoteForm newAnecdoteMutation={newAnecdoteMutation} />
			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote)}>
							vote
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default App;
