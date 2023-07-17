import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "../components/BlogForm";

import TestBlog from "./TestData/TestBlog";
import TestUser from "./TestData/TestUser";

test("create new blog and verify information is correctly handled", async () => {
	const mockHandler = jest.fn();

	render(<BlogForm createBlog={mockHandler} user={TestUser} />);

	const user = userEvent.setup();

	const textBox = screen.getAllByRole("textbox");
	const numberBox = screen.getByRole("spinbutton");

	await user.type(textBox[0], TestBlog.title);
	await user.type(textBox[1], TestBlog.author);
	await user.type(textBox[2], TestBlog.url);
	await user.type(numberBox, TestBlog.likes.toString());

	const button = screen.getByText("Save blog");
	await user.click(button);

	expect(mockHandler.mock.calls).toHaveLength(1);
	expect(mockHandler.mock.calls[0][0].title).toBe(TestBlog.title);
	expect(mockHandler.mock.calls[0][0].author).toBe(TestBlog.author);
	expect(mockHandler.mock.calls[0][0].url).toBe(TestBlog.url);
	expect(mockHandler.mock.calls[0][0].likes).toBe(TestBlog.likes.toString());
});
