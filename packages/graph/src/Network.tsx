import Graphin, {
	Components,
	Behaviors,
	GraphinData,
	Layout,
	TooltipValue,
	LegendChildrenProps,
	ThemeType,
} from "@antv/graphin";
const { Hoverable, ActivateRelations, LassoSelect } = Behaviors;
import type { NodeData } from "@astrodown/schema";

interface Props {
	data: GraphinData;
	layout?: Layout | string;
}

const theme: ThemeType = {
	mode: "dark",
	background: "#000000",
	primaryEdgeColor: "#3d4451",
	nodeSize: 14,
	primaryColor: "#a991f7",
	edgeSize: 3,
};

const { Tooltip, Legend } = Components;

export default ({ data, layout = { type: "graphin-force" } }: Props) => {
	return (
		<>
			{/* @ts-ignore */}
			<Graphin data={data} layout={layout} theme={theme}>
				<Hoverable bindType="node" />
				<ActivateRelations />
				<LassoSelect />
				<Tooltip
					bindType="node"
					placement="top-right"
					hasArrow={true}
					style={{
						width: "400px",
						boxShadow: "none",
						border: "1px solid #e5e7eb",
						borderRadius: "1rem",
					}}
				>
					{(value: TooltipValue) => {
						if (value.model) {
							const { model } = value;
							const data = model.data as NodeData;

							return (
								<div className="px-6 py-4">
									<div className='flex items-center justify-between'>
										<div className="font-bold text-xl font-serif text-zinc-100">
											{data.title}
										</div>
										<div className="text-zinc-100 texl-lg text-base">
											{data.type}
										</div>
									</div>
									{data.description && (
										<p className="text-zinc-100 text-base">
											{data.description}
										</p>
									)}
									<div className="flex justify-end">
										<a
											className="text-blue-500 "
											href={`/${data.type}/${data.slug}`}
										>
											Link
										</a>
									</div>
								</div>
							);
						}
						return null;
					}}
				</Tooltip>
				<Legend
					bindType="node"
					sortKey="data.type"
					style={{ color: "#e5e7eb" }}
				>
					{(renderProps: LegendChildrenProps) => {
						return <Legend.Node {...renderProps} />;
					}}
				</Legend>
			</Graphin>
		</>
	);
};
