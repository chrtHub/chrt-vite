import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import Inspect from "vite-plugin-inspect";

//-- https://vitejs.dev/config/ --//
export default defineConfig({
  plugins: [
    [react() as PluginOption],
    [visualizer() as PluginOption],
    [Inspect() as PluginOption],
  ],
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    sourcemap: true, //-- Defaults to 'false' --//
  },
});
