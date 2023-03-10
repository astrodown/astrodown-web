import { useStore } from "@nanostores/react";
import { pyodideStore, codeStore } from "@astrodown/mars-core";
import Cell from "./Cell";
import Environment from "./Environment";
import InstalledPackages from "./InstalledPackages";
import StandardOutput from "./StandardOutput";
// const pythonSetupSrc = "https://raw.githubusercontent.com/astrodown/astrodown-python/main/scripts/setup.py"

export default function Playground() {
	const { finalized } = useStore(pyodideStore);
	const { cells, order } = useStore(codeStore);
	const cellsOrdered = order.map((id) => {
		const cell = cells.get(id)!;
		return {
			id,
			...cell,
		};
	});

	if (!finalized) {
		return null;
	}

	return (
		<div className="grid grid-cols-5 gap-8">
			<div className="python-env col-span-1">
				<Environment />
				<InstalledPackages />
			</div>
			<div className="col-span-4">
				<div className="cell-list">
					{cellsOrdered.map(({ id, output, success, error }) => (
						<Cell
							id={id}
							output={output}
							success={success}
							error={error}
							key={id}
						/>
					))}
				</div>
				<StandardOutput />
			</div>
		</div>
	);
}
