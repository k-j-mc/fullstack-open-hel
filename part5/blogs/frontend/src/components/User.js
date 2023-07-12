import PropTypes from "prop-types";

const User = ({ handleLogout, user }) => {
	return (
		<div>
			{user.name} logged in
			<button type="submit" onClick={handleLogout}>
				log out
			</button>
		</div>
	);
};

User.propTypes = {
	user: PropTypes.object.isRequired,
	handleLogout: PropTypes.func.isRequired,
};

export default User;
