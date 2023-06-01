import React from "react";

import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const Course = ({ course }) => {
	return (
		<div>
			<Header name={course.name} size="h2" />
			<Content course={course} />
			<Total parts={course.parts} />
		</div>
	);
};

export default Course;
