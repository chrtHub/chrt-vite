import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import { visualizer } from "rollup-plugin-visualizer";
import Inspect from "vite-plugin-inspect";
import wasm from "vite-plugin-wasm";

//-- https://vitejs.dev/config/ --//
export default defineConfig({
  plugins: [
    [react() as PluginOption],
    [mdx() as PluginOption],
    [visualizer() as PluginOption],
    [Inspect() as PluginOption],
    [wasm() as PluginOption],
  ],
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    sourcemap: true, //-- Defaults to 'false' --//
  },
});
