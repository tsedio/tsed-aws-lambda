import type { PluginBuild } from "esbuild";

import { buildHandler, EsbuildLambdaPluginOptions } from "./utils/buildHandler.js";

export function esbuildLambdaPlugin(opts: EsbuildLambdaPluginOptions = {}) {
  return {
    name: "esbuild-lambda-plugin",
    setup(build: PluginBuild) {
      build.onStart(() => {
        const warnings = [];

        if (build.initialOptions.minifyIdentifiers) {
          warnings.push({
            text: `'minifyIdentifiers' is set to true but was forced to false.\n  It would break functions as the handler function would be renamed.`
          });
        }

        if (build.initialOptions.format && build.initialOptions.format !== "esm") {
          warnings.push({
            text: `'format' is set to ${build.initialOptions.format} but was forced to 'esm'.\n  'esm' produces the smallest files while still working.`
          });
        }

        return {
          warnings
        };
      });

      build.onEnd(async (result) => {
        if (result.metafile) {
          Object.entries(result.metafile.outputs)
            .filter(([key]) => key.endsWith(".js"))
            .forEach(([output, options]) => {
              buildHandler(output, {
                build: build.initialOptions,
                lambda: opts || {},
                meta: options
              });
            });
        }

        // run localstack to upload the lambda function
        // console.log("Build finished. Uploading to localstack...");
      });

      build.initialOptions.format = "esm";
      build.initialOptions.inject = [`@project/esbuild-lambda-plugin/cjsShim.js`];
      // If identifiers are minified `handler` will be, and will break the function
      build.initialOptions.minifyIdentifiers = false;

      if (build.initialOptions.minify) {
        build.initialOptions.minify = false;
        build.initialOptions.minifyWhitespace = true;
        build.initialOptions.minifySyntax = true;
      }
    }
  };
}
