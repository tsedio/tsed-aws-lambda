output "get_timeslots_arn" {
  value = aws_lambda_function.get_timeslots.arn
}

output "get_timeslots_invoke_arn" {
  value = aws_lambda_function.get_timeslots.invoke_arn
}

output "get_timeslots_name" {
  value = aws_lambda_function.get_timeslots.function_name
}

output "get_timeslot_by_id_arn" {
  value = aws_lambda_function.get_timeslot_by_id.arn
}

output "get_timeslot_by_id_invoke_arn" {
  value = aws_lambda_function.get_timeslot_by_id.invoke_arn
}

output "get_timeslot_by_id_name" {
  value = aws_lambda_function.get_timeslot_by_id.function_name
}
