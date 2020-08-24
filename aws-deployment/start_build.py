import boto3
import json
import requests
import cfnresponse
import botocore.vendored.requests as requests

# Create a user with a confirmed password in an existing Cognito user pool

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))

    print("Received event/ResourceProperties: " + json.dumps(event["ResourceProperties"], indent=2))

    try:
        if event['RequestType'] == 'Delete':
            print('Deleted!')
            cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
            return

        raise Exception
        print('It worked!')
        cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
    except Exception:
        print('Signaling failure to CloudFormation.')
        cfnresponse.send(event, context, cfnresponse.FAILED, {})

    str_project_name=str(event["ResourceProperties"]["ProjectName"])
    str_region=str(event["ResourceProperties"]["Region"])

    client = boto3.client("codebuild", region_name=str_region)

    response=client.start_build(
        projectName=str_project_name,
        environmentVariablesOverride=[
            {
                'name': 'abc',
                'value': 'abc',
                'type': 'PLAINTEXT'
             }
        ]
    )

    print(response)


    send_response_cloudformation(event)
# lambda_handler()


def send_response_cloudformation(event):
    dict_response_signal = {}
    dict_response_signal["Status"] = "SUCCESS"
    dict_response_signal["PhysicalResourceId"] = "success" + str(event["RequestId"])
    dict_response_signal["StackId"] = event["StackId"]
    dict_response_signal["RequestId"] = event["RequestId"]
    dict_response_signal["LogicalResourceId"] = event["LogicalResourceId"]

    dict_response_signal["StackName"] = event["StackId"]
    dict_response_signal["UniqueId"] = event["StackId"]

    print("Sending SUCCESS signal back to Cloudformation... ", end="")
    response = requests.put(event["ResponseURL"], data=json.dumps(dict_response_signal))
    print(" done.")


