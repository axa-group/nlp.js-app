# Serverless with AWS

## 1. Create the tables in DynamoDB

Go to the AWS Console and select DynamoDB

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/dynamo01.png" width="925" height="auto"/>
</div>


Click on create table and create a table called "agents". The Primary key should be "id" and type string, as in this picture:

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/dynamo02.png" width="925" height="auto"/>
</div>


Repeat the process for all the tables:
- agents
- domains
- entitys
- intents
- scenarios
- sessions
- settings
- trainings

When you finish you will have all the tables created like this:

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/dynamo03.png" width="925" height="auto"/>
</div>

# 2. Clone this repo and install dependencies

Execute this in a folder where you want to work:

```bash
$ git clone https://github.com/axa-group/nlp.js-app.git
$ cd nlp.js-app
$ git checkout feature/serverless
$ npm install
```

This will download all the code and install the dependencies
