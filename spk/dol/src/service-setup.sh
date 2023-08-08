CFG_FILE="${SYNOPKG_PKGDEST}/config/serverconfig.xml"
PATH="${SYNOPKG_PKGDEST}:${PATH}"
#SERVICE_COMMAND="mono --debug --gc=sgen --server ${SYNOPKG_PKGDEST}/DOLServer.exe"
SERVICE_COMMAND="dotnet ${SYNOPKG_PKGDEST}/DOLServer.dll"
SVC_BACKGROUND=y
SVC_WRITE_PID=y


service_postinst ()
{
    # Edit the configuration according to the wizard
    sed -i -e "s/@login@/${wizard_sql_username:=root}/g" ${CFG_FILE}
    sed -i -e "s/@password@/${wizard_sql_password:=changepassword}/g" ${CFG_FILE}
    sed -i -e "s/@port@/${wizard_sql_port:=3306}/g" ${CFG_FILE}
    sed -i -e "s/@ip_address@/${wizard_ip_address}/g" ${CFG_FILE}

    # Create dol database if not exists
    mysql -u ${wizard_sql_username:=root} -p${wizard_sql_password:=changepassword} -P ${wizard_sql_port:=3306} -e 'create database if not exists dol'

    # Fill database with Eve-of-Darkness data
    if [ ${wizard_eve_data} == "true" ]; then
        mysql -u ${wizard_sql_username:=root} -p${wizard_sql_password:=changepassword} -P ${wizard_sql_port:=3306} -b dol < ${SYNOPKG_PKGDEST}/config/public-db.mysql.sql
    fi

    echo "SAVE_SQL_USERNAME=${wizard_sql_username}" > ${INST_VARIABLES}
    echo "SAVE_SQL_PASSWORD=${wizard_sql_password}" >> ${INST_VARIABLES}
    echo "SAVE_SQL_PORT=${wizard_sql_port}" >> ${INST_VARIABLES}
    echo "SAVE_IP_ADDRESS=${wizard_ip_address}" >> ${INST_VARIABLES}
}

service_postuninst ()
{
    # Remove database on request
    if [ ${wizard_delete_data} == "true" ]; then
        mysql -u ${wizard_sql_username:=root} -p${wizard_sql_password:=changepassword} -P ${wizard_sql_port:=3306} -e 'drop database dol'
    fi
}

