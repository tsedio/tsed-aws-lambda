import path from "node:path"

import { snakeCase } from "change-case"
import type { BuildOptions, ImportKind } from "esbuild"

import { writePackageJson } from "./writePackageJson.js"

export interface EsbuildLambdaPluginOptions {
  delay?: number
}

export interface BuildHandlerOptions {
  lambda: EsbuildLambdaPluginOptions
  build: BuildOptions
  meta: {
    bytes: number
    inputs: {
      [path: string]: {
        bytesInOutput: number
      }
    }
    imports: {
      path: string
      kind: ImportKind | "file-loader"
      external?: boolean
    }[]
    exports: string[]
    entryPoint?: string
    cssBundle?: string
  }
}

export interface BuildHandlerContext {
  name: string
  filePath: string
  zipPath: string
  outDir: string
  srcDir: string
  entrypoint: string
  exports: string[]
  build: BuildOptions
  lambda: EsbuildLambdaPluginOptions
}

export async function buildHandler(file: string, options: BuildHandlerOptions) {
  if (options.meta.entryPoint) {
    const name = path.basename(file, ".js")
    const dir = path.join(process.cwd(), path.dirname(file))
    const zipPath = path.join(dir, `${name}.zip`)
    const srcDir = path.dirname(options.meta.entryPoint!)

    const context: BuildHandlerContext = {
      name,
      filePath: file,
      zipPath,
      outDir: dir,
      srcDir,
      entrypoint: options.meta.entryPoint,
      exports: options.meta.exports,
      build: options.build,
      lambda: options.lambda
    }

    await writePackageJson(context)

    return {
      functionNames: options.meta.exports.map((func) => {
        return snakeCase(func)
      }),
      context
    }
  }
}
