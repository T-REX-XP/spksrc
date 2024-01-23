#!/usr/bin/python

import os
import json
# import yaml

print("Content-type: application/json\n")

# Function to read rr_version from a file
def read_rr_version():
    try:
        with open('/mnt/loader1/RR_VERSION', 'r') as file:
            return file.read().strip()  # Read and strip newline characters
    except IOError as e:
        return f"Error reading RR_VERSION: {e}"

# Function to read user configuration from a YAML file
# def read_user_config():
#     try:
#         with open('/tmp/p2/user-config.yml', 'r') as file:
#             return yaml.safe_load(file)  # Load and parse the YAML file
#     except IOError as e:
#         return f"Error reading user-config.yml: {e}"

# Authenticate the user
f = os.popen('/usr/syno/synoman/webman/modules/authenticate.cgi', 'r')
user = f.read().strip()

response = {}

if len(user) > 0:
    response["status"] = "authenticated"
    response["user"] = user

    # Read and add rr_version to the response
    response["rr_version"] = read_rr_version()
    # response["user_config"] = read_user_config()

    # Listing directories in /mnt/
    directories = []
    try:
        for entry in os.listdir('/mnt/'):
            if os.path.isdir(os.path.join('/mnt/', entry)):
                directories.append(entry)
        response["directories"] = directories
    except OSError as e:
        response["error"] = str(e)

else:
    response["status"] = "not authenticated"

# Print the JSON response
print(json.dumps(response))
