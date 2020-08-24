import boto3
import json
import requests

# Start a codebuild project and signal CLoudformation when it is complete

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))

    # Required variables to start the Codebuild project:
    # $USER_POOL_ID, $WEB_CLIENT_ID, $AWS_REGION, $BASEPATH, $ADMIN_USERNAME, $ADMIN_EMAIL, $ADMIN_PASSWORD, $TRAINING_APP_BUCKET

    print("Received event/ResourceProperties: " + json.dumps(event["ResourceProperties"], indent=2))
    str_user_pool_id=event["ResourceProperties"]["USER_POOL_ID"]
    str_web_client_id=event["ResourceProperties"]["WEB_CLIENT_ID"]
    str_aws_region=event["ResourceProperties"]["AWS_REGION"]
    str_basepath=event["ResourceProperties"]["BASEPATH"]
    str_admin_username=event["ResourceProperties"]["ADMIN_USERNAME"]
    str_training_app_bucket=event["ResourceProperties"]["TRAINING_APP_BUCKET"]
    str_project_name = str(event["ResourceProperties"]["PROJECT_NAME"])

    try:
        if event['RequestType'] == 'Delete':
            print('Deleted!')
            send_response_cloudformation(event, "SUCCESS")
            return

    except Exception:
        print('Signaling failure to Cloudformation.')
        send_response_cloudformation(event, "SUCCESS")

    client = boto3.client("codebuild", region_name=str_aws_region)

    response=client.start_build(
        projectName=str_project_name,

        environmentVariablesOverride=[
            {
                'name': 'USER_POOL_ID',
                'value': str_user_pool_id,
                'type': 'PLAINTEXT'
            },
            {
                'name': 'WEB_CLIENT_ID',
                'value': str_web_client_id,
                'type': 'PLAINTEXT'
            },
            {
                'name': 'AWS_REGION',
                'value': str_aws_region,
                'type': 'PLAINTEXT'
            },
            {
                'name': 'BASEPATH',
                'value': str_basepath,
                'type': 'PLAINTEXT'
            },
            {
                'name': 'ADMIN_USERNAME',
                'value': str_admin_username,
                'type': 'PLAINTEXT'
            },
            {
                'name': 'TRAINING_APP_BUCKET',
                'value': str_training_app_bucket,
                'type': 'PLAINTEXT'
            }
        ]
    )

    print(response)

    send_response_cloudformation(event, "SUCCESS")
# lambda_handler()


def send_response_cloudformation(event, str_response_signal):
    dict_response_signal = {}
    dict_response_signal["Status"] = str_response_signal
    dict_response_signal["PhysicalResourceId"] = "success" + str(event["RequestId"])
    dict_response_signal["StackId"] = event["StackId"]
    dict_response_signal["RequestId"] = event["RequestId"]
    dict_response_signal["LogicalResourceId"] = event["LogicalResourceId"]

    dict_response_signal["StackName"] = event["StackId"]
    dict_response_signal["UniqueId"] = event["StackId"]

    print("Sending SUCCESS signal back to Cloudformation... ", end="")
    response = requests.put(event["ResponseURL"], data=json.dumps(dict_response_signal))
    print(response)
    print(" done.")


