import CodeMirror from "@uiw/react-codemirror";
import { githubLight } from "@uiw/codemirror-theme-github"
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
    const execute = async () => {
        if (pyodide) {
            setExecutingId(id)
            setLoading(id, true)
            setOutput(id, await runPython(pyodide, code));
        }
    }

    let keysPressed: KeysPressed = {};

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
        keysPressed[event.key] = true;

        if (keysPressed["Enter"] && keysPressed["Shift"]) {
            execute()
        }
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        keysPressed[event.key] = undefined;
    };


    return (
        <div className="relative group">
            <CodeMirror
                value={code}
                theme={githubLight}
                extensions={[python()]}
                onChange={(val) => setCode(id, val)}
                onKeyDown={(e) => handleKeyDown(e)}
                onKeyUp={(e) => handleKeyUp(e)}
            />
            <div className="absolute top-0 right-0 hidden group-hover:block">
                <button onClick={() => execute()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                </button>
            </div>
            <div className="absolute bottom-1/3 left-[-50px]">
                {loading && <Spinner />}
            </div>
        </div>
    );
}
