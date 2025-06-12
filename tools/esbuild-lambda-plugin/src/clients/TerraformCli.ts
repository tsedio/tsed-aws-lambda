import { execa } from "execa"

export function deploy(functionName: string, cwd = process.cwd()) {
  return execa("terraform", ["apply", "-lock=false", "-auto-approve", `-replace=aws_lambda_function.${functionName}`], {
    cwd
  })
}

export function plan(cwd = process.cwd()) {
  return execa("terraform", ["plan"], {
    cwd
  })
}

export function apply(cwd = process.cwd()) {
  return execa("terraform", ["apply", "-auto-approve"], {
    cwd
  })
}

export function init(cwd = process.cwd()) {
  return execa("terraform", ["init"], {
    cwd
  })
}
