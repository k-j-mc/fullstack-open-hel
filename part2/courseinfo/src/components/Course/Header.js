import React from "react";

const Header = ({ name, size }) => {
	if (size === "h1") {
		return <h1>{name}</h1>;
	} else {
		return <h2>{name}</h2>;
	}
};

export default Header;
