import { PlaygroundWrapper } from "@astrodown/mars-react"
import "@astrodown/mars-react/dist/style.css"
import { ExportData } from "@astrodown/schema"

const exports: ExportData[] = [
  { name: "a", value: 1, type: "raw" },
  { name: "df", value: "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv", type: "pandas" }
]

function App() {
  return <main className="px-10 py-5">
    <PlaygroundWrapper exports={exports} />
  </main>
}

export default App
