import { action, map } from "nanostores";
import { CodeStore, PyodideStore } from "./types";
import PyodideManager from "./pyodide";

export const pyodideStore = map<PyodideStore>({
	pyodideManager: new PyodideManager(),
	pyodideLoading: true,
	packagesLoading: false,
	statusText: "Preparing Python environment ...",
	finalized: false,
	executingId: null,
	pythonEnv: new Map(),
});

export const setPythonEnv = action(
	pyodideStore,
	"setPythonEnv",
	(store, env: Map<string, unknown>) => {
		store.setKey("pythonEnv", env);
	},
);

export const setPyodideManager = action(
	pyodideStore,
	"setPyodideManager",
	(store, manager) => {
		store.setKey("pyodideManager", manager);
	},
);

export const setExecutingId = action(
	pyodideStore,
	"setExecutingId",
	(store, id: string) => {
		store.setKey("executingId", id);
	},
);

export const codeStore = map<CodeStore>({});

export const initCell = action(
	codeStore,
	"initCell",
	(store, id: string, code?: string) => {
		if (!store.get()[id]) {
			store.setKey(id, { code: code || "", output: "", loading: false });
		}

		return store.get()[id];
	},
);

export const setCode = action(
	codeStore,
	"setCode",
	(store, id: string, code: string) => {
		const old = codeStore.get()[id] || { output: "", loading: false };
		store.setKey(id, { ...old, code });
	},
);

export const setOutput = action(
	codeStore,
	"setOutput",
	(store, id: string, output: string) => {
		const old = codeStore.get()[id] || { code: "" };
		store.setKey(id, { ...old, loading: false, output });
	},
);

export const setLoading = action(
	codeStore,
	"setLoading",
	(store, id: string, loading: boolean) => {
		const old = codeStore.get()[id] || { code: "", output: "" };
		store.setKey(id, { ...old, loading });
	},
);
