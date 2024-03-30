// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "lwx",
      formats: ["es", "umd"],
      fileName: (format) => `lwx.${format}.js`,
    },
  },
});
