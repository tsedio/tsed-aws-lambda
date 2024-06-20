variable "region" {
  description = "The region to deploy the lambda function"
  default     = "us-east-1"
}

variable "stage" {
  description = "The stage application"
  default     = "test"
}

variable "access_key" {
  description = "The access key to use for the lambda function"
  default     = "fake"
}

variable "secret_key" {
  description = "The access key to use for the lambda function"
  default     = "fake"
}

variable "lambda_runtime" {
  description = "The runtime to use for the lambda function"
  default     = "nodejs20.x"
}

variable "api_gateway_url" {
  description = "Api Gateway URL"
  default     = "http://localhost:4566"
}

variable "lambda_url" {
  description = "Lambda URL"
  default     = "http://localhost:4566"
}

variable "iam_url" {
  description = "IAM url"
  default     = "http://localhost:4566"
}

variable "logs_url" {
  description = "Logs url"
  default     = "http://localhost:4566"
}
