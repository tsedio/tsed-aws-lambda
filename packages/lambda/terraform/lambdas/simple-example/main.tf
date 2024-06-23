
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = var.dist_dir
  output_path = "${var.dist_dir}/${var.zip_name}"
}


resource "aws_lambda_function" "handler" {
  function_name = "handler"
  filename      = data.archive_file.lambda.output_path
  role          = var.role
  handler       = "handler.handler"
  runtime       = var.runtime
  timeout       = 30

  environment {
    variables = {
      NODE_ENV = "development"
    }
  }
}

