import boto3
import json
import sys
import getopt
import os
import sys
from botocore.exceptions import ClientError
import requests

# Create a user with a confirmed password in an existing Cognito user pool

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))

    print("Received event/ResourceProperties: " + json.dumps(event["ResourceProperties"], indent=2))

    str_username=str(event["ResourceProperties"]["Username"])
    str_user_pool_id=str(event["ResourceProperties"]["UserPoolId"])
    str_client_id=str(event["ResourceProperties"]["ClientId"])
    str_region=str(event["ResourceProperties"]["Region"])
    str_email=str(event["ResourceProperties"]["AdminEmail"])
    str_password=str(event["ResourceProperties"]["Password"])

    client = boto3.client("cognito-idp", region_name=str_region)

    print("Creating user '" + str_username + "' in pool '" + str_user_pool_id + "'... ")
    create_new_user(str_user_pool_id, str_username, str_email, client)

    print("Performing first sign-in flow to set password... ")
    first_sign_in(str_client_id, str_user_pool_id, str_username, str_password, client)

    send_response_cloudformation(event)
# lambda_handler()

def create_new_user(str_user_pool_id, str_username, str_email, client):

    create_new_user_response=client.admin_create_user(
        UserPoolId=str_user_pool_id,
        Username=str_username,
        TemporaryPassword="Password123@",
        DesiredDeliveryMediums=["EMAIL"],
        MessageAction="SUPPRESS",
        UserAttributes=[
            {
                "Name": "email",
                "Value": str_email
            }
        ]
    )

    print(create_new_user_response)

# create_new_user()

def first_sign_in(str_client_id, str_user_pool_id, str_username, str_password, client):
    first_signin_response=client.initiate_auth(
        AuthFlow="USER_PASSWORD_AUTH",
        AuthParameters={
            "USERNAME": str_username,
            "PASSWORD": "Password123@" # this is a temporary password that will be changed at first login
        },
        ClientId=str_client_id
    )

    print(first_signin_response)

    challenge_response=client.admin_respond_to_auth_challenge(
        UserPoolId=str_user_pool_id,
        ClientId=str_client_id,
        ChallengeName="NEW_PASSWORD_REQUIRED",
        ChallengeResponses={
            "USERNAME": str_username,
            "NEW_PASSWORD": str_password
        },
        Session=first_signin_response['Session']
    )

    print(json.dumps(challenge_response, indent=4))

# first_sign_in

def send_response_cloudformation(event):
    dict_response_signal = {}
    dict_response_signal["Status"] = "SUCCESS"
    dict_response_signal["PhysicalResourceId"] = "success" + str(event["RequestId"])
    dict_response_signal["StackId"] = event["StackId"]
    dict_response_signal["RequestId"] = event["RequestId"]
    dict_response_signal["LogicalResourceId"] = event["LogicalResourceId"]

    dict_response_signal["StackName"] = event["StackId"]
    dict_response_signal["UniqueId"] = event["StackId"]

    print("Sending SUCCESS signal back to Cloudformation... ")
    response = requests.put(event["ResponseURL"], data=json.dumps(dict_response_signal))
    print(" done.")



