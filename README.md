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
> - It deploys the lambda function on localstack (on start and on file change) (TODO)

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

```batch
$ yarn test
```

### Deployment

Use terraform to deploy the lambda function on AWS.

```batch
TBD
```

## Contributors

Please read [contributing guidelines here](./CONTRIBUTING.md).

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2024 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
