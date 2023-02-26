import React from "react";
import ReactDOM from "react-dom/client";
import Network from "./Network";
import graphData from "./assets/graphData.json";
import "./styles/tailwind.css";

function App() {
	return (
		<>
			<Network data={graphData} layout={{ type: "graphin-force" }} />
		</>
	);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<main className='px-10 py-5'>
			<App />
		</main>
	</React.StrictMode>,
);
