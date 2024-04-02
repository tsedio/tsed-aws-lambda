<p style="text-align: center" align="center">
  <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
  <h1>Ts.ED - tsed-aws-lambda</h1>
  <br />
  <div align="center">
    <a href="https://cli.tsed.io/">Website</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://cli.tsed.io/getting-started.html">Getting started</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://twitter.com/TsED_io">Twitter</a>
  </div>
  <hr />
</div>

> An awesome project based on Ts.ED framework

## Features

- Yarn 4 workspaces
- AWS Lambda
- Terraform
- Ts.ED - Serverless and Fullstack framework

## Getting started

This project requires some tools to be installed on your machine. Here is a list of the tools you need to install:

- [AWS CLI](https://docs.aws.amazon.com/fr_fr/cli/latest/userguide/getting-started-install.html)
- [Localstack CLI](https://docs.localstack.cloud/getting-started/installation/#localstack-cli)
- [Terraform CLI](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

## Installation

```batch
# install dependencies
$ yarn install
```

## Development

### Lambda

This command start the lambda function locally.

```batch
$ yarn start:lambda
```

> - It builds all lambda and create Zip file in the `dist` folder.
> - It deploys the lambda function on localstack (on start and on file change)

### Full Express.js server

Start full Express.js server:

```batch
# start web server
$ yarn start:www
```

### Generate Swagger API documentation

```batch
$ yarn build:swagger
```

This command use the `packages/www` to generate documentation

### Run tests

To run all tests over the workspace:

```batch
$ yarn test
```

To run tests for a specific package:

```batch
$ yarn test:lambda
$ yarn test:controllers
```

### Run E2E tests (dev)

To run E2E tests:

```batch
yarn start:lambda
yarn test:e2e
```

### Deployment

Use terraform to deploy the lambda function on AWS.

```batch
TBD
```
