provider "aws" {
  access_key                  = var.access_key
  secret_key                  = var.secret_key
  region                      = var.region
  s3_use_path_style           = false
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    apigateway     = var.host
    apigatewayv2   = var.host
    cloudformation = var.host
    cloudwatch     = var.host
    cloudwatchlogs = var.host
    dynamodb       = var.host
    ec2            = var.host
    es             = var.host
    elasticache    = var.host
    firehose       = var.host
    iam            = var.host
    kinesis        = var.host
    lambda         = var.host
    rds            = var.host
    redshift       = var.host
    route53        = var.host
    s3             = "http://s3.localhost.localstack.cloud:4566"
    secretsmanager = var.host
    ses            = var.host
    sns            = var.host
    sqs            = var.host
    ssm            = var.host
    stepfunctions  = var.host
    sts            = var.host
  }
}
