import { useState } from "react";

const Header = ({ title }) => <h1>{title}</h1>;

const Button = ({ handleClick, text }) => (
	<button onClick={handleClick}>{text}</button>
);

const StatisticLine = ({ text, value }) => (
	<tr>
		<td>{text}</td>
		<td>{value}</td>
	</tr>
);

const Statistics = ({ good, neutral, bad }) => {
	const total = good + neutral + bad;

	const average = (good * 1 + neutral * 0 + bad * -1) / total;

	const positive = (good / total) * 100;

	if (total) {
		return (
			<table>
				<tbody>
					<StatisticLine text="good" value={good} />
					<StatisticLine text="neutral" value={neutral} />
					<StatisticLine text="bad" value={bad} />
					<StatisticLine text="all" value={total} />
					<StatisticLine text="average" value={average} />
					<StatisticLine text="positive" value={positive + "%"} />
				</tbody>
			</table>
		);
	} else {
		return <p>No feedback given</p>;
	}
};

const App = () => {
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	const goodValue = () => {
		setGood(good + 1);
	};

	const neutralValue = () => {
		setNeutral(neutral + 1);
	};

	const badValue = () => {
		setBad(bad + 1);
	};

	return (
		<div>
			<Header title="give feedback" />

			<Button handleClick={goodValue} text="good" />
			<Button handleClick={neutralValue} text="neutral" />
			<Button handleClick={badValue} text="bad" />

			<Header title="statistics" />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	);
};

export default App;
