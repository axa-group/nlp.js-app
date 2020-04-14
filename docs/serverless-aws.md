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
$ git checkout feature/serverless-lambda
$ npm install
```

This will download all the code and install the dependencies
<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/clone01.png" width="925" height="auto"/>
</div>
<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/clone02.png" width="925" height="auto"/>
</div>
<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/clone03.png" width="925" height="auto"/>
</div>



# 3. Configure AWS

You'll need to configure your AWS credentials. As this software is based on serverless, you can follow the documentation of serverless:
https://serverless.com/framework/docs/providers/aws/guide/credentials/

# 4. Deploy the lambda functions and API Gateway

Inside your source code folder, run this:

```bash
$ npx serverless deploy
```

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/deploy01.png" width="925" height="auto"/>
</div>


This will deploy your backend at serverless and configure your API Gateway
At the end of the process, it will returns in console the URL of your API
If you go to your AWS console and there you select your lambda, you'll se something like this:
<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/deploy02.png" width="925" height="auto"/>
</div>

At the end of the process you'll get the URL for your training app! Note it.

# 5. Give permissions from the lambda to the dynamo db

Follow the instructions located at: https://aws.amazon.com/es/blogs/security/how-to-create-an-aws-iam-policy-to-grant-aws-lambda-access-to-an-amazon-dynamodb-table/

Or follow this instructions:

Open the IAM console and click on Policies, and then Create Policy

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/policy01.png" width="925" height="auto"/>
</div>

Click on "Choose a Service"

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/policy02.png" width="925" height="auto"/>
</div>

Select DynamoDB, and click on all DynamoDB actions

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/policy03.png" width="925" height="auto"/>
</div>

Select the specific resources that you want your lambda to have access in dynamoDB

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/policy04.png" width="925" height="auto"/>
</div>

Put a name for your policy and finally click on create policy.

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/policy05.png" width="925" height="auto"/>
</div>

Go back to your lambda and click on Permissions and the role name of the lambda

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/policy06.png" width="925" height="auto"/>
</div>

Click on Attach policies

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/policy07.png" width="925" height="auto"/>
</div>

Select your policy and click on Attach Policy

<div align="center">
<img src="https://github.com/axa-group/nlp.js-app/raw/master/docs/screenshots/policy08.png" width="925" height="auto"/>
</div>

# 6. Navigate to your training app

Now you can navigate to your training app, using the URL from 4 or retrieving it from your API Gateway information





