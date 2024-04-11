import { esbuildLambdaPlugin } from "@project/esbuild-lambda-plugin"
import eslintPluginTsc from "esbuild-plugin-tsc"
import * as path from "path"
import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  entry: ["src/**/handler.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false, //!options.watch,
  platform: "node",
  target: "node20",
  external: ["aws-sdk"],
  bundle: true,
  noExternal: [/.*/],
  keepNames: true,
  shims: true,
  format: "esm",
  incremental: options.watch,
  mainFields: ["source", "main"],
  esbuildPlugins: [
    eslintPluginTsc({
      tsconfigPath: path.join(process.cwd(), "tsconfig.node.json")
    }),
    esbuildLambdaPlugin({
      deploy: process.argv.includes("--deploy") || !!options.watch,
      terraformDir: path.join(process.cwd(), "terraform")
    })
  ]
}))
