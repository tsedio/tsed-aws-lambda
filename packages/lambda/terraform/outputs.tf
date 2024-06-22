output "api_id" {
  description = "ID of the API Gateway"
  value       = aws_api_gateway_rest_api.api_gateway.id
}

output "api_url" {
  description = "URL of the API Gateway"
  value       = "${var.host}/restapis/${aws_api_gateway_rest_api.api_gateway.id}/${var.stage}/_user_request_"
}

output "api_host" {
  description = "Host of the API Gateway"
  value       = var.host
}
