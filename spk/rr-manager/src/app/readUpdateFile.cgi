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

response = {}

if len(user) > 0:
    with zipfile.ZipFile("/tmp/update.zip", mode="r") as arch:
       # response['message'] = arch.printdir()
        response['updateVersion'] =arch.read("RR_VERSION")
        response['success'] = True
else:
    response["status"] = "not authenticated"

# Print the JSON response
print(json.dumps(response))
