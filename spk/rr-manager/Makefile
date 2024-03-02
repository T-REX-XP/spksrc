SPK_NAME = rr-manager
SPK_VERS = 1.0
SPK_REV = 01
SPK_ICON = src/rr-manager.png
WIZARDS_DIR = WIZARD_UIFILES
DSM_UI_DIR = app

DEPENDS = cross/$(SPK_NAME)
WHEELS = src/requirements.txt

PYTHON_PACKAGE = python311
SPK_DEPENDS = "python311>=3.11.5-8"

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
SSS_SCRIPT = src/dsm-control.sh
STARTABLE = yes
SPK_COMMANDS = env/bin/beet

POST_STRIP_TARGET = rr-manager_extra_install

include ../../mk/spksrc.spk.mk

.PHONY: rr-manager_extra_install
rr-manager_extra_install:
	install -m 755 -d $(STAGING_DIR)/share $(STAGING_DIR)/var
	install -m 755 -d $(STAGING_DIR)/share/wheelhouse/
	install -m 644 src/requirements.txt $(STAGING_DIR)/share/wheelhouse/requirements.txt

	install -m 755 -d $(STAGING_DIR)/app/
	install -m 755 -d $(STAGING_DIR)/app/libs/
	install -m 755 src/app/getConfig.cgi $(STAGING_DIR)/app/getConfig.cgi
	install -m 755 src/app/getAddons.cgi $(STAGING_DIR)/app/getAddons.cgi
	install -m 755 src/app/getModules.cgi $(STAGING_DIR)/app/getModules.cgi
	install -m 755 src/app/readUpdateFile.cgi $(STAGING_DIR)/app/readUpdateFile.cgi
	install -m 755 src/app/uploadConfigFile.cgi $(STAGING_DIR)/app/uploadConfigFile.cgi
	install -m 755 src/app/checkUpdateStatus.cgi $(STAGING_DIR)/app/checkUpdateStatus.cgi
	install -m 644 src/app/config $(STAGING_DIR)/app/config
	install -m 644 src/app/rr-manager.js $(STAGING_DIR)/app/rr-manager.js
	install -m 644 src/app/helptoc.conf $(STAGING_DIR)/app/helptoc.conf
	install -m 755 src/app/createsqlitedata.sql $(STAGING_DIR)/app/createsqlitedata.sql
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
