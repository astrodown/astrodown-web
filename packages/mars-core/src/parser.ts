import { PyProxy, PyodideInterface } from "pyodide";
import { replaceAngleBrackets } from "./utils";

export const repr = (cls: string, data: unknown) => {
	return `${cls}(${data})`;
};

const reprWithLengthAndType = ({
	cls,
	data,
	length,
	type,
}: { cls: string; data: unknown; length: number; type: string }) => {
	return `${cls}(${data})<br/><span class = "tracking-tighter text-xs text-red">length=${length}, dtype=${type}<span>`;
};

export const fallbackParser = (data: PyProxy) => {
	return String(data);
};

export const seriesParser = (
	data: PyProxy,
	options?: { stringify: boolean },
) => {
	const { stringify } = options || { stringify: true };
	const values = [];
	const dtype = data.get(0).type;
	if (data.supportsLength() && data.supportsGet()) {
		if (data.length <= 100) {
			for (let i = 0; i < data.length; i++) {
				values.push(String(data.get(i)));
			}
		} else {
			for (let i = 0; i < 5; i++) {
				values.push(String(data.get(i)));
			}
			values.push("...");
			for (let i = data.length - 5; i < data.length; i++) {
				values.push(String(data.get(i)));
			}
		}
	}
	return stringify
		? reprWithLengthAndType({
				cls: "pd.Series",
				data: `[${values.join(", ")}]`,
				length: data.length,
				type: dtype,
		  })
		: values;
};

export const DataFrameParser = (data: PyProxy) => {
	const dataset = new Map();
	let nrow: number | undefined = undefined;
	let displayRows: number | undefined = undefined;
	// @ts-ignore
	for (let col of data) {
		const values = data.get(col) as PyProxy;
		if (!nrow) nrow = values.length;
		const colValues = seriesParser(values, { stringify: false }) as string[];
		if (!displayRows) displayRows = colValues.length;
		dataset.set(col, colValues);
	}
	// const ncol = dataset.size;
	const records: Array<string[]> = [];
	for (let i = 0; i < displayRows!; i++) {
		const row: string[] = [];
		for (let [_, value] of dataset.entries()) {
			row.push(value[i]);
		}
		records.push(row);
	}
	const ncol = dataset.size;
	return `
	<p>pandas.DataFrame with ${ncol} columns and ${nrow} rows</p>
	<table class="table-auto mt-4 text-left font-sans">
			<thead class = "bg-gray-50">
				<tr scope = "col">
				${Array.from(dataset.keys())
					.map((x) => `<th class = "px-1 py-2 border-b">${x}</th>`)
					.join("")}
				</tr>
			</thead>
			<tbody>
				${records
					.map(
						(row) =>
							`<tr class = "whitespace-nowrap bg-white border-b hover:bg-gray-50">${row
								.map((x) => `<td class = "px-1 py-2">${x}</td>`)
								.join("")}</tr>`,
					)
					.join("")}
			</tbody>
	</table>
    `;
};

export const functionParser = async (
	data: PyProxy,
	instance: PyodideInterface,
) => {
	let funcString = data.toString();
	funcString = replaceAngleBrackets(funcString);
	const regex = /built-in function (\w+)/;
	const match = funcString.match(regex);
	if (match) {
		const funcName = match[1];
		const description = await instance.runPythonAsync(
			`astrodown.js.inspect_function(${funcName})`,
		);
		return `${funcString}<br/>${description}`;
	} else {
		return funcString;
	}
};
