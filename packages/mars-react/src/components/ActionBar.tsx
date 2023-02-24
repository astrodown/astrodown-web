import { codeStoreActions } from "@astrodown/mars-core";
import React, { useCallback } from "react";

interface Props {
	id: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const Button = ({ children, onClick }: ButtonProps) => {
	return (
		<button
			className="inline-flex items-center justify-center bg-indigo-600 text-sm rounded-lg py-1 px-2 shadow-md text-white"
			onClick={onClick}
		>
			{children}
		</button>
	);
};

const ActionBar = ({ id }: Props) => {
	const addCell = useCallback(() => {
		codeStoreActions.addCell({ afterId: id });
	}, []);

	const deleteCell = useCallback(() => {
		codeStoreActions.deleteCell(id);
	}, []);

	return (
		<div className="action-bar flex items-center justify-center gap-4 mt-6 border-t opacity-0 hover:opacity-100 transition-opacity duration-200 ease-linear font-mono text-sm">
			<div className="add-cell -mt-4">
				<Button onClick={addCell}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="w-4 h-4"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 4.5v15m7.5-7.5h-15"
						/>
					</svg>
					Add
				</Button>
			</div>
			<div className="delete-cell -mt-4">
				<Button onClick={deleteCell}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="w-4 h-4"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
					Delete
				</Button>
			</div>
		</div>
	);
};

export default React.memo(ActionBar);
