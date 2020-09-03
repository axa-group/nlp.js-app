#!/bin/bash

rm -Rvf package
mkdir package
pip install -r requirements.txt --target package
cd package
zip -r9 ../start_build.zip .
cd ..
zip -r9 start_build.zip start_build.py
zip -r9 start_build.zip requirements.txt
rm -Rvf package

aws s3 cp start_build.zip s3://dixonaws-solutions-us-east-1/nlpjs/v1.0/
aws s3 cp start_build.zip s3://dixonaws-solutions-us-west-2/nlpjs/v1.0/
aws s3 cp start_build.zip s3://dixonaws-solutions-eu-west-1/nlpjs/v1.0/