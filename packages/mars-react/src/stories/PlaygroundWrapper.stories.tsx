import { ExportData } from "packages/schema/dist";
import { PlaygroundWrapper } from "../components";

export default {
    title: "Example/PlaygroundWrapper",
    component: PlaygroundWrapper,
}


const exportData: ExportData[] = [
    { name: "a", value: 1, type: "raw" },
    { name: "df", value: "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv", type: "pandas" }
]

export const Default = { args: { exports: exportData } } as const


