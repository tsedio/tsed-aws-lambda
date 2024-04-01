# Lambda

This package contains the lambda function that is used to process the incoming data from the IoT devices.

## Installation

Install AWS CLI:

https://docs.aws.amazon.com/fr_fr/cli/latest/userguide/getting-started-install.html

Install the localstack CLI:

```sh
brew install localstack/tap/localstack-cli
```

> See more detail for all operating system: https://docs.localstack.cloud/getting-started/installation/#localstack-cli

Install the terraform CLI:

```sh
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -help
```

> See more detail for all operating
> system: https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli

## Start the localstack

```sh
docker compose up
```

Then check if the localstack configuration is correct:

```sh
localstack config validate
```

### Start the lambda function

This package provide a command to start the lambda function locally.
It builds all lambda and create Zip file in the `dist` folder.

```sh
yarn watch
```

### Build the lambda function

```sh
yarn build
```

### Deploy the lambda function on localstack (manually)

```sh
terraform init
terraform plan
terraform apply
```

Force the lambda function to be deployed on localstack:

```sh
terraform apply -auto-approve -replace="aws_lambda_function.get_timeslots"
```

### Invoke the lambda function

```sh
aws --endpoint-url=http://localhost:4566 lambda invoke --function-name get_timeslots output.json
```
