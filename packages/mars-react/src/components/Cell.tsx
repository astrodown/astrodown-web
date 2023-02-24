import { codeStore } from "@astrodown/mars-core";
import Editor from "./Editor";
import { useStore } from "@nanostores/react";
import Output from "./Output";
import ActionBar from "./ActionBar";
import React from "react";

interface Props {
	id: string;
	output: string;
}

const Cell = ({ id }: Props) => {
	const code = useStore(codeStore);
	const cell = code.cells.get(id);
	if (!cell) {
		return null;
	}

	return (
		<div className="cell my-4">
			<div className="editor">
				<Editor id={id} />
			</div>
			<Output output={cell.output} />
			<ActionBar id={id} />
		</div>
	);
};

export default React.memo(Cell);
