variable "region" {
  type        = string
  description = "The region to deploy the lambda function"
  default     = "us-east-1"
}

variable "stage" {
  type        = string
  description = "The stage application"
  default     = "test"
}

variable "access_key" {
  type        = string
  description = "The access key to use for the lambda function"
  default     = "fake"
}

variable "secret_key" {
  type        = string
  description = "The access key to use for the lambda function"
  default     = "fake"
}

variable "lambda_runtime" {
  type        = string
  description = "The runtime to use for the lambda function"
  default     = "nodejs20.x"
}

variable "host" {
  type        = string
  description = "Domain"
  default     = "http://localhost:4566"
}

variable "env_vars" {
  type        = any
  description = "The environment variables to use for the lambda function"
  default = {
    NODE_ENV     = "development"
    JWT_SECRET   = "zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI"
    JWT_ISSUER   = "http://localhost:4566"
    JWT_AUDIENCE = "urn:aud:developer"
  }
}
