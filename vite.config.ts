import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import Inspect from "vite-plugin-inspect";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

//-- https://vitejs.dev/config/ --//
export default defineConfig({
  plugins: [
    [react() as PluginOption],
    [visualizer() as PluginOption],
    [Inspect() as PluginOption],
    [wasm() as PluginOption],
    [
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: "__tla",
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: (i) => `__tla_${i}`,
      }) as PluginOption,
    ],
  ],
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    sourcemap: true, //-- Defaults to 'false' --//
  },
});
