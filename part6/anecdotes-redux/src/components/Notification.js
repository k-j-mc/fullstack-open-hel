import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../reducers/notificationSlice";

const Notification = () => {
	const dispatch = useDispatch();

	const notification = useSelector((state) => {
		return state.notification;
	});

	if (notification) {
		setTimeout(() => {
			dispatch(removeNotification());
		}, 5000);
	}

	const style = {
		border: "solid",
		padding: 10,
		borderWidth: 1,
	};
	return <div>{notification && <div style={style}>{notification}</div>}</div>;
};

export default Notification;
