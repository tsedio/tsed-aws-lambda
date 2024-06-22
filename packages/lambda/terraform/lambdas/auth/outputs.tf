output "arn" {
  value = aws_lambda_function.authorizer.arn
}

output "name" {
  value = aws_lambda_function.authorizer.function_name
}

output "invoke_arn" {
  value = aws_lambda_function.authorizer.invoke_arn
}
