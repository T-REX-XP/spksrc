# This gives tranmission the power to execute python scripts on completion (like TorrentToMedia).
if [ "${SYNOPKG_DSM_VERSION_MAJOR}" -ge 7 ]; then
    # use system python for DSM7
    PYTHON_BIN_PATHS=""
else
    GROUP="sc-download"
    PYTHON_BIN_PATHS="/var/packages/python310/target/bin:/var/packages/python38/target/bin:/var/packages/python3/target/bin:"
fi

PATH="${SYNOPKG_PKGDEST}/bin:${PYTHON_BIN_PATHS}${PATH}"

# PYTHON_DIR="/var/packages/python/target/bin"
PATH="${SYNOPKG_PKGDEST}/bin:${SYNOPKG_PKGDEST}/env/bin:${PYTHON_DIR}:${GIT_DIR}:${PATH}"
HOME="${SYNOPKG_PKGDEST}/var"
VIRTUALENV="${PYTHON_DIR}/virtualenv"
PYTHON="${SYNOPKG_PKGDEST}/env/bin/python"

service_postinst ()
{
     # Create a Python virtualenv
    ${VIRTUALENV} --system-site-packages ${SYNOPKG_PKGDEST}/env
    ${SYNOPKG_PKGDEST}/env/bin/pip install -U --build ${SYNOPKG_PKGDEST}/build --force-reinstall -r ${SYNOPKG_PKGDEST}/share/postinst_components_requirements.txt

    cp ${SYNOPKG_PKGDEST}/bin/test.cgi ${SYNOPKG_PKGDEST}/app/
    echo "Install packages for RR Manager"
    /bin/sqlite3 ${SYNOPKG_PKGHOME}/api.db <${SYNOPKG_PKGDEST}/app/createsqlitedata.sql
}
