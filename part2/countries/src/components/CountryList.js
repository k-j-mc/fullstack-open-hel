import React from "react";

const Countries = ({ handleShow, searchResults }) => {
	return (
		<ul className="countryList">
			{searchResults.map((country) => (
				<li key={country.cca3}>
					{country.name.common}
					<button onClick={() => handleShow(country.name.common)}>
						show
					</button>
				</li>
			))}
		</ul>
	);
};

export default Countries;
