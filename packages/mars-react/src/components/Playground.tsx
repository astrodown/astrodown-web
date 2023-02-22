import { useStore } from "@nanostores/react";
import { pyodideStore, storeActions } from "@astrodown/mars-core";
import Cell from "./Cell";
import { useEffect } from "react";
import type { ExportData } from "@astrodown/schema";

interface Props {
    exports: ExportData[];
}

// const pythonSetupSrc = "https://raw.githubusercontent.com/astrodown/astrodown-python/main/scripts/setup.py"

export default function Playground({ exports }: Props) {
    const { pyodideManager, packagesLoading, pythonEnv } = useStore(pyodideStore);
    const envList: Array<[string, string]> = Array.from(pythonEnv.entries()).map((entry) => {
        const [key, value] = entry
        if (typeof value === "function") {
            return [key, "function"]
        }
        if (value instanceof Map) {
            return [key, "dict"]
        }
        if (value instanceof Object && ("type" in value)) {
            return [key, value["type"] as string]
        }
        if (value instanceof Array) {
            return [key, "list"]
        }
        return [key, String(value)]

    })


    useEffect(() => {
        if (!packagesLoading && pyodideManager.ready) {
            pyodideManager.setGlobal("astrodown_js", {
                exports,
            });
            pyodideManager.run(`
            import astrodown.js
            astrodown_js = astrodown_js.to_py()
            for export in astrodown_js["exports"]:
                globals()[export["name"]] = astrodown.js.load_export(export)

            del globals()["export"]
            `)
                .then(() => pyodideManager.getEnv())
                .then(env => storeActions.setPythonEnv(env))
                .catch((err) => console.error(err));
        }
    }, [packagesLoading]);



    return <div className="grid grid-cols-5 gap-8">
        <div className="python-env col-span-1">
            <h2 className="font-sans font-bold text-lgm mb-4">Environment</h2>
            <ul className="text-xs tracking-tighter font-mono">
                {envList.map((arr, i) => <li key={`obj-${i}`} className="border-b flex gap-2 py-2 px-1">
                    <span className="">{arr[0]}</span>
                    <span className="ml-auto">{arr[1]}</span>
                </li>)}
            </ul>
        </div>
        <div className="cell-list col-span-4">
            {exports.map((exportData, i) => <Cell key={`${i}`} exportData={exportData} />)}
        </div>
    </div>

}
