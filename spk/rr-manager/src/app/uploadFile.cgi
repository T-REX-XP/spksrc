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

# Define the maximum file size (1GB)
MAX_FILE_SIZE = 1073741824  # in bytes

# Function to check MIME type
def allowed_file_mime(mimetype):
    return mimetype == 'application/x-zip-compressed'
response = {}

# Authenticate the user
f = os.popen('/usr/syno/synoman/webman/modules/authenticate.cgi', 'r')
user = f.read().strip()

if len(user) > 0:
    form = cgi.FieldStorage()
    # Get filename
    fileitem = form['filename']

    # Check if the file was uploaded
    if fileitem.filename:
        # Check file size
        file_size = os.fstat(fileitem.file.fileno()).st_size
        if file_size > MAX_FILE_SIZE:
            message = 'File size exceeds the 1GB limit.'
        elif not allowed_file_mime(fileitem.type):
            message = 'Invalid file type. Only ZIP files are allowed.'
        else:
            # Strip leading path from file name to avoid directory traversal attacks
            fn = os.path.basename(fileitem.filename.replace("\\", "/"))
            open('/tmp/' + fn, 'wb').write(fileitem.file.read())
            message = 'The file "' + fn + '" was uploaded successfully'
    else:
        message = 'No file was uploaded'
    # Get filename
    fileitem = form['filename']

    response['message'] = message
    response['success'] = True
else:
    response["status"] = "not authenticated"

# Print the JSON response
print(json.dumps(response))
