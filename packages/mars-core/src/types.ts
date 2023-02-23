import PyodideManager from "./pyodide";

export type CellId = string;
export type Cell = {
	code: string;
	output: string;
	success: boolean | null;
	error: boolean | null;
};

export interface PyodideStore {
	pyodideManager: PyodideManager;
	pyodideLoading: boolean;
	packagesLoading: boolean;
	statusText: string;
	finalized: boolean;
	executingId: null | string;
	pythonEnv: Map<string, unknown>;
	installedPackages: string[];
}

export type CodeStore = {
	cells: Map<CellId, Cell>;
	order: CellId[];
};
