#!/bin/bash

echo -e "Content-type: application/json\n\n"

USER=$(/usr/syno/synoman/webman/modules/authenticate.cgi)

if [ "${USER}" = "" ]; then
  echo -e "Security : user not authenticated\n"
else
  echo "TODO"
fi
