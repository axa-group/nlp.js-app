# Dost

## Description

Server part for the DOST project

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Generate technical documentation

```
npm run docs
```

## Configuration

You can setup some backend options in your .env file

```
NODE_ENV=<Default: 'development' (optional)>
PORT=<Listening port. Default: 3000>
LOG_LEVEL=<Default value depends on NODE_ENV info or warn. (optional)>
DB_HOST=<Default: 'localhost' (optional)>
DB_PORT=<Default: 27017 (optional)>
DB_NAME=<Default: 'dost' (optional)>
JWT_SECRET_KEY=<Secret to generate tokens>
SALT_FACTOR_INT=<Default: 10 (optional)>
EXPIRY_TIME_SECONDS=<Token lifetime. Default: 300>
REFRESH_EXPIRY_TIME_SECONDS=<Refresh token lifetime. Default: 7200>
MODELS_PATH=<Default: '{dost-folder}/nlp-models'>
```

## Logging

We're using a custom logger located in modules/shared/services. It provides string interpolation using util.format. Example:

```
private readonly logger: LoggerService = new LoggerService(MyCurrentController.name);

...

this.logger.log('logging message! %j', items);
```

Output format:

```
[{date time in utc}]-{level} ({context}): {your message}
```

## Contributing

You can read the guide of how to contribute at [Contributing](https://github.com/axa-group/dost/blob/master/CONTRIBUTING.md).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](https://github.com/axa-group/dost/blob/master/CODE_OF_CONDUCT.md).

## Who is behind it?

This project is developed by AXA Shared Services Spain S.A.

If you need to contact us, you can do it at the email jesus.seijas@axa-groupsolutions.com

## License

Copyright (c) AXA Shared Services Spain S.A.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
