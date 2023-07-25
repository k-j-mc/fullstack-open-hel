import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const notificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		addNotification(state, action) {
			return action.payload;
		},
		removeNotification(state, action) {
			return initialState;
		},
	},
});

export const { addNotification, removeNotification } =
	notificationSlice.actions;

export const setNotification = (content, timeOut) => {
	return async (dispatch) => {
		dispatch(addNotification(content));

		setTimeout(() => {
			dispatch(removeNotification(initialState));
		}, timeOut);
	};
};

export default notificationSlice.reducer;
