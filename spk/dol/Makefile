SPK_NAME = dol
SPK_VERS = 1.9.7
SPK_REV = 1
SPK_ICON = src/dol.png
DSM_UI_DIR = app

DEPENDS  = cross/$(SPK_NAME)

MAINTAINER = DigitalBox98
DESCRIPTION = DOL Server is a server emulator for the game Dark Age of Camelot written by the Dawn of Light community

RELOAD_UI = yes
STARTABLE = yes
DISPLAY_NAME = DawnOfLight

HOMEPAGE   = https://github.com/Dawn-of-Light/DOLSharp/wiki
LICENSE    = GPLv2

WIZARDS_DIR = WIZARD_UIFILES

SERVICE_USER = auto
SERVICE_SETUP = src/service-setup.sh
NO_SERVICE_SHORTCUT = yes

POST_STRIP_TARGET = dol_extra_install

include ../../mk/spksrc.spk.mk

.PHONY: dol_extra_install
dol_extra_install:
	install -m 755 -d $(STAGING_DIR)/config
	install -m 644 src/serverconfig.xml $(STAGING_DIR)/config/
