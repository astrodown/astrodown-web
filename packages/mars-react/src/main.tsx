import React from "react";
import ReactDOM from "react-dom/client";
import { PlaygroundWrapper } from "./components/";
import { ExportData } from "@astrodown/schema";
import { Toaster } from "react-hot-toast";
import "./styles/tailwind.css";

const exports: ExportData[] = [
	{ name: "a", value: 1, type: "raw" },
	{
		name: "df",
		value:
			"https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv",
		type: "pandas",
	},
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<main className='px-10 py-5'>
			<Toaster />
			<PlaygroundWrapper exports={exports} />
		</main>
	</React.StrictMode>,
);
