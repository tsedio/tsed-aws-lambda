
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = var.dist_dir
  output_path = "${var.dist_dir}/${var.zip_name}"
}

resource "aws_lambda_function" "authorizer" {
  function_name = "authorizer"
  handler       = "handler.authorizer"
  filename      = data.archive_file.lambda.output_path
  role          = var.role
  runtime       = var.runtime
  timeout       = 30

  environment {
    variables = {
      NODE_ENV = "development"
    }
  }
}
