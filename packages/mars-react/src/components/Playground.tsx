import { useStore } from "@nanostores/react";
import { pyodideStore } from "@astrodown/mars-core";
import Cell from "./Cell";
import { useEffect } from "react";
import type { ExportData } from "@astrodown/schema";
import { createPortal } from "react-dom";

interface Props {
    data: ExportData[];
}

const pythonSetupSrc = "https://raw.githubusercontent.com/astrodown/astrodown-python/main/scripts/setup.py"

export default function Playground({ data }: Props) {
    const { pyodide, packagesLoading, finalized, statusText } = useStore(pyodideStore);

    useEffect(() => {
        if (pyodide && !packagesLoading) {
            pyodide.globals.set("astrodown_js", {
                exports: data
            });
            fetch(pythonSetupSrc)
                .then((res) => res.text())
                .then((text) => pyodide.runPython(text));
        }
    }, [packagesLoading]);



    return <div>
        {!finalized && createPortal(<div className="opacity-50 bg-gradient-to-br from-cyan-100 to-indigo-100 via-white absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center text-2xl font-bold font-mono">
            {statusText}
        </div>, document.body)}
        {data.map((exportData, i) => <Cell key={`${i}`} exportData={exportData} />)}
        <div className="font-mono border border-blue-500 rounded-lg" >
            <div className="p-2" id="stdout">
                <h2 className="font-sans font-bold text-lg">Standard Output</h2>
            </div>
        </div>
    </div>
}
