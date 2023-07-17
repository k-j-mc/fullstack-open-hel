import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "../components/Blog";

import TestBlog from "./TestData/TestBlog";
import TestUser from "./TestData/TestUser";

test("renders content", () => {
	render(<Blog blog={TestBlog} user={TestUser} />);

	const element = screen.getByText(
		"Component testing is done with react-testing-library (Archibald)"
	);

	//eslint-disable-next-line
	screen.debug(element);

	expect(element).toBeDefined();
});

test("clicking the button calls event handler once", async () => {
	const mockHandler = jest.fn();

	render(
		<Blog blog={TestBlog} user={TestUser} toggleVisibility={mockHandler} />
	);

	const user = userEvent.setup();
	const button = screen.getByText("View");
	await user.click(button);

	const url = screen.getByText(`Url: ${TestBlog.url}`);
	const likes = screen.getByText(`Likes: ${TestBlog.likes}`);

	//eslint-disable-next-line
	screen.debug(url);
	//eslint-disable-next-line
	screen.debug(likes);

	expect(url).toBeDefined();
	expect(likes).toBeDefined();
});

test("clicking the like button calls event handler twice", async () => {
	const mockHandler = jest.fn();

	render(
		<Blog
			blog={TestBlog}
			user={TestUser}
			toggleVisibility={mockHandler}
			handleLikeBlog={mockHandler}
		/>
	);

	const user = userEvent.setup();
	const button = screen.getByText("View");
	await user.click(button);

	const likeButton = screen.getByText("Like");
	await user.click(likeButton);
	await user.click(likeButton);
	// const url = screen.getByText(`Url: ${TestBlog.url}`);
	const likes = screen.getByText(`Likes: ${TestBlog.likes}`);

	//eslint-disable-next-line
	screen.debug(likes);

	expect(mockHandler.mock.calls).toHaveLength(2);
});
