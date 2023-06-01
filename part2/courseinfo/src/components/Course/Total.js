import React from "react";

const Total = ({ parts }) => {
	// const sumValues = parts
	// 	.map((item) => item.exercises)
	// 	.reduce((a, b) => a + b);
	const sumValues = parts.reduce((a, b) => a + b.exercises, 0);

	return <strong>Total number of exercises {sumValues}</strong>;
};

export default Total;
