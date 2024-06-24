module "lambda_simple_example" {
  providers = {
    aws = aws
  }
  source   = "./lambdas/simple-example"
  role     = aws_iam_role.iam_for_lambda_tf.arn
  runtime  = var.lambda_runtime
  dist_dir = "${path.root}/../dist/simple-example"
  env_vars = var.env_vars
}

module "lambda_timeslots" {
  providers = {
    aws = aws
  }
  source   = "./lambdas/timeslots"
  role     = aws_iam_role.iam_for_lambda_tf.arn
  runtime  = var.lambda_runtime
  dist_dir = "${path.root}/../dist/timeslots"
  env_vars = merge(var.env_vars, {
    AWS_REGION               = var.region
    DYNAMODB_TIMESLOTS_TABLE = aws_dynamodb_table.timeslots_table.name
  })
}

module "lambda_auth" {
  providers = {
    aws = aws
  }
  source   = "./lambdas/auth"
  role     = aws_iam_role.iam_for_lambda_tf.arn
  runtime  = var.lambda_runtime
  dist_dir = "${path.root}/../dist/auth"
  env_vars = var.env_vars
}
