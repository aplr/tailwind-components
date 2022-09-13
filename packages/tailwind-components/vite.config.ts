import { defineConfig, type UserConfig } from "vite"
import path from "path"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  build: {
    commonjsOptions: {
      esmExternals: false,
      ignoreGlobal: true,
      requireReturnsDefault: "namespace",
    },
    lib: {
      entry: path.resolve(__dirname, "src", "index.ts"),
      name: "tailwind-components",
      fileName: format => `tailwind-components.${format}.js`,
    },
    rollupOptions: {
      external: [/react/],
      output: {
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJsxRuntime",
        },
      },
    },
  },
})
