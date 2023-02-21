import type { PyodideInterface } from "pyodide";
import { showError } from "./utils";
import { parsePyProxy } from "./parser";

export const runPython = async (pyodide: PyodideInterface, code: string) => {
	try {
		const result = await pyodide.runPythonAsync(code);
		return parsePyProxy(result);
	} catch (e) {
		return showError(e);
	}
};
