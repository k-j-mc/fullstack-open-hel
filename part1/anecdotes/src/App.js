import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;

const Anecdote = ({ text, votes }) => (
	<p>
		{text} <br />
		has {votes} votes
	</p>
);

const MostVoted = ({ anecdotes }) => {
	const maxScore = Math.max(...anecdotes.map((item) => item.votes));
	const bestAnecdote = anecdotes.find((item) => item.votes === maxScore);

	if (maxScore > 0) {
		return <Anecdote text={bestAnecdote.text} votes={bestAnecdote.votes} />;
	} else {
		return <p>No anecdotes have received votes yet!</p>;
	}
};

const Button = ({ handleClick, text }) => (
	<button onClick={handleClick}>{text}</button>
);

const App = () => {
	const [anecdotes, setAnecdotes] = useState([
		{ text: "If it hurts, do it more often.", votes: 0 },
		{
			text: "Adding manpower to a late software project makes it later!",
			votes: 0,
		},
		{
			text: "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
			votes: 0,
		},
		{
			text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
			votes: 0,
		},
		{ text: "Premature optimization is the root of all evil.", votes: 0 },
		{
			text: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
			votes: 0,
		},
		{
			text: "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
			votes: 0,
		},
		{ text: "The only way to go fast, is to go well.", votes: 0 },
	]);

	const [selected, setSelected] = useState(0);

	const handleAnecdote = () => {
		setSelected(Math.floor(Math.random() * anecdotes.length));
	};

	const handleVote = () => {
		let copy = [...anecdotes];
		copy[selected].votes += 1;

		setAnecdotes(copy);
	};
	return (
		<div>
			<Header text="Anecdote of the day" />
			<Anecdote
				text={anecdotes[selected].text}
				votes={anecdotes[selected].votes}
			/>
			<Button handleClick={handleAnecdote} text="next anecdote" />
			<Button handleClick={handleVote} text="vote" />
			<Header text="Anecdote with most votes" />
			<MostVoted anecdotes={anecdotes} />
		</div>
	);
};

export default App;
