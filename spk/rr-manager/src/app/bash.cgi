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

  if [ $? -eq 0 ]; then
    echo "Mount successful"
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

    mount ${LOADER_DISK_PART1} /mnt/p1 2>/dev/null
    if [ $? -eq 0 ]; then
        mount ${LOADER_DISK_PART2} /mnt/p2 2>/dev/null
          if [ $? -eq 0 ]; then
            mount ${LOADER_DISK_PART3} /mnt/p3 2>/dev/null
          else
            echo "Mount /mnt/p2 failed"
          fi
      else
        echo "Mount /mnt/p3 failed"
      fi

    else
        echo "Mount /mnt/p1 failed"
    fi

  ADDONS_VERSION= cat /mnt/p3/addons/VERSION
  LKM_VERSION=cat /mnt/p3/lkms/VERSION
  MODULES_VERSION=cat /mnt/p3/modules/VERSION
  
  echo "{'loaderDisk':'${LOADER_DISK}','lkm_version':'${LKM_VERSION}','modules_version':'${MODULES_VERSION}','addons_version':'${ADDONS_VERSION}'"

fi
