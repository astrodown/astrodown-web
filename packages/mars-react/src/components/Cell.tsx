import Editor from "./Editor";
import Output from "./Output";
import ActionBar from "./ActionBar";
import React from "react";

interface Props {
	id: string;
	output: string;
	success: boolean | null;
	error: boolean | null;
}

const Cell = ({ id, output, success, error }: Props) => {
	return (
		<div className="cell my-4">
			<div className="editor">
				<Editor id={id} success={success} error={error} />
			</div>
			<Output output={output} />
			<ActionBar id={id} />
		</div>
	);
};

export default React.memo(Cell);
