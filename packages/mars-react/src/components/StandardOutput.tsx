import React from "react";

const StandardOutput = () => {
	return (
		<div className="font-mono border border-blue-500 rounded-lg">
			<div className="p-2" id="stdout">
				<h2 className="font-sans font-bold text-lg">Standard Output</h2>
			</div>
		</div>
	);
};

export default React.memo(StandardOutput);
