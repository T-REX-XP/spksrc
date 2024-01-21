#!/usr/bin/python

import os
import json

print("Content-type: application/json\n")

# Authenticate the user
f = os.popen('/usr/syno/synoman/webman/modules/authenticate.cgi', 'r')
user = f.read().strip()  # .strip() to remove any trailing newline characters

response = {}

if len(user) > 0:
    response["status"] = "authenticated"
    response["user"] = user

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

print(json.dumps(response))
