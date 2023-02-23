import CodeMirror from "@uiw/react-codemirror";
import { githubLight } from "@uiw/codemirror-theme-github";
import { python } from "@codemirror/lang-python";
import { useStore } from "@nanostores/react";
import clsx from "clsx";
import {
	codeStore,
	codeStoreActions,
	pyodideStore,
	pyodideStoreActions,
} from "@astrodown/mars-core";
import Spinner from "./Spinner";
import { useState } from "react";

const { setExecutingId, setPythonEnv } = pyodideStoreActions;
const { setCellField, setCell } = codeStoreActions;

interface KeysPressed {
	[index: string]: boolean | undefined;
}

export default function Editor({ id }: { id: string }) {
	const { pyodideManager } = useStore(pyodideStore);
	const [loading, setLoading] = useState(false);
	const { cells } = useStore(codeStore);
	const { code, success, error } = cells.get(id) || { code: "" };
	const execute = async () => {
		setLoading(true);
		setExecutingId(id);
		try {
			const result = await pyodideManager.run(code);
			setCell(id, { code, output: result, success: true, error: false });
		} catch (e) {
			setCell(id, { code, output: String(e), success: false, error: true });
		}
		setLoading(false);
		const newEnv = await pyodideManager.getEnv();
		setPythonEnv(newEnv);
	};

	let keysPressed: KeysPressed = {};

	const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
		keysPressed[event.key] = true;

		if (keysPressed["Enter"] && keysPressed["Shift"]) {
			execute();
		}
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
		keysPressed[event.key] = undefined;
	};

	return (
		<div
			className={clsx("relative group rounded-sm", {
				"border-l-4 border-green-500": success,
				"border-l-4 border-red-500": error,
			})}
		>
			<CodeMirror
				value={code}
				theme={githubLight}
				extensions={[python()]}
				onChange={(val) => setCellField({ id, field: "code", value: val })}
				onKeyDown={(e) => handleKeyDown(e)}
				onKeyUp={(e) => handleKeyUp(e)}
				style={{ fontFamily: "Fira Code, monospace" }}
			/>
			<div className="absolute top-0 right-0 hidden group-hover:block">
				<button onClick={execute}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="w-6 h-6  hover:stroke-indigo-700"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
						/>
					</svg>
				</button>
			</div>
			<div className="absolute bottom-[calc(50%-15px)] left-[-30px]">
				{loading && <Spinner />}
			</div>
		</div>
	);
}
