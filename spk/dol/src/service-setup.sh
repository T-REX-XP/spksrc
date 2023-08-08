CFG_FILE="${SYNOPKG_PKGDEST}/config/serverconfig.xml"
PATH="${SYNOPKG_PKGDEST}:${PATH}"
SERVICE_COMMAND="mono --debug --gc=sgen --server ${SYNOPKG_PKGDEST}/DOLServer.exe"
SVC_BACKGROUND=y
SVC_WRITE_PID=y


service_postinst ()
{
    # Edit the configuration according to the wizard
    sed -i -e "s/@login@/${wizard_sql_username:=root}/g" ${CFG_FILE}
    sed -i -e "s/@password@/${wizard_sql_password:=changepassword}/g" ${CFG_FILE}
}


