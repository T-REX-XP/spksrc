#!/usr/bin/python

import os
import json
import sys

from pathlib import Path
path_root = Path(__file__).parents[1]
sys.path.append(str(path_root)+'/libs')

import libs.yaml as yaml
print("Content-type: application/json\n")


def read_manifests_in_subdirs(parent_directory):
    manifests = []

    for subdir in next(os.walk(parent_directory))[1]: # Iterates through each subdirectory
        manifest_path = os.path.join(parent_directory, subdir, 'manifest.yml')
        if os.path.exists(manifest_path): # Check if manifest.yml exists in the subdir
            with open(manifest_path, 'r') as file:
                try:
                    manifests.append(yaml.safe_load(file)) # Load the YAML file
                except yaml.YAMLError as exc:
                    print(f"Error reading {manifest_path}: {exc}")

    return manifests


# Authenticate the user
f = os.popen('/usr/syno/synoman/webman/modules/authenticate.cgi', 'r')
user = f.read().strip()
ADDONS_PATH = '/mnt/loader3/addons/'
response = {}

if len(user) > 0:
    addons = read_manifests_in_subdirs(ADDONS_PATH)
    response['result'] = addons
    response['success'] = True
    response['total'] = len(addons)
else:
    response["status"] = "not authenticated"

# Print the JSON response
print(json.dumps(response))
