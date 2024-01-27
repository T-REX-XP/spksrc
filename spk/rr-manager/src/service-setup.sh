PYTHON_DIR="/var/packages/python311/target/bin"
PATH="${SYNOPKG_PKGDEST}/env/bin:${SYNOPKG_PKGDEST}/bin:${PYTHON_DIR}:${PATH}"

service_postinst ()
{
    separator="===================================================="

    echo ${separator}
    install_python_virtualenv

    echo ${separator}
    install_python_wheels
    /bin/sqlite3 ${SYNOPKG_PKGHOME}/api.db <${SYNOPKG_PKGDEST}/app/createsqlitedata.sql

    echo ${separator}
    echo "Install packages to the app/libs folder"
    ${SYNOPKG_PKGDEST}/env/bin/pip install --target ${SYNOPKG_PKGDEST}/app/libs/ -r ${SYNOPKG_PKGDEST}/share/wheelhouse/requirements.txt
}
