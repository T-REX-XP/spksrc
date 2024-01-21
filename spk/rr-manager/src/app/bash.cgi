#!/bin/bash

echo -e "Content-type: text/html\n\n"

USER=$(/usr/syno/synoman/webman/modules/authenticate.cgi)

if [ "${USER}" = "" ]; then
  echo -e "Security : user not authenticated\n"
else
  LOADER_DISK_PART3="$(blkid -L RR3 | cut -d':' -f1)"
  LOADER_DISK_PART2="${LOADER_DISK_PART3/3/2}"
  LOADER_DISK_PART1="${LOADER_DISK_PART3/3/1}"
  LOADER_DISK="/dev/$(realpath /sys/block/*/${LOADER_DISK_PART3/\/dev\//} | awk -F'/' '{print $(NF-1)}')"
  #echo -e "Security : user authenticated ${USER}\n"
  # Make folders to mount partitions
  if [ ! -d "/mnt/p1" ]; then
    mkdir -p /mnt/p1
  fi
  if [ ! -d "/mnt/p2" ]; then
    mkdir -p /mnt/p2
  fi
  if [ ! -d "/mnt/p3" ]; then
    mkdir -p /mnt/p3
  fi

  mount ${LOADER_DISK_PART1} /mnt/p1 2>/dev/null || (
    echo "Can't mount ${LOADER_DISK_PART1}"
  )
  sleep 2

  mount ${LOADER_DISK_PART2} /mnt/p2 2>/dev/null || (
    echo "Can't mount ${LOADER_DISK_PART2}"
  )
  sleep 2

  mount ${LOADER_DISK_PART3} /mnt/p3 2>/dev/null || (
    echo "Can't mount ${LOADER_DISK_PART3}"
  )
  sleep 2

  ADDONS_VERSION= cat /mnt/p3/addons/VERSION
  sleep 1
  LKM_VERSION=cat /mnt/p3/lkms/VERSION
  sleep 1
  MODULES_VERSION=cat /mnt/p3/modules/VERSION
  sleep 1
  echo "{'loaderDisk':'${LOADER_DISK}','lkm_version':'${LKM_VERSION}','modules_version':'${MODULES_VERSION}','addons_version':'${ADDONS_VERSION}'"

fi
