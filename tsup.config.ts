// noinspection JSUnusedGlobalSymbols

import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["index.ts", "src/**/*.ts"],
  splitting: false,
  bundle: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  format: "esm",
  dts: true,
  platform: "node",
})
