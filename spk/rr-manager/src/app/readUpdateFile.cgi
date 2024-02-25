#!/usr/bin/python

import os
import json
import sys
import zipfile

from pathlib import Path
path_root = Path(__file__).parents[1]
sys.path.append(str(path_root)+'/libs')

import libs.yaml as yaml
print("Content-type: application/json\n")


# Authenticate the user
f = os.popen('/usr/syno/synoman/webman/modules/authenticate.cgi', 'r')
user = f.read().strip()
FILE_NAME= "/tmp/update.zip"
response = {}

if len(user) > 0:
    with zipfile.ZipFile(FILE_NAME, mode="r") as zif:
        for lines in zif.read("RR_VERSION").split(b"\r\n"):
            response['updateVersion'] = lines.strip().decode('utf-8')
            response['success'] = True
else:
    response["status"] = "not authenticated"

# Print the JSON response
print(json.dumps(response))
