import React, { Fragment, useEffect, useState } from "react";

import countryService from "./services/countries";
import weatherService from "./services/weather";

import Filter from "./components/Filter";
import CountryList from "./components/CountryList";
import Country from "./components/Country";
import Weather from "./components/Weather";
import NotFound from "./components/NotFound";
import TooMany from "./components/TooMany";

const App = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [allCountries, setAllCountries] = useState({});
	const [searchResults, setSearchResults] = useState({});
	const [weatherData, setWeatherData] = useState({});

	const getAllCountries = () => {
		countryService.getCountries().then((data) => {
			setAllCountries(data);
		});
	};

	const getWeatherData = (e) => {
		weatherService.getWeather(e).then((data) => {
			setWeatherData(data);
		});
	};
	console.log(searchResults);
	console.log(weatherData);
	useEffect(() => {
		getAllCountries();
	}, []);

	useEffect(() => {
		if (searchResults.length === 1) {
			const capital = searchResults[0].capitalInfo.latlng;
			getWeatherData(capital);
		}
	}, [searchResults]);

	const handleSearch = (e) => {
		e.preventDefault();

		setSearchQuery(e.target.value);

		let country = e.target.value.toLowerCase();

		const results = allCountries.filter((obj) =>
			obj.name.common.toLowerCase().includes(country)
		);

		setSearchResults(results);
	};

	const handleShow = (e) => {
		let country = e.toLowerCase();

		const result = allCountries.find(
			(obj) => obj.name.common.toLowerCase() === country
		);

		setSearchResults([result]);
	};

	return (
		<div>
			<Filter handleSearch={handleSearch} searchQuery={searchQuery} />
			{searchResults.length >= 10 ? (
				<TooMany />
			) : searchResults.length > 1 ? (
				<CountryList
					searchResults={searchResults}
					handleShow={handleShow}
				/>
			) : searchResults.length === 1 ? (
				<Fragment>
					<Country country={searchResults[0]} />
					<Weather weather={weatherData} />
				</Fragment>
			) : searchQuery === "" ? (
				<div>
					<p>Start by typing</p>
				</div>
			) : (
				searchResults.length === 0 && <NotFound />
			)}
		</div>
	);
};

export default App;
