import path from "node:path"

import fs from "fs-extra"
import { Listr } from "listr2"

import { apply, init, plan } from "../clients/TerraformCli.js"

export interface RunTerraformOptions {
  cwd?: string
  contexts: { functionNames: string[] }[]
}

export async function runTerraform({ cwd }: RunTerraformOptions) {
  // get all changed functions
  console.log("⚡️Running terraform for functions: ")

  await new Listr(
    [
      {
        title: "Terraform init",
        skip: fs.existsSync(path.join(cwd!, "terraform.tfstate")),
        task: () => init(cwd)
      },
      {
        title: "Terraform plan",
        task: () => plan(cwd)
      },
      {
        title: "Terraform apply",
        task: () => apply(cwd)
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
