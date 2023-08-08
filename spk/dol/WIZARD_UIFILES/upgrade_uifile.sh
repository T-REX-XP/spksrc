#!/bin/sh

INST_ETC="/var/packages/${SYNOPKG_PKGNAME}/etc"
INST_VARIABLES="${INST_ETC}/installer-variables"

# Reload wizard variables stored by postinst
if [ -r "${INST_VARIABLES}" ]; then
    . "${INST_VARIABLES}"
fi

cat <<EOF > $SYNOPKG_TEMP_LOGFILE
[
  {
    "step_title": "Setting Dawn Of Light server",
    "items": [{
        "type": "textfield",
        "desc": "MariaDB's login.",
        "subitems": [{
            "key": "wizard_sql_username",
            "desc": "Username",
            "defaultValue": "${SAVE_SQL_USERNAME}"
        }]
    }, {
        "type": "password",
        "desc": "MariaDB's password.",
        "subitems": [{
            "key": "wizard_sql_password",
            "desc": "Password",
            "defaultValue": "${SAVE_SQL_PASSWORD}"
        }]
    }, {
        "type": "textfield",
        "desc": "MariaDB's port.",
        "subitems": [{
            "key": "wizard_sql_port",
            "desc": "Port",
            "defaultValue": "${SAVE_SQL_PORT}"
        }]
    }, {
        "type": "textfield",
        "desc": "Server local IP address. ",
        "subitems": [{
            "key": "wizard_ip_address",
            "desc": "IP address",
            "defaultValue": "${SAVE_IP_ADDRESS}"
        }]
    }]
  },
  {
  "step_title": "Database initialization for Dawn of Light",
    "items": [{
      "type": "singleselect",
      "desc": "Please indicate your choice regarding the database content for the game",
      "subitems": [{
        "key": "wizard_eve_data",
        "desc": "Use up-to-date game data based on <a target=\"_blank\" href=\"https://github.com/Eve-of-Darkness/db-public\">Eve of Darkness</a> community work. This might require a few minutes to proceed.",
        "defaultValue": true
      }, {
        "key": "wizard_standard_data",
        "desc": "Do not use up-to-date game data. Standard initialization will be done.",
        "defaultValue": false
      }]
    }]
  },
  {
    "step_title": "Information on Dawn of Light",
    "items": [
      {
        "desc": "DOL Server is a server emulator for the game Dark Age of Camelot written by the Dawn of Light community.<br><br>"
      },
      {
        "desc": "It does the following:<br>- Provides the network communication needed to allow a DAOC game client to connect to the server<br>- Provides a database layer between the server and MySQL~SQLite to allow storage of characters, npcs, items, ...<br>- Provides a persistent world framework for customisation of game rulesets and behaviours<br><br>"
      },
      {
        "desc": "For more information on the server setup and customization, please refer to the <a target=\"_blank\" href=\"https://github.com/Dawn-of-Light/DOLSharp/wiki\">Dawn of Light Wiki</a>.<br>"
      }
    ]
  }
]
EOF
exit 0
