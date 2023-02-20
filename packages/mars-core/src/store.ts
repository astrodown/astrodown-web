import { action, map, onMount } from "nanostores";
import { loadPyodide } from "pyodide";
import { CodeStore, PyodideStore } from "./types";

const indexURL = "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/";

export const pyodideStore = map<PyodideStore>({
	pyodide: null,
	pyodideLoading: true,
	packagesLoading: false,
	statusText: "Preparing Python environment ...",
	finalized: false,
	executingId: null,
});

export const setExecutingId = action(
	pyodideStore,
	"setExecutingId",
	(store, id: string) => {
		store.setKey("executingId", id);
	},
);

const captureStdout = (text: string) => {
	const element = document.getElementById("stdout");
	if (element) {
		const stdoutItem = document.createElement("p");
		stdoutItem.textContent = text;
		element.appendChild(stdoutItem);
	}
};

onMount(pyodideStore, () => {
	loadPyodide({ indexURL, stdout: captureStdout }).then(async (pyodide) => {
		// pyodide is now ready to use...
		pyodideStore.setKey("pyodide", pyodide);
		pyodideStore.setKey("pyodideLoading", false);
		// start installing packages
		pyodideStore.setKey("packagesLoading", true);
		pyodideStore.setKey("statusText", "Installing packages: numpy, pandas ...");
		await pyodide.loadPackage("micropip");
		const micropip = pyodide.pyimport("micropip");
		await micropip.install("pandas");
		await micropip.install("astrodown");
		pyodideStore.setKey("packagesLoading", false);
		// setup finished
		pyodideStore.setKey("statusText", "Environment is ready!");
		setTimeout(() => {
			pyodideStore.setKey("finalized", true);
		}, 100);
	});
});

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
	(store, id: string, output: string | undefined) => {
		const old = codeStore.get()[id] || { code: "" };
		store.setKey(id, { ...old, loading: false, output: String(output) });
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
