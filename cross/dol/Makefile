PKG_NAME = dol
PKG_VERS = 1.9.7
PKG_EXT = zip
PKG_DIST_NAME = DOLServer_linux_net45_Release.$(PKG_EXT)
PKG_DIST_SITE = https://github.com/Dawn-of-Light/DOLSharp/releases/download/1.9.7.3810
PKG_DIR = $(PKG_NAME)-$(PKG_VERS)

DEPENDS =

HOMEPAGE = https://github.com/Dawn-of-Light/DOLSharp/wiki
COMMENT  = DOL Server is a server emulator for the game Dark Age of Camelot written by the Dawn of Light community

CONFIGURE_TARGET = nop
COMPILE_TARGET = nop
INSTALL_TARGET = dol_install

include ../../mk/spksrc.cross-cc.mk

.PHONY: dol_install
dol_install:
	echo "eula=true" >$(STAGING_INSTALL_PREFIX)/eula.txt
	cp $(WORK_DIR)/DOLServer.exe $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/DOLServer.exe.config $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/DOLConfig.exe $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/DOLConfig.exe.config $(STAGING_INSTALL_PREFIX)/
	cp -R $(WORK_DIR)/languages $(STAGING_INSTALL_PREFIX)/
	cp -R $(WORK_DIR)/lib $(STAGING_INSTALL_PREFIX)/
	cp -R $(WORK_DIR)/scripts $(STAGING_INSTALL_PREFIX)/

