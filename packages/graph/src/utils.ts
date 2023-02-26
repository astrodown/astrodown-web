import { Layout } from "@antv/graphin";

export const classNames = (...classes: string[]) => {
	return classes.filter(Boolean).join(" ");
};

export const graphLayoutOptions: Layout[] = [
	"graphin-force",
	"grid",
	"circular",
	"concentric",
	"dagre",
	"radia",
	"mds",
	"force",
	"gForce",
	"random",
].map((s) => ({ type: s }));
