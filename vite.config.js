import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

//-- https://vitejs.dev/config/ --//
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
  },
  buid: {
    sourcemap: false, //-- Defaults to 'false' --//
  },
});
