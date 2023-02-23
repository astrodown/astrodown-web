import {
	pyodideStore,
	pyodideStoreActions,
	showError,
} from "@astrodown/mars-core";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import Spinner from "./Spinner";

const { setInstalledPackages } = pyodideStoreActions;

export default function InstallPackageButton() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [packageName, setPackageName] = useState<string>("");
	const { pyodideManager } = useStore(pyodideStore);

	const handleSubmit = async () => {
		setLoading(true);
		setError(null);

		try {
			await pyodideManager.installPackage(packageName);
			setLoading(false);
			const pkgs = await pyodideManager.listInstalledPackages();
			setInstalledPackages(pkgs);
		} catch (e) {
			setLoading(false);
			setError(packageName);
		}
	};

	return (
		<div className="mt-1 border-b border-gray-300 focus-within:border-indigo-600 mb-4 relative group">
			<input
				type="text"
				name="name"
				className="block w-full border-0 border-b border-transparent bg-gray-50 focus:border-indigo-600 focus:ring-0 sm:text-sm outline-none px-1 py-2"
				placeholder="Install Package"
				value={packageName}
				disabled={loading}
				onChange={(e) => setPackageName(e.target.value)}
			/>
			<button
				className="absolute right-2 top-[5px] hidden group-hover:block"
				onClick={() => handleSubmit()}
				disabled={loading}
			>
				{loading ? (
					<Spinner />
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				)}
			</button>
			{error && (
				<p className="text-xs text-red-500">Package `{error}`` not found</p>
			)}
		</div>
	);
}
