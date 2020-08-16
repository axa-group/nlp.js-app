import json
import boto3
import getopt
import sys

s3_client=boto3.client("s3")
s3_resource=boto3.resource("s3")
cfn_client=boto3.client("cloudformation")

def configure_aws_exports(str_new_user_pool_id, str_new_client_id, str_new_region):
    dict_awsmobile={}
    dict_awsmobile_oauth={}
    lst_awsmobile_oauth_scopes=[]
    lst_awsmobile_oauth_scopes.append("phone")
    lst_awsmobile_oauth_scopes.append("email")
    lst_awsmobile_oauth_scopes.append("openid")
    lst_awsmobile_oauth_scopes.append("profile")
    lst_awsmobile_oauth_scopes.append("aws.cognito.signin.user.admin")

    dict_awsmobile["aws_project_region"]=str_new_region
    dict_awsmobile["aws_cognito_region"]=str_new_region
    dict_awsmobile["aws_user_pools_id"]=str_new_user_pool_id
    dict_awsmobile["aws_user_pools_web_client_id"]=str_new_client_id
    dict_awsmobile["federationTarget"]="COGNITO_USER_POOLS"

    dict_awsmobile_oauth["domain"]="nlpjs.auth." + str_new_region + ".amazoncognito.com"
    dict_awsmobile_oauth["redirectSignIn"]="http://localhost/auth.html/"
    dict_awsmobile_oauth["redirectSignOut"] = "http://localhost/signout.html/"
    dict_awsmobile_oauth["responseType"] = "code"
    dict_awsmobile_oauth["scope"] = lst_awsmobile_oauth_scopes

    dict_awsmobile["oauth"]=dict_awsmobile_oauth

    ###

    str_aws_exports_file = "client/app/aws-exports.js"

    with open(str_aws_exports_file, 'w') as aws_exports_file:
        print("Writing new aws-exports.js file with " + str_new_user_pool_id + " and " + str_new_client_id + "...", end="")

        str_aws_exports="/* eslint - disable */"
        str_aws_exports+="\n"
        str_aws_exports+="const awsmobile=" + json.dumps(dict_awsmobile, indent=4)
        str_aws_exports+=";"
        str_aws_exports+="\n"

        str_aws_exports+="export default awsmobile;"

        print(str_aws_exports)

        aws_exports_file.write(str_aws_exports)
        aws_exports_file.flush()

        print(" done.")

    return

def usage():
    print("Syntax: configure_aws_exports.py --user_pool_id=<basepath> --client_id=<client_id> --region=<aws_region>")
    print()
    print("Where <user_pool_id and <client_id> are from your Cognito User Pool and <region> is your AWS region.")
    print("All arguments are required.")

def main(argv):
    try:
        opts, args = getopt.getopt(argv, '', ["user_pool_id=", "client_id=", "region="])
    except getopt.GetoptError as e:
        print(e.msg)
        usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt in ("--user_pool_id"):
            str_new_user_pool_id = arg
        elif opt in ("--client_id"):
            str_new_client_id = arg
        elif opt in ("--region"):
            str_new_region = arg
        else:
            usage()
        # if opt
    # for opt,arg

    configure_aws_exports(str_new_user_pool_id, str_new_client_id, str_new_region)

main(sys.argv[1:])


