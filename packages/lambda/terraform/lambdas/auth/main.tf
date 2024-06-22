
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = var.dist_dir
  output_path = "${var.dist_dir}/${var.zip_name}"
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/authorizer"
  retention_in_days = 7
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_lambda_function" "authorizer" {
  function_name    = "authorizer"
  handler          = "handler.authorizer"
  filename         = data.archive_file.lambda.output_path
  role             = var.role
  runtime          = var.runtime
  timeout          = 30
  depends_on       = [aws_cloudwatch_log_group.lambda_log_group]
  source_code_hash = filebase64sha256(data.archive_file.lambda.output_path)

  environment {
    variables = var.env_vars
  }
}
