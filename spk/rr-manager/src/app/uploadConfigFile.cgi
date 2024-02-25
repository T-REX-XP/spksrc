#!/usr/bin/python

import os
import json
import sys
import cgi

from http import cookies
from pathlib import Path
path_root = Path(__file__).parents[1]
sys.path.append(str(path_root)+'/libs')

import libs.yaml as yaml
print("Content-type: application/json\n")

# The directory where you want to save the file
save_path = '/tmp'
file_name = 'user-config.yml'
full_path = os.path.join(save_path, file_name)

response = {}

# Authenticate the user
f = os.popen('/usr/syno/synoman/webman/modules/authenticate.cgi', 'r')
user = f.read().strip()
message =""

if len(user) > 0:
    # Read the request body to get the JSON data
    if os.environ.get("REQUEST_METHOD") == "POST":
        ctype, pdict = cgi.parse_header(os.environ["CONTENT_TYPE"])
        if ctype == 'application/json':
            length = int(os.environ["CONTENT_LENGTH"])
            request_body = sys.stdin.read(length)
            data = json.loads(request_body)

            # Convert JSON data to YAML
            yaml_data = yaml.dump(data, default_flow_style=False)

            # Define the file path
            file_path = '/tmp/user-config.yml'
            
            # Write the YAML data to a file
            with open(file_path, 'w') as yaml_file:
                yaml_file.write(yaml_data)

            response['message'] = message
            response['success'] = True
else:
    response["status"] = "not authenticated"

# Print the JSON response
print(json.dumps(response))
