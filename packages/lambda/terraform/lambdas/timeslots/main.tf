
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = var.dist_dir
  output_path = "${var.dist_dir}/${var.zip_name}"
}

resource "aws_lambda_function" "get_timeslots" {
  function_name = "get_timeslots"
  handler       = "handler.getTimeslots"
  filename      = data.archive_file.lambda.output_path
  role          = var.role
  runtime       = var.lambda_runtime
  timeout       = 30

  environment {
    variables = {
      NODE_ENV = "development"
    }
  }
}

resource "aws_lambda_function" "get_timeslot_by_id" {
  function_name = "get_timeslot_by_id"
  handler       = "handler.getTimeslotById"
  filename      = data.archive_file.lambda.output_path
  role          = var.role
  runtime       = var.lambda_runtime
  timeout       = 30

  environment {
    variables = {
      NODE_ENV = "development"
    }
  }
}
