import { ExportData } from "@astrodown/schema"
import { codeStore, storeActions } from "@astrodown/mars-core"
import { useId } from "react";
import React from "react"
import Editor from "./Editor";
import { useStore } from "@nanostores/react";

const { initCell } = storeActions

interface Props {
    exportData: ExportData
}

export default function Cell({ exportData }: Props) {
    const id = useId();
    let initialCode = ""
    if ((exportData instanceof Object)) {
        initialCode = exportData.name
    }
    initCell(id, initialCode);

    const allCells = useStore(codeStore);
    const { output } = allCells[id] || { output: "", code: "" };

    return (
        <div className="cell my-8">
            <div className="editor">
                <Editor id={id} />
            </div>

            <div className="output font-mono">
                {output && <div className="output" id={`output-${id}`}>{output}</div>}
            </div>
        </div >
    );
}
