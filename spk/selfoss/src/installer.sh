#!/bin/sh

# Package
PACKAGE="selfoss"
DNAME="Selfoss"

# Others
INSTALL_DIR="/usr/local/${PACKAGE}"
SSS="/var/packages/${PACKAGE}/scripts/start-stop-status"
WEB_DIR="/var/services/web"
USER="$([ $(grep buildnumber /etc.defaults/VERSION | cut -d"\"" -f2) -ge 4418 ] && echo -n http || echo -n nobody)"
MYSQL="/usr/syno/mysql/bin/mysql"
MYSQL_USER="selfoss"
MYSQL_DATABASE="selfoss"
TMP_DIR="${SYNOPKG_PKGDEST}/../../@tmp"


preinst ()
{
    # Check database
    if [ "${SYNOPKG_PKG_STATUS}" == "INSTALL" ]; then
        if ! ${MYSQL} -u root -p"${wizard_mysql_password_root}" -e quit > /dev/null 2>&1; then
            echo "Incorrect MySQL root password"
            exit 1
        fi
        if ${MYSQL} -u root -p"${wizard_mysql_password_root}" mysql -e "SELECT User FROM user" | grep ^${MYSQL_USER}$ > /dev/null 2>&1; then
            echo "MySQL user ${MYSQL_USER} already exists"
            exit 1
        fi
        if ${MYSQL} -u root -p"${wizard_mysql_password_root}" -e "SHOW DATABASES" | grep ^${MYSQL_DATABASE}$ > /dev/null 2>&1; then
            echo "MySQL database ${MYSQL_DATABASE} already exists"
            exit 1
        fi
    fi

    exit 0
}

postinst ()
{
    # Link
    ln -s ${SYNOPKG_PKGDEST} ${INSTALL_DIR}

    # Install busybox stuff
    ${INSTALL_DIR}/bin/busybox --install ${INSTALL_DIR}/bin

    # Install the web interface
    cp -R ${INSTALL_DIR}/share/${PACKAGE} ${WEB_DIR}

    # Setup database and configuration file
    if [ "${SYNOPKG_PKG_STATUS}" == "INSTALL" ]; then
        ${MYSQL} -u root -p"${wizard_mysql_password_root}" -e "CREATE DATABASE ${MYSQL_DATABASE}; GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${wizard_mysql_password_selfoss}';"
        echo -e "[globals]" \
                "\ndb_type=mysql" \
                "\ndb_host=localhost" \
                "\ndb_port=3306" \
                "\ndb_username=${MYSQL_USER}" \
                "\ndb_password=${wizard_mysql_password_selfoss}" \
                "\nsalt=$(openssl rand -hex 8)" \
                > ${WEB_DIR}/${PACKAGE}/config.ini
    fi

    # Fix permissions
    chown ${USER} ${WEB_DIR}/${PACKAGE}/public
    chown -R ${USER} ${WEB_DIR}/${PACKAGE}/data

    exit 0
}

preuninst ()
{
    # Check database
    if [ "${SYNOPKG_PKG_STATUS}" == "UNINSTALL" -a "${wizard_remove_database}" == "true" ] && ! ${MYSQL} -u root -p"${wizard_mysql_password_root}" -e quit > /dev/null 2>&1; then
        echo "Incorrect MySQL root password"
        exit 1
    fi

    # Stop the package
    ${SSS} stop > /dev/null

    exit 0
}

postuninst ()
{
    # Remove link
    rm -f ${INSTALL_DIR}

    # Remove database
    if [ "${SYNOPKG_PKG_STATUS}" == "UNINSTALL" -a "${wizard_remove_database}" == "true" ]; then
        ${MYSQL} -u root -p"${wizard_mysql_password_root}" -e "DROP DATABASE ${MYSQL_DATABASE}; DROP USER '${MYSQL_USER}'@'localhost';"
    fi

    # Remove the web interface
    rm -fr ${WEB_DIR}/${PACKAGE}

    exit 0
}

preupgrade ()
{
    # Stop the package
    ${SSS} stop > /dev/null

    # Save the configuration file
    rm -fr ${TMP_DIR}/${PACKAGE}
    mkdir -p ${TMP_DIR}/${PACKAGE}
    mv ${WEB_DIR}/${PACKAGE}/config.ini ${TMP_DIR}/${PACKAGE}/
    mv ${WEB_DIR}/${PACKAGE}/data ${TMP_DIR}/${PACKAGE}/

    exit 0
}

postupgrade ()
{
    # Restore the configuration file
    mv ${TMP_DIR}/${PACKAGE}/config.ini ${WEB_DIR}/${PACKAGE}/
    cp -r ${TMP_DIR}/${PACKAGE}/data ${WEB_DIR}/${PACKAGE}/
    rm -fr ${TMP_DIR}/${PACKAGE}

    exit 0
}
