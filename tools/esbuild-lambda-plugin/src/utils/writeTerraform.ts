// import { writeFile } from "node:fs/promises";
// import path from "node:path";
//
// import { snakeCase } from "change-case";
// import { execa } from "execa";
//
// import { BuildHandlerContext } from "./buildHandler.js";
//
// /**
//  * @param context {object}
//  * @param context.lambda {object}
//  * @param context.build {object}
//  * @param context.name {string}
//  * @param context.zipPath {string}
//  * @param context.srcDir {string}
//  * @param context.entryPoint {string}
//  * @param context.exports {string[]}
//  * @return {Promise<void>}
//  */
// export async function writeTerraform(context: BuildHandlerContext) {
//   const {
//     name,
//     build: { target },
//     lambda: { role = "fakeRole", runtime, timeout = 30, additionalProps = {} },
//     exports = []
//   } = context;
//
//   const content = exports
//     .map((functionName) => {
//       const formattedName = snakeCase(functionName);
//
//       const opts = {
//         ...additionalProps,
//         function_name: formattedName,
//         filename: path.relative(context.srcDir, context.zipPath),
//         role,
//         handler: `${name}.${functionName}`,
//         runtime: runtime || target,
//         timeout
//       };
//
//       const values = Object.entries(opts)
//         .map(([key, value]) => `  ${key} = ${JSON.stringify(value)}`)
//         .join("\n");
//
//       return `resource  "aws_lambda_function" "${formattedName}" {\n${values}\n}\n`;
//     })
//     .join("\n");
//
//   await writeFile(path.join(context.srcDir, `${name}.tf`), content, "utf-8");
//
//   await execa("terraform", ["fmt"], { cwd: context.srcDir });
// }
