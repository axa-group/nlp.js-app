# Serverless with AWS

## 1. Create the tables in DynamoDB

Go to the AWS Console and select DynamoDB

Click on create table and create a table called "agents". The Primary key should be "id" and type string, as in this picture:

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
