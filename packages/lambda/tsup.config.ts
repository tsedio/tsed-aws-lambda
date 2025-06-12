// import eslintPluginTsc from "esbuild-plugin-tsc"
import { esbuildLambdaPlugin } from "@project/esbuild-lambda-plugin"
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
  swc: {
    "sourceMaps": "inline",
    "jsc": {
      "parser": {
        "syntax": "typescript",
        "tsx": true
      },
      "target": "es2022",
      "externalHelpers": true,
      "keepClassNames": true,
      "transform": {
        "useDefineForClassFields": false,
        "legacyDecorator": true,
        "decoratorMetadata": true,
        "react": {
          "pragma": "React.createElement",
          "pragmaFrag": "React.Fragment",
          "throwIfNamespace": true,
          "development": false,
          "useBuiltins": false,
          "runtime": "automatic"
        }
      }
    },
    "module": {
      "type": "es6"
    }
  },
  esbuildPlugins: [
    // eslintPluginTsc({
    //   tsconfigPath: path.join(process.cwd(), "tsconfig.json")
    // }),
    esbuildLambdaPlugin({
      deploy: process.argv.includes("--deploy") || !!options.watch,
      terraformDir: path.join(process.cwd(), "terraform")
    }) as never
  ]
}))
