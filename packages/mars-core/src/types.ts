import { PyodideInterface } from "pyodide";

export interface PyodideStore {
	pyodide: PyodideInterface | null;
	pyodideLoading: boolean;
	packagesLoading: boolean;
	statusText: string;
	finalized: boolean;
	executingId: null | string;
}

export type CodeStore = {
	[key: string]: { code: string; output: string; loading: boolean };
};
