import {
	useNotificationValue,
	useNotificationDispatch,
} from "../NotificationContext";

const Notification = () => {
	const notification = useNotificationValue();
	const dispatch = useNotificationDispatch();

	const style = {
		border: "solid",
		padding: 10,
		borderWidth: 1,
		marginBottom: 5,
	};

	if (notification) {
		setTimeout(() => {
			dispatch({ type: "REMOVE" });
		}, 5000);

		return <div style={style}>{notification}</div>;
	}
};

export default Notification;
