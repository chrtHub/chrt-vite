import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import { visualizer } from "rollup-plugin-visualizer";
import Inspect from "vite-plugin-inspect";

//-- https://vitejs.dev/config/ --//
export default defineConfig({
  plugins: [
    [react() as PluginOption],
    [mdx() as PluginOption],
    [Inspect() as PluginOption],
    [
      visualizer({
        template: "treemap",
      }) as PluginOption,
    ],
  ],
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    target: "es2022",
    sourcemap: true, //-- Defaults to 'false' --//
  },
});
