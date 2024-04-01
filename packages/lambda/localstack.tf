provider "aws" {
  region                      = "eu-west-3"
  access_key                  = "fake"
  secret_key                  = "fake"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    apigateway = "http://localhost:4566"
    lambda     = "http://localhost:4566"
    iam        = "http://localhost:4566"
  }
}

resource "aws_iam_role" "iam_for_lambda_tf" {
  name = "iam_for_lambda_tf"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "get_timeslots" {
  function_name = "get_timeslots"
  filename      = "dist/timeslots/handler.zip"
  role          = aws_iam_role.iam_for_lambda_tf.arn
  handler       = "handler.getTimeslots"
  runtime       = "nodejs20.x"
  timeout       = 30

  environment {
    variables = {
      NODE_ENV = "development"
    }
  }
}

resource "aws_lambda_function" "get_timeslot_by_id" {
  function_name = "get_timeslot_by_id"
  filename      = "dist/timeslots/handler.zip"
  role          = aws_iam_role.iam_for_lambda_tf.arn
  handler       = "handler.getTimeslotById"
  runtime       = "nodejs20.x"
  timeout       = 30

  environment {
    variables = {
      NODE_ENV = "development"
    }
  }
}

resource "aws_lambda_function" "handler" {
  function_name = "handler"
  filename      = "dist/simple-example/handler.zip"
  role          = aws_iam_role.iam_for_lambda_tf.arn
  handler       = "handler.handler"
  runtime       = "nodejs20.x"
  timeout       = 30

  environment {
    variables = {
      NODE_ENV = "development"
    }
  }
}

