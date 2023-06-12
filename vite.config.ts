import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import topLevelAwait from "vite-plugin-top-level-await";
import { visualizer } from "rollup-plugin-visualizer";
import Inspect from "vite-plugin-inspect";
import gfm from "remark-gfm";

//-- https://vitejs.dev/config/ --//
export default defineConfig({
  plugins: [
    [react() as PluginOption],
    [
      mdx({
        remarkPlugins: [gfm],
      }) as PluginOption,
    ],
    [
      topLevelAwait({
        promiseExportName: "__tla",
        promiseImportName: (i) => `__tla_${i}`,
      }),
    ],
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
