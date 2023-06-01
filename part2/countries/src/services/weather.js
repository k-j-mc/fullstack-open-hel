import axios from "axios";

const URL = "https://api.openweathermap.org/data/2.5/weather";

const API_KEY = process.env.REACT_APP_API_KEY;

const getWeather = (e) => {
	const lat = e[0];
	const lng = e[1];

	const request = axios.get(
		`${URL}?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`
	);

	return request.then((response) => response.data);
};

export default { getWeather };
