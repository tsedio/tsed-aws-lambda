output "timeslots_arn" {
  value = aws_lambda_function.timeslots.arn
}

output "timeslots_invoke_arn" {
  value = aws_lambda_function.timeslots.invoke_arn
}

output "timeslots_name" {
  value = aws_lambda_function.timeslots.function_name
}
