import { Listr } from "listr2"

import { apply, deploy, init, plan } from "../clients/TerraformCli.js"

export interface RunTerraformOptions {
  cwd?: string
  contexts: { functionNames: string[] }[]
}

export async function runTerraform({ cwd, contexts }: RunTerraformOptions) {
  // get all changed functions
  const functionNames = contexts.flatMap(({ functionNames }) => functionNames, [])

  console.log("⚡️Running terraform for functions: ")

  await new Listr(
    [
      {
        title: "Initialize Terraform",
        task: () => init(cwd)
      },
      {
        title: "Terraform plan",
        task: () => plan(cwd)
      },
      {
        title: "Deploy all functions",
        task: (_, task) => {
          return process.env.CI !== "true"
            ? task.newListr(
                functionNames.map((functionName) => {
                  return {
                    title: `Deploy function ${functionName}`,
                    task: async () => deploy(functionName, cwd),
                    exitOnError: false
                  }
                }),
                {
                  concurrent: true,
                  rendererOptions: {
                    collapseSubtasks: true
                  }
                }
              )
            : apply(cwd)
        }
      }
    ],
    { concurrent: false }
  ).run()

  if (process.env.CI === "true") {
    console.log("🚀 Terraform deployment complete!")
  } else {
    console.log("🚀 Terraform deployment complete! Waiting changes to propagate...")
  }
}
