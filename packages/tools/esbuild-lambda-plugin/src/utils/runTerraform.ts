import { execa } from "execa";
import { Listr } from "listr2";

function deploy(functionName: string) {
  return execa("terraform", ["apply", "-lock=false", "-auto-approve", `-replace=aws_lambda_function.${functionName}`], {
    cwd: process.cwd()
  });
}

function plan() {
  return execa("terraform", ["plan"], {
    cwd: process.cwd()
  });
}

function apply() {
  return execa("terraform", ["apply", "-auto-approve"], {
    cwd: process.cwd()
  });
}

function init() {
  return execa("terraform", ["init"], {
    cwd: process.cwd()
  });
}

export async function runTerraform(options: { functionNames: string[] }[]) {
  // get all changed functions
  const functionNames = options.flatMap(({ functionNames }) => functionNames, []);

  console.log("⚡️Running terraform for functions: ");

  await new Listr(
    [
      {
        title: "Initialize Terraform",
        task: () => init()
      },
      {
        title: "Terraform plan",
        task: () => plan()
      },
      {
        title: "Deploy all functions",
        task: (ctx, task) => {
          return process.env.CI !== "true"
            ? task.newListr(
                functionNames.map((functionName) => {
                  return {
                    title: `Deploy function ${functionName}`,
                    task: async () => deploy(functionName),
                    exitOnError: false
                  };
                }),
                {
                  concurrent: true,
                  rendererOptions: {
                    collapseSubtasks: true
                  }
                }
              )
            : apply();
        }
      }
    ],
    { concurrent: false }
  ).run();

  if (process.env.CI === "true") {
    console.log("🚀 Terraform deployment complete!");
  } else {
    console.log("🚀 Terraform deployment complete! Waiting changes to propagate...");
  }
}
