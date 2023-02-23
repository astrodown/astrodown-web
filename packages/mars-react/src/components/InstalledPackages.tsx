import { useStore } from "@nanostores/react";
import { pyodideStore } from "@astrodown/mars-core";
import InstallPackageButton from "./InstallPackageButton";

export default function InstalledPackages() {
	const { installedPackages } = useStore(pyodideStore);
	return (
		<div className="text-xs tracking-tighter font-mono">
			<h2 className=" font-bold text-lg mt-8 mb-4">Installed Packages</h2>
			<InstallPackageButton />
			<ul>
				{installedPackages.map((pkg, i) => (
					<li key={`pkg-${i}`} className="border-b flex gap-2 py-2 px-1">
						<span className="">{pkg}</span>
					</li>
				))}
			</ul>
		</div>
	);
}
