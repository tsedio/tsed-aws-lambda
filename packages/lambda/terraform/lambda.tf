provider "aws" {
  region                      = var.region
  access_key                  = var.access_key
  secret_key                  = var.access_key
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    apigateway = var.api_gateway_url
    lambda     = var.lambda_url
    iam        = var.iam_url
    logs       = var.logs_url
  }
}

module "lambda_simple_example" {
  providers = {
    aws = aws
  }
  source   = "./lambdas/simple-example"
  role     = aws_iam_role.iam_for_lambda_tf.arn
  runtime  = var.lambda_runtime
  dist_dir = "${path.root}/../dist/simple-example"
}

module "lambda_timeslots" {
  providers = {
    aws = aws
  }
  source   = "./lambdas/timeslots"
  role     = aws_iam_role.iam_for_lambda_tf.arn
  runtime  = var.lambda_runtime
  dist_dir = "${path.root}/../dist/timeslots"
}

module "lambda_auth" {
  providers = {
    aws = aws
  }
  source   = "./lambdas/auth"
  role     = aws_iam_role.iam_for_lambda_tf.arn
  runtime  = var.lambda_runtime
  dist_dir = "${path.root}/../dist/auth"
}
