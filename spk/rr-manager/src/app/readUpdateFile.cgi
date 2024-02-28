#!/usr/bin/python

import os
import json
import sys
import zipfile

from pathlib import Path
path_root = Path(__file__).parents[1]
sys.path.append(str(path_root)+'/libs')

import libs.yaml as yaml

# Function to print the error and exit, simulating a 400 response
def print_error_and_exit(message):
    print("Status: 400 Bad Request")  # Attempt to set status, server might not honor this
    print("Content-type: application/json\n")
    response = {'error': message, 'success': False}
    print(json.dumps(response))
    sys.exit(1)  # Exiting with a non-zero status code

# Authenticate the user
f = os.popen('/usr/syno/synoman/webman/modules/authenticate.cgi', 'r')
user = f.read().strip()
FILE_NAME = "/tmp/update.zip"
response = {}

if len(user) == 0:
    print_error_and_exit("not authenticated")

try:
    with zipfile.ZipFile(FILE_NAME, mode="r") as zif:
        for lines in zif.read("RR_VERSION").split(b"\r\n"):
            response['updateVersion'] = lines.strip().decode('utf-8')
            response['success'] = True
except FileNotFoundError:
    print_error_and_exit(f'File {FILE_NAME} not found.')

# If the script reaches this point, print the success header and response
print("Content-type: application/json\n")
print(json.dumps(response))
