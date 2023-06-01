import React from "react";

import Part from "./Part";

const Content = ({ course: { parts } }) => {
	return (
		<div>
			{parts.map((part) => (
				<Part
					key={part.id}
					part={part.name}
					exercise={part.exercises}
				/>
			))}
		</div>
	);
};

export default Content;
