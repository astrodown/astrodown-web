

import { useStore } from "@nanostores/react";
import { pyodideStore } from "@astrodown/mars-core";
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


export default function PlaygroundWrapper({ exports }: Props) {
    const { pyodideManager, finalized, statusText } = useStore(pyodideStore);

    useEffect(() => {
        pyodideManager.loadPyodide({ stdout: captureStdout })
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

            }).then(() => {
                pyodideStore.setKey("packagesLoading", false);
                // setup finished
                pyodideStore.setKey("statusText", "Environment is ready!");
                setTimeout(() => {
                    pyodideStore.setKey("finalized", true);
                }, 100);
            })
    }, []);



    return <div>
        {!finalized && createPortal(<div className="opacity-50 bg-gradient-to-br from-cyan-100 to-indigo-100 via-white absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center text-2xl font-bold font-mono">
            {statusText}
        </div>, document.body)}
        <Playground exports={exports} />
        <div className="font-mono border border-blue-500 rounded-lg" >
            <div className="p-2" id="stdout">
                <h2 className="font-sans font-bold text-lg">Standard Output</h2>
            </div>
        </div>
    </div>
}
