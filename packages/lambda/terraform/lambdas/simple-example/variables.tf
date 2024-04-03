variable "role" {
  default     = ""
  description = "the lambda role"
}

variable "lambda_runtime" {
  description = "The runtime to use for the lambda function"
  default     = "nodejs20.x"
}

variable "dist_dir" {
  default     = ""
  description = "Dist directory where the lambda function is located"
}

variable "zip_name" {
  default     = "handler.zip"
  description = "Name of the lambda zip"
}
