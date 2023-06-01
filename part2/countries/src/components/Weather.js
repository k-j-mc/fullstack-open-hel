import React from "react";

const Weather = ({ country, weather }) => {
	console.log(weather);
	return (
		<div>
			<h3>Weather in {weather.name}</h3>
			<p>Temperature: {weather.main.temp} Celcius</p>
			<p>Feels like: {weather.main.feels_like} Celcius</p>
			<img
				src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
				alt={`${weather.name} weather`}
			/>
			<p>{weather.weather[0].main}</p>
			<p>
				{weather.wind.speed} Metres / Second & {weather.wind.deg}{" "}
				degrees
			</p>
		</div>
	);
};

export default Weather;
