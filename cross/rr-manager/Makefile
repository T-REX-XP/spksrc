PKG_NAME = RRManager
PKG_VERS = 0.2
PKG_EXT = tar.gz
PKG_DIST_NAME =v$(PKG_VERS).$(PKG_EXT)
PKG_DIST_SITE = https://github.com/T-REX-XP/RRManager/archive/refs/tags
PKG_DIR = $(PKG_NAME)-$(PKG_VERS)

DEPENDS =

HOMEPAGE = https://github.com/T-REX-XP/
COMMENT  = RRManager Application for DSM 

GNU_CONFIGURE = 1

INSTALL_TARGET = simpleextjsapp_install

include ../../mk/spksrc.cross-cc.mk

.PHONY: simpleextjsapp_install
simpleextjsapp_install:
	$(RUN) make install prefix=$(STAGING_INSTALL_PREFIX) 
	install -m 755 -d $(STAGING_INSTALL_PREFIX)/web 
	tar -xvf $(WORK_DIR)/$(PKG_DIR)/docs/synoextjsdocs.tar.gz -C $(STAGING_INSTALL_PREFIX)/web/
