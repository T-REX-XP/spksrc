
service_postinst ()
{
    cp ${SYNOPKG_PKGDEST}/bin/test.cgi ${SYNOPKG_PKGDEST}/app/
    echo "Install packages for RR Manager"
    pip install --disable-pip-version-check --no-input --cache-dir ${PIP_CACHE_DIR} --requirement ${SYNOPKG_PKGDEST}/share/postinst_components_requirements.txt
    /bin/sqlite3 ${SYNOPKG_PKGHOME}/api.db <${SYNOPKG_PKGDEST}/app/createsqlitedata.sql
}
