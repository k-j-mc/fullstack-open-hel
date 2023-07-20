import React from "react";
import ReactDOM from "react-dom/client";

import { legacy_createStore as createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

const App = () => {
	const clickHandler = (event) => {
		store.dispatch({
			type: event,
		});
	};

	return (
		<div>
			<button onClick={() => clickHandler("GOOD")}>good</button>
			<button onClick={() => clickHandler("OK")}>ok</button>
			<button onClick={() => clickHandler("BAD")}>bad</button>
			<button onClick={() => clickHandler("ZERO")}>reset stats</button>
			<div>good {store.getState().good}</div>
			<div>ok {store.getState().ok}</div>
			<div>bad {store.getState().bad}</div>
		</div>
	);
};

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () => {
	root.render(<App />);
};

renderApp();
store.subscribe(renderApp);
