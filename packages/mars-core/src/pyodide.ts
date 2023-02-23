import { PyProxy, PyodideInterface, loadPyodide } from "pyodide";
import { DataFrameParser, fallbackParser, seriesParser } from "./parser";
import { replaceAngleBrackets, showError } from "./utils";

const defaultIndexURL = "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/";
export default class PyodideManager {
	private instance: PyodideInterface | null = null;
	private micropip: PyProxy | null = null;
	public ready: boolean = false;
	private indexURL: string = defaultIndexURL;
	private stdout: (out: string) => void = () => {};
	private objectExcludedFromEnv: string[] = [
		"__name__",
		"__doc__",
		"__package__",
		"__loader__",
		"__spec__",
		"__annotations__",
		"__builtins__",
		"version_info",
		"pyversion",
		"_pyodide_core",
		"_set_global",
	];

	async loadPyodide({
		indexURL = defaultIndexURL,
		stdout,
	}: { indexURL?: string; stdout?: (out: string) => void }) {
		if (this.ready) {
			return this.instance;
		}
		this.instance = await loadPyodide({ indexURL, stdout });

		this.indexURL = indexURL;
		this.stdout = stdout || this.stdout;
		this.ready = true;
		return this.instance;
	}

	async configureDependencies() {
		if (this.instance) {
			await this.instance.loadPackage("micropip");
			this.micropip = this.instance.pyimport("micropip");
			await this.micropip.install("pandas");
			await this.micropip.install("astrodown");
		}
	}

	async installPackage(name: string) {
		if (this.micropip) {
			return await this.micropip.install(name);
		}
	}

	async getFunctionSignature(data: PyProxy, regex: RegExp) {
		let funcString = data.toString();
		const match = funcString.match(regex);
		funcString = replaceAngleBrackets(funcString);
		if (match) {
			const funcName = match[1] as string;
			try {
				const doc = await this.instance?.runPythonAsync(
					`astrodown.js.inspect_function(${funcName})`,
				);
				return `${funcString}<br/>${doc}`;
			} catch {
				return funcString;
			}
		} else {
			return funcString;
		}
	}

	async run(code: string) {
		if (this.instance === null) {
			await this.loadPyodide({ indexURL: this.indexURL, stdout: this.stdout });
		}

		let html = "";
		if (this.instance) {
			let result;
			try {
				result = await this.instance.runPythonAsync(code);
				html = await this.toHTML(result);
			} catch (e) {
				console.log(e);
				throw new Error(showError(e));
			}
		}

		return html;
	}

	async listInstalledPackages() {
		const packages = [];
		if (this.micropip) {
			for (let pkg of await this.micropip.list()) {
				packages.push(pkg);
			}
		}
		return packages;
	}

	async runFile(file: string) {
		const response = await fetch(file);
		const text = await response.text();
		return await this.run(text);
	}

	setGlobal(name: string, value: unknown) {
		if (this.instance) {
			this.instance.globals.set(name, value);
		}
	}

	async getEnv(): Promise<Map<string, unknown>> {
		if (this.instance) {
			const globals = this.instance.globals.toJs() as Map<string, unknown>;
			for (const [key, _] of globals) {
				if (
					this.objectExcludedFromEnv.includes(key) ||
					key.startsWith("astrodown")
				) {
					globals.delete(key);
				}
			}
			return globals;
		}

		return new Map();
	}

	async toHTML(data: PyProxy | undefined): Promise<string> {
		if (!data) {
			return "";
		}
		console.log("pyodideManager.toHTML: ", "received data type ", data.type);
		if (data.type) {
			switch (data.type) {
				case "Series":
					return seriesParser(data, { stringify: true }) as string;
				case "DataFrame":
					return DataFrameParser(data);
				case "type":
					let typeString = data.toString();
					return replaceAngleBrackets(typeString);
				case "module":
					let moduleString = data.toString();
					return replaceAngleBrackets(moduleString);
				case "builtin_function_or_method":
					return await this.getFunctionSignature(
						data,
						/^<built-in function (\w+)/,
					);
				case "function":
					return await this.getFunctionSignature(data, /^<function (\w+)/);
				case "method":
					return await this.getFunctionSignature(data, /^<bound method (\w+)/);
				default:
					// for primary types (int, string) that is already converted to JS types, their type is undefined
					return fallbackParser(data);
			}
		}

		return fallbackParser(data);
	}
}
