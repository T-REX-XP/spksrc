PYTHON_DIR="/usr/local/python3"
PATH="${INSTALL_DIR}/bin:${INSTALL_DIR}/env/bin:${PYTHON_DIR}/bin:${PATH}"
VIRTUALENV="${PYTHON_DIR}/bin/python3 -m venv"
PIP=${SYNOPKG_PKGDEST}/env/bin/pip3

service_postinst ()
{
     # Create a Python virtualenv
    ${VIRTUALENV} --system-site-packages ${SYNOPKG_PKGDEST}/env >> ${INST_LOG} 2>&1

    cp ${SYNOPKG_PKGDEST}/bin/test.cgi ${SYNOPKG_PKGDEST}/app/
    echo "Install packages for RR Manager"
    pip install --disable-pip-version-check --no-input --cache-dir ${PIP_CACHE_DIR} --requirement ${SYNOPKG_PKGDEST}/share/postinst_components_requirements.txt
    /bin/sqlite3 ${SYNOPKG_PKGHOME}/api.db <${SYNOPKG_PKGDEST}/app/createsqlitedata.sql
}
