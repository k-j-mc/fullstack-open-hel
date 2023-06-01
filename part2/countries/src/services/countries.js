import axios from "axios";

const URL = "https://studies.cs.helsinki.fi/restcountries/api/all";

const getCountries = () => {
	const request = axios.get(URL);

	return request.then((response) => response.data);
};

export default { getCountries };
