import { useStore } from "@nanostores/react";
import {
	codeStoreActions,
	pyodideStore,
	pyodideStoreActions,
} from "@astrodown/mars-core";
import { useEffect } from "react";
import type { ExportData } from "@astrodown/schema";
import { createPortal } from "react-dom";
import Playground from "./Playground";

interface Props {
	exports: ExportData[];
}

const captureStdout = (text: string) => {
	const element = document.getElementById("stdout");
	if (element) {
		const stdoutItem = document.createElement("p");
		stdoutItem.textContent = text;
		element.appendChild(stdoutItem);
	}
};

const { addCell } = codeStoreActions;
const { setPythonEnv, setInstalledPackages } = pyodideStoreActions;

export default function PlaygroundWrapper({ exports }: Props) {
	const { pyodideManager, finalized, statusText } = useStore(pyodideStore);

	useEffect(() => {
		pyodideManager
			.loadPyodide({ stdout: captureStdout })
			.then(() => {
				// pyodide is now ready to use...
				pyodideStore.setKey("pyodideLoading", false);
				// start installing packages
				pyodideStore.setKey("packagesLoading", true);
				pyodideStore.setKey(
					"statusText",
					"Installing packages: numpy, pandas ...",
				);
				return pyodideManager.configureDependencies();
			})
			.then(() => {
				pyodideStore.setKey("packagesLoading", false);
				pyodideStore.setKey("statusText", "Loading notebook exports ...");
				exports.forEach((exportData) => {
					addCell({
						code:
							exportData instanceof Object
								? exportData.name
								: exportData.toString(),
					});
				});
				pyodideManager.setGlobal("astrodown_js", {
					exports,
				});
				return pyodideManager.run(`
                import astrodown.js
                astrodown_js = astrodown_js.to_py()
                for export in astrodown_js["exports"]:
                    globals()[export["name"]] = astrodown.js.load_export(export)

                del globals()["export"]
                `);
			})
			.then(() =>
				Promise.all([
					pyodideManager.getEnv(),
					pyodideManager.listInstalledPackages(),
				]),
			)
			.then(([env, pkgs]) => {
				setPythonEnv(env);
				setInstalledPackages(pkgs);
				pyodideStore.setKey("statusText", "Environment is ready!");
				setTimeout(() => {
					pyodideStore.setKey("finalized", true);
				}, 100);
			})
			.catch((err) => console.error(err));
		// setup finished
	}, []);

	return (
		<div>
			{!finalized &&
				createPortal(
					<div className="opacity-75 bg-gradient-to-br from-cyan-100 to-indigo-100 via-white absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center text-2xl font-bold font-mono">
						{statusText}
					</div>,
					document.body,
				)}
			<Playground />
		</div>
	);
}
