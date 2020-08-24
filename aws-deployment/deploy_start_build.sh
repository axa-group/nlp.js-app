#!/bin/bash

zip -r start_build.zip venv3/lib/python3.7/site-packages/ start_build.py
aws s3 cp start_build.zip s3://dixonaws-solutions-us-west-2/nlpjs/v1.0/
aws s3 cp start_build.zip s3://dixonaws-solutions-eu-west-1/nlpjs/v1.0/