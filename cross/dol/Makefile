PKG_NAME = dol
PKG_VERS = 1.9.7.3886
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
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLBase.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLDatabase.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLServer $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLServer.deps.json $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLServer.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLServer.dll.config $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLServer.exe.config $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/DOLServer.runtimeconfig.json $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/GameServer.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/ICSharpCode.SharpZipLib.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/log4net.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Bcl.AsyncInterfaces.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.CodeAnalysis.CSharp.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.CodeAnalysis.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Data.Sqlite.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Diagnostics.NETCore.Client.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Diagnostics.Runtime.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Extensions.Configuration.Abstractions.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Extensions.Configuration.Binder.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Extensions.Configuration.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Extensions.DependencyInjection.Abstractions.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Extensions.Logging.Abstractions.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Extensions.Logging.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Extensions.Options.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Extensions.Primitives.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/Microsoft.Win32.SystemEvents.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/MySqlConnector.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/SQLitePCLRaw.batteries_v2.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/SQLitePCLRaw.core.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/System.Configuration.ConfigurationManager.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/System.Diagnostics.EventLog.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/System.Diagnostics.PerformanceCounter.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/System.Drawing.Common.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/System.Security.Cryptography.ProtectedData.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/System.Security.Permissions.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/System.ServiceProcess.ServiceController.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/System.Text.Encoding.CodePages.dll $(STAGING_INSTALL_PREFIX)/
	cp $(WORK_DIR)/$(PKG_DIR)/Release/System.Windows.Extensions.dll $(STAGING_INSTALL_PREFIX)/
	cp -R $(WORK_DIR)/$(PKG_DIR)/Release/languages $(STAGING_INSTALL_PREFIX)/
	cp -R $(WORK_DIR)/$(PKG_DIR)/Release/lib $(STAGING_INSTALL_PREFIX)/
	cp -R $(WORK_DIR)/$(PKG_DIR)/Release/runtimes $(STAGING_INSTALL_PREFIX)/
	cp -R $(WORK_DIR)/$(PKG_DIR)/Release/scripts $(STAGING_INSTALL_PREFIX)/
