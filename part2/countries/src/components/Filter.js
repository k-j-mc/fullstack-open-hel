import React from "react";

const Filter = ({ handleSearch, searchQuery }) => {
	return (
		<form>
			<div>
				Find Countries:{" "}
				<input value={searchQuery} onChange={handleSearch} />
			</div>
		</form>
	);
};

export default Filter;
