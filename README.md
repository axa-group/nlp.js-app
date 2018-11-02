<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/screenshots/nlplogo.gif" width="925" height="auto"/>
</div>

# NLP.js App

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Application to train your agents for bots, done using NLP.js.

27 languages supported: Arabic (ar), Armenian (hy), Basque (eu), Catala (ca), Chinese (zh), Czech (cs), Danish (da), Dutch (nl), English (en), Farsi (fa), Finnish (fi), French (fr), German (de), Hungarian (hu), Indonesian (id), Irish (ga), Italian (it), Japanese (ja), Norwegian (no), Portuguese (pt), Romanian (ro), Russian (ru), Slovene (sl), Spanish (es), Swedish (sv), Tamil (ta), Turkish (tr)

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/screenshots/demonlp.gif" width="auto" height="auto"/>
</div>

### TABLE OF CONTENTS

<!--ts-->

- [Installation](#installation)
- [Example of Use](#example-of-use)
- [Software Used](#software-used)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [Who is behind it](#who-is-behind-it)
- [License](#license.md)
  <!--te-->

## Installation

You have a one click installation for free in heroku, clicking the "deploy to heroku" button in this page. 
If you want to use it on-premise, follow this steps:

- MongoDB is needed
- NodeJS is needed
- Clone this repo
- Modify the .env at the root to point to your database (you have a .envexample you can use)
- Modify the .env at the client folder to point to the url and port of your backend
- Run ```npm start``` at the root folder
- Run ```npm start``` at the client folder

If you want to generate a production version, run ```npm run build``` at the client folder and copy the build contents to the public folder.

## Example of use

You can create an agent:

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/screenshots/create-agent.png" width="auto" height="auto"/>
</div>

Then create at least one domain:

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/screenshots/create-domain.png" width="auto" height="auto"/>
</div>

Create some entities if you need them:
<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/screenshots/create-entity.png" width="auto" height="auto"/>
</div>

Create some intents:
<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/screenshots/create-intent.png" width="auto" height="auto"/>
</div>

Train and test:
<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/screenshots/train.png" width="auto" height="auto"/>
</div>

## Software Used

This project is based on the Articulate Project from Samtec, that you can find here: https://github.com/samtecspg/articulate

## Contributing

You can read the guide of how to contribute at [Contributing](https://github.com/axa-group/nlp.js-app/blob/master/CONTRIBUTING.md).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](https://github.com/axa-group/nlp.js-app/blob/master/CODE_OF_CONDUCT.md).

## Who is behind it?

This project is developed by AXA Shared Services Spain S.A.

If you need to contact us, you can do it at the email jesus.seijas@axa.com

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
