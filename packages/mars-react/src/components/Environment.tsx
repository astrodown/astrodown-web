import { pyodideStore } from "@astrodown/mars-core";
import { useStore } from "@nanostores/react";
import React from "react";

const Environment = () => {
	const { pythonEnv } = useStore(pyodideStore);

	const envList: Array<[string, string]> = Array.from(pythonEnv.entries()).map(
		(entry) => {
			const [key, value] = entry;
			if (typeof value === "function") {
				return [key, "function"];
			}
			if (value instanceof Map) {
				return [key, "dict"];
			}
			if (value instanceof Object && "type" in value) {
				return [key, value["type"] as string];
			}
			if (value instanceof Array) {
				return [key, "list"];
			}
			return [key, String(value)];
		},
	);

	return (
		<>
			<h2 className=" font-bold text-lg mb-4">Environment</h2>
			<ul className="text-xs tracking-tighter font-mono">
				{envList.map((arr, i) => (
					<li key={`obj-${i}`} className="border-b flex gap-2 py-2 px-1">
						<span className="">{arr[0]}</span>
						<span className="ml-auto">{arr[1]}</span>
					</li>
				))}
			</ul>
		</>
	);
};

export default React.memo(Environment);
