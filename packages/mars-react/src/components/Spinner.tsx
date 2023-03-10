import { classNames } from "@astrodown/mars-core";
import React from "react";

interface Props {
	className?: string;
}

const Spinner = ({ className }: Props) => {
	return (
		<div
			className={classNames(
				"animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full",
				className || "",
			)}
			role="status"
			aria-label="loading"
		>
			<span className="sr-only">Loading...</span>
		</div>
	);
};

export default React.memo(Spinner);
