PKG_NAME = dol
PKG_VERS = 2.2.0.3901
PKG_EXT = zip
PKG_DIST_NAME = $(PKG_VERS).$(PKG_EXT)
PKG_DIST_SITE = https://github.com/Dawn-of-Light/DOLSharp/archive/refs/tags
PKG_DIR = DOLSharp-$(PKG_VERS)

DEPENDS =

HOMEPAGE = https://github.com/Dawn-of-Light/DOLSharp/wiki
COMMENT  = DOL Server is a server emulator for the game Dark Age of Camelot written by the Dawn of Light community

CONFIGURE_TARGET = nop
COMPILE_TARGET = dol_compile
INSTALL_TARGET = dol_install

include ../../mk/spksrc.cross-cc.mk

.PHONY: dol_compile
dol_compile:
	cd $(WORK_DIR)/$(PKG_DIR)/ ; patch -i $(WORK_DIR)/../../../cross/dol/fix/001_ConsoleStart.patch $(WORK_DIR)/$(PKG_DIR)/DOLServer/actions/ConsoleStart.cs ; dotnet build --configuration "Release" -p:Version="$(PKG_VERS)" --verbosity normal "Dawn of Light.sln" 

.PHONY: dol_install
dol_install:
	echo "eula=true" >$(STAGING_INSTALL_PREFIX)/eula.txt
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLServer.deps.json $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLServer.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLServer.sh $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLServer.runtimeconfig.json $(STAGING_INSTALL_PREFIX)/
	cp -R $(WORK_DIR)/$(PKG_DIR)/Release/languages $(STAGING_INSTALL_PREFIX)/
	mkdir $(STAGING_INSTALL_PREFIX)/lib
	cp $(WORK_DIR)/$(PKG_DIR)/Release/*.dll $(STAGING_INSTALL_PREFIX)/lib
	cp -R $(WORK_DIR)/$(PKG_DIR)/Release/scripts $(STAGING_INSTALL_PREFIX)/
