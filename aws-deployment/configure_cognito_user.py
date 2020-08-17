#!python

import boto3
import json
import sys
import getopt

# Create a user with a confirmed password in an existing Cognito user pool

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

def first_sign_in(str_client_id, str_user_pool_id, str_username, client):
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
            "NEW_PASSWORD": "Password123#"
        },
        Session=first_signin_response['Session']
    )

    print(json.dumps(challenge_response, indent=4))

# first_sign_in

def usage():
    print("Syntax: configure_cognito_user.py --username=<username> --pool-id=<user pool id> --client-id=<app client id> --email=user@domain --region=aws-region-code")
    print("All variables are required.")
def main(argv):


# todo: accept desired password as input
    try:
        opts, args=getopt.getopt(argv, '', ["username=", "pool-id=", "client-id=", "region=", "email="])
    except getopt.GetoptError as e:
        print(e.msg)
        usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt in ("-u", "--username"):
            str_username=arg
        elif opt in ("-p", "--pool-id"):
            str_user_pool_id=arg
        elif opt in ("-c", "--client-id"):
            str_client_id=arg
        elif opt in ("-r", "--region"):
            str_region=arg
        elif opt in ("-e", "--email"):
            str_email=arg
        else:
            usage()
        # if opt
    # for opt,arg

    print("create_user")
    print("-----------")
    try:
        print('username: ' + str_username)
        print('user pool id: ' + str_user_pool_id)
        print('app client id: ' + str_client_id)
        print('email: ' + str_email)
        print('region: ' + str_region)
    except UnboundLocalError:
        usage()
        sys.exit(2)

    client = boto3.client("cognito-idp", region_name=str_region)

    print("Creating user '" + str_username + "' in pool '" + str_user_pool_id + "'... ")
    create_new_user(str_user_pool_id, str_username, str_email, client)

    print("Performing first sign-in flow to set password... ")
    first_sign_in(str_client_id, str_user_pool_id, str_username, client)

# main()

main(sys.argv[1:])

