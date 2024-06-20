resource "aws_api_gateway_rest_api" "api_gateway" {
  name        = "APIGateway"
  description = "API Gateway for Lambda"
}

resource "aws_api_gateway_authorizer" "lambda_authorizer" {
  rest_api_id     = aws_api_gateway_rest_api.api_gateway.id
  name            = "LambdaAuthorizer"
  type            = "TOKEN"
  authorizer_uri  = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${module.lambda_auth.arn}/invocations"
  identity_source = "method.request.header.Authorization"
}

resource "aws_lambda_permission" "authorizer_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_auth.name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api_gateway.execution_arn}/authorizers/${aws_api_gateway_authorizer.lambda_authorizer.id}"
}

// API
// API - Resources
resource "aws_api_gateway_resource" "timeslots_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
  path_part   = "timeslots"
}

resource "aws_api_gateway_resource" "timeslots_id_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  parent_id   = aws_api_gateway_resource.timeslots_resource.id
  path_part   = "{id}"
}

// API - Methods
resource "aws_api_gateway_method" "get_timeslots_method" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  resource_id   = aws_api_gateway_resource.timeslots_resource.id
  http_method   = "GET"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.lambda_authorizer.id
}

resource "aws_api_gateway_method" "get_timeslots_by_id_method" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  resource_id   = aws_api_gateway_resource.timeslots_id_resource.id
  http_method   = "GET"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.lambda_authorizer.id
}

// API - Permissions
resource "aws_lambda_permission" "api_gateway_permission_get_timeslot_by_id" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_timeslots.get_timeslot_by_id_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api_gateway.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gateway_permission_get_timeslots" {
  statement_id  = "AllowAPIGatewayInvokeGetTimeslots"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_timeslots.get_timeslots_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api_gateway.execution_arn}/*/*"
}

// API - Integrations
resource "aws_api_gateway_integration" "get_timeslots_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api_gateway.id
  resource_id             = aws_api_gateway_resource.timeslots_resource.id
  http_method             = aws_api_gateway_method.get_timeslots_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${module.lambda_timeslots.get_timeslots_arn}/invocations"
}

resource "aws_api_gateway_integration" "get_timeslots_by_id_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api_gateway.id
  resource_id             = aws_api_gateway_resource.timeslots_id_resource.id
  http_method             = aws_api_gateway_method.get_timeslots_by_id_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${module.lambda_timeslots.get_timeslot_by_id_arn}/invocations"
}

// API - deployment
resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.get_timeslots_by_id_integration,
    aws_api_gateway_integration.get_timeslots_integration
  ]

  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  stage_name  = var.stage
}
