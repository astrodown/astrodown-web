import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "mars-react",
			fileName: (format) => `index.${format}.js`,
			formats: ["es"],
		},
		sourcemap: true,
		emptyOutDir: true,
	},
	plugins: [dts()],
});
