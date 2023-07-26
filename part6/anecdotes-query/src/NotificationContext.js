import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
	switch (action.type) {
		case "ADD":
			return `Successfully added: ${action.anecdote.content}`;
		case "VOTE":
			return `Successfully voted: ${action.anecdote.content}`;
		case "ERROR":
			return `Error: ${action.error}`;
		case "REMOVE":
			return null;
		default:
			return state;
	}
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
	const [notification, notificationDispatch] =
		useReducer(notificationReducer);

	return (
		<NotificationContext.Provider
			value={[notification, notificationDispatch]}
		>
			{props.children}
		</NotificationContext.Provider>
	);
};

export const useNotificationValue = () => {
	const notificationAndDispatch = useContext(NotificationContext);

	let notificationValue = notificationAndDispatch[0];

	return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
	const notificationAndDispatch = useContext(NotificationContext);

	return notificationAndDispatch[1];
};

export default NotificationContext;
