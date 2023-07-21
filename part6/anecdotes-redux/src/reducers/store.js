import { configureStore } from "@reduxjs/toolkit";
import anecdoteReducer from "./anecdoteSlice";
import filterReducer from "./filterSlice";
import notificationReducer from "./notificationSlice";

export default configureStore({
	reducer: {
		anecdotes: anecdoteReducer,
		filter: filterReducer,
		notification: notificationReducer,
	},
});
