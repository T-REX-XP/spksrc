#!/bin/bash

echo -e "Content-type: text/html\n\n"

USER=$(/usr/syno/synoman/webman/modules/authenticate.cgi)

LOADER_DISK_PART3="$(blkid -L RR3 | cut -d':' -f1)"
LOADER_DISK_PART2="${LOADER_DISK_PART3/3/2}"
LOADER_DISK_PART1="${LOADER_DISK_PART3/3/1}"
LOADER_DISK="/dev/$(realpath /sys/block/*/${LOADER_DISK_PART3/\/dev\//} | awk -F'/' '{print $(NF-1)}')"

if [ "${USER}" = "" ]; then
  echo -e "Security : user not authenticated\n"
else
  #echo -e "Security : user authenticated ${USER}\n"
  # Make folders to mount partitions
  mkdir -p /mnt/p1
  mkdir -p /mnt/p2
  mkdir -p /mnt/p3

  mount ${LOADER_DISK_PART1} /mnt/p1 2>/dev/null || (
    echo "Can't mount ${LOADER_DISK_PART1}"
  )
  mount ${LOADER_DISK_PART2} /mnt/p2 2>/dev/null || (
    echo "Can't mount ${LOADER_DISK_PART2}"
  )
  mount ${LOADER_DISK_PART3} /mnt/p3 2>/dev/null || (
    echo "Can't mount ${LOADER_DISK_PART3}"
  )
  echo "Loader disk has been mounted to /mnt/. Disk: ${LOADER_DISK}"

fi
