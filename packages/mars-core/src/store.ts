import { action, map } from "nanostores";
import { Cell, CellId, CodeStore, PyodideStore } from "./types";
import PyodideManager from "./pyodide";
import { generateId } from "./utils";

export const pyodideStore = map<PyodideStore>({
	pyodideManager: new PyodideManager(),
	pyodideLoading: true,
	packagesLoading: false,
	statusText: "Preparing Python environment ...",
	finalized: false,
	executingId: null,
	pythonEnv: new Map(),
	installedPackages: [],
});

export const setInstalledPackages = action(
	pyodideStore,
	"setInstalledPackages",
	(store, packages: string[]) => {
		store.setKey("installedPackages", packages);
	},
);

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

export const codeStore = map<CodeStore>({ cells: new Map(), order: [] });

export const setCell = action(
	codeStore,
	"setCell",
	(store, id: string, cell: Cell) => {
		const { cells } = codeStore.get();
		const old = cells.get(id);
		if (old) {
			store.setKey("cells", new Map(cells.set(id, cell)));
		}
	},
);

export const setCellField = action(
	codeStore,
	"setField",
	(
		store,
		{ id, field, value }: { id: CellId; field: keyof Cell; value: string },
	) => {
		const { cells } = codeStore.get();
		const old = cells.get(id);
		if (old) {
			// @ts-ignore
			old[field] = value;
			store.setKey("cells", new Map(cells.set(id, old)));
		}
	},
);

export const addCell = action(
	codeStore,
	"addCell",
	(store, config?: { afterId?: string; code?: string }) => {
		const { afterId, code } = config || { code: "", afterId: undefined };
		const { cells, order } = codeStore.get();
		const newCellId = generateId();
		store.setKey(
			"cells",
			new Map(
				cells.set(newCellId, {
					code: code || "",
					output: "",
					success: null,
					error: null,
				}),
			),
		);
		let newOrder;
		if (afterId) {
			const index = order.indexOf(afterId);
			if (index !== -1) {
				newOrder = [
					...order.slice(0, index + 1),
					newCellId,
					...order.slice(index + 1),
				];
			} else {
				newOrder = [...order, newCellId];
			}
		} else {
			newOrder = [...order, newCellId];
		}
		store.setKey("order", newOrder);
	},
);

export const deleteCell = action(
	codeStore,
	"deleteCell",
	(store, id: string) => {
		const { cells, order } = codeStore.get();
		cells.delete(id);
		const newOrder = order.filter((cellId) => cellId !== id);
		store.setKey("cells", new Map(cells));
		store.setKey("order", newOrder);
	},
);
