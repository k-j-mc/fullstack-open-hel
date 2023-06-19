import React from "react";

const Filter = ({ handleSearch, searchQuery }) => {
	return (
		<form>
			<div>
				find contact{" "}
				<input value={searchQuery} onChange={handleSearch} />
			</div>
		</form>
	);
};

export default Filter;
