import CodeMirror from "@uiw/react-codemirror";
import { materialDark } from "@uiw/codemirror-theme-material"
import { python } from "@codemirror/lang-python";
import { useStore } from "@nanostores/react";
import {
    codeStore,
    pyodideStore,
    runPython,
    storeActions
} from "@astrodown/mars-core";
import Spinner from "./Spinner";

const { setExecutingId, setLoading, setOutput, setCode } = storeActions

interface KeysPressed {
    [index: string]: boolean | undefined;
}

export default function Editor({ id }: { id: string }) {
    const { pyodide } = useStore(pyodideStore);
    const allCells = useStore(codeStore);
    const { code, loading } = allCells[id] || { output: "", code: "" };
    let keysPressed: KeysPressed = {};

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
        keysPressed[event.key] = true;

        if (keysPressed["Enter"] && keysPressed["Shift"]) {
            if (pyodide) {
                setExecutingId(id)
                setLoading(id, true)
                setOutput(id, await runPython(pyodide, code));
            }
        }
    };



    const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        keysPressed[event.key] = undefined;
    };


    return (
        <div className="relative">
            <CodeMirror
                value={code}
                theme={materialDark}
                extensions={[python()]}
                onChange={(val) => setCode(id, val)}
                onKeyDown={(e) => handleKeyDown(e)}
                onKeyUp={(e) => handleKeyUp(e)}
            />
            <div className="absolute bottom-1/3 left-[-50px]">
                {loading && <Spinner />}
            </div>
        </div>
    );
}
