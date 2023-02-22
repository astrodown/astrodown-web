import PyodideManager from "./pyodide";

export interface PyodideStore {
	pyodideManager: PyodideManager;
	pyodideLoading: boolean;
	packagesLoading: boolean;
	statusText: string;
	finalized: boolean;
	executingId: null | string;
	pythonEnv: Map<string, unknown>
}

export type CodeStore = {
	[key: string]: { code: string; output: string; loading: boolean };
};
