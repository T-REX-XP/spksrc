SPK_NAME = rr-manager
SPK_VERS = 0.7
SPK_REV = 7
SPK_ICON = src/rr-manager.png
WIZARDS_DIR = WIZARD_UIFILES
DSM_UI_DIR = app

# DEPENDS = cross/$(SPK_NAME)
PIP = $(WORK_DIR)/../../../native/python3/work-native/install/usr/local/bin/pip

WHEELS = src/requirements.txt

MAINTAINER = T-REX-XP

DESCRIPTION = RRManager Application demo to illustrate the usage of Syno ExtJS framework for DSM applications. This package is for experienced users.
STARTABLE = no
DISPLAY_NAME = RRManager

HOMEPAGE = https://github.com/T-REX-XP/RRManager

ADMIN_URL = /rr-manager/

CONF_DIR = src/conf
SYSTEM_GROUP = http

SERVICE_USER   = auto
SERVICE_SETUP  = src/service-setup.sh

POST_STRIP_TARGET = rr-manager_extra_install

include ../../mk/spksrc.spk.mk

.PHONY: rr-manager_extra_install
rr-manager_extra_install:
	install -m 755 -d $(STAGING_DIR)/share $(STAGING_DIR)/var
	install -m 644 src/postinst_components_requirements.txt $(STAGING_DIR)/share/

	install -m 755 -d $(STAGING_DIR)/app/
	install -m 755 src/app/perl.cgi $(STAGING_DIR)/app/perl.cgi
	install -m 755 src/app/python.cgi $(STAGING_DIR)/app/python.cgi
	install -m 755 src/app/bash.cgi $(STAGING_DIR)/app/bash.cgi
	install -m 755 src/app/externalapi.cgi $(STAGING_DIR)/app/externalapi.cgi
	install -m 755 src/app/storepythonsqlapi.cgi $(STAGING_DIR)/app/storepythonsqlapi.cgi
	install -m 644 src/app/config $(STAGING_DIR)/app/config
	install -m 644 src/app/rr-manager.js $(STAGING_DIR)/app/rr-manager.js
	install -m 644 src/app/helptoc.conf $(STAGING_DIR)/app/helptoc.conf
	install -m 755 src/app/createsqlitedata.sql $(STAGING_DIR)/app/createsqlitedata.sql
	install -m 755 src/app/storepythonsynoapi.cgi $(STAGING_DIR)/app/storepythonsynoapi.cgi
	install -m 755 src/app/storebashratesapi.cgi $(STAGING_DIR)/app/storebashratesapi.cgi
	install -m 755 -d $(STAGING_DIR)/app/help
	for language in enu fre; do \
		install -m 755 -d $(STAGING_DIR)/app/help/$${language}; \
		install -m 644 src/app/help/$${language}/simpleapp_index.html $(STAGING_DIR)/app/help/$${language}/simpleapp_index.html; \
	done
	install -m 755 -d $(STAGING_DIR)/app/texts
	for language in enu fre; do \
		install -m 755 -d $(STAGING_DIR)/app/texts/$${language}; \
		install -m 644 src/app/texts/$${language}/strings $(STAGING_DIR)/app/texts/$${language}/strings; \
	done
