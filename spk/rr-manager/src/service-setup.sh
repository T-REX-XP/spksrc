# Add python to path
# This gives tranmission the power to execute python scripts on completion (like TorrentToMedia).
if [ "${SYNOPKG_DSM_VERSION_MAJOR}" -ge 7 ]; then
    # use system python for DSM7
    PYTHON_BIN_PATHS=""
else
    GROUP="sc-download"
    PYTHON_BIN_PATHS="/var/packages/python310/target/bin:/var/packages/python38/target/bin:/var/packages/python3/target/bin:"
fi

PATH="${SYNOPKG_PKGDEST}/bin:${PYTHON_BIN_PATHS}${PATH}"

service_postinst ()
{
    # Create a Python virtualenv
    python3 -m venv --system-site-packages ${SYNOPKG_PKGDEST}/env >> ${INST_LOG} 2>&1
    python3 -m ensurepip
    python3 -m pip install --upgrade pip
    python3 -m pip install pyyaml

    cp ${SYNOPKG_PKGDEST}/bin/test.cgi ${SYNOPKG_PKGDEST}/app/
    echo "Install packages for RR Manager"
    python3 -m pip install --requirement ${SYNOPKG_PKGDEST}/share/postinst_components_requirements.txt
    pip install --disable-pip-version-check --no-input --cache-dir ${PIP_CACHE_DIR} --requirement ${SYNOPKG_PKGDEST}/share/postinst_components_requirements.txt
    /bin/sqlite3 ${SYNOPKG_PKGHOME}/api.db <${SYNOPKG_PKGDEST}/app/createsqlitedata.sql
}
