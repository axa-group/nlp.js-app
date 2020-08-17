#!python

import json
import boto3
import getopt
import sys

s3_client=boto3.client("s3")
s3_resource=boto3.resource("s3")
cfn_client=boto3.client("cloudformation")

def configure_swagger(str_new_basepath):
    str_swagger2_file = "client/swagger2.json"

    # adjust /client/swagger2.json with the API endpoint
    with open(str_swagger2_file, 'r') as swagger_file:
        dict_swagger_data=json.load(swagger_file)
        print("Current basePath in swagger2.json is: " + str(dict_swagger_data["basePath"]))
        dict_swagger_data["basePath"]=str_new_basepath

    with open(str_swagger2_file, 'w') as swagger_file:
        print("Writing new swagger2.json file with " + str_new_basepath + "...", end="")
        json.dump(dict_swagger_data, swagger_file)
        print(" done.")

    return

def usage():
    print("Syntax: configure_swagger.py --basepath=<basepath>")
    print()
    print("Where <basepath> is the path to invoke an API Gateway endpoint for the NLP.js server function.")
    print("All arguments are required.")

def main(argv):
    try:
        opts, args = getopt.getopt(argv, '', ["basepath="])
    except getopt.GetoptError as e:
        print(e.msg)
        usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt in ("--basepath"):
            str_new_basepath = arg
        else:
            usage()
        # if opt
    # for opt,arg

    configure_swagger(str_new_basepath)

main(sys.argv[1:])