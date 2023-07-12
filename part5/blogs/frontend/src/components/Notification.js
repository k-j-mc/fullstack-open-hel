import React from "react";

const Notification = ({ notification: { message, variant } }) => {
	if (message === null) {
		return null;
	}

	return <div className={variant}>{message}</div>;
};

export default Notification;
