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

module "lambda_simple_example" {
  providers = {
    aws = aws
  }
  source         = "./lambdas/simple-example"
  role           = aws_iam_role.iam_for_lambda_tf.arn
  lambda_runtime = var.lambda_runtime
  dist_dir       = "${path.root}/../dist/simple-example"
}

module "timeslots" {
  providers = {
    aws = aws
  }
  source         = "./lambdas/timeslots"
  role           = aws_iam_role.iam_for_lambda_tf.arn
  lambda_runtime = var.lambda_runtime
  dist_dir       = "${path.root}/../dist/timeslots"
}


