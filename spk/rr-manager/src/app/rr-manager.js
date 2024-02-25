// Namespace definition
Ext.ns('SYNOCOMMUNITY.RRManager');

// Application definition
Ext.define('SYNOCOMMUNITY.RRManager.AppInstance', {
    extend: 'SYNO.SDS.AppInstance',
    appWindowName: 'SYNOCOMMUNITY.RRManager.AppWindow',
    constructor: function () {
        this.callParent(arguments)
    }
});

// Window definition
Ext.define('SYNOCOMMUNITY.RRManager.AppWindow', {
    extend: 'SYNO.SDS.AppWindow',
    appInstance: null,
    tabs: null,
    constructor: function (config) {
        this.appInstance = config.appInstance;

        this.tabs = (function () {
            var allTabs = [];

            // Tab for CGI or API calls
            allTabs.push({
                title: 'General',
                items: [
                    //this.createSystemInfoPannel(),
                    this.createGeneralSection(),
                    this.createActionsSection(),
                    // this.createDisplayExternalAPI()
                ]
            });

            allTabs.push({
                title: 'Addons',
                layout: 'fit',
                items: [
                    // this.createSynoStore(),
                    this.createAddonsStore()
                ]
            });

            // allTabs.push({
            //     title: 'Update',
            //     layout: 'fit',
            //     items: [
            //         this.createUploadPannel()
            //     ]
            // });

            return allTabs;
        }).call(this);

        config = Ext.apply({
            resizable: true,
            maximizable: true,
            minimizable: true,
            width: 640,
            height: 640,
            items: [{
                xtype: 'syno_displayfield',
                value: 'Welcome to the RR Manager App!'
            },
            {
                xtype: 'syno_tabpanel',
                activeTab: 0,
                plain: true,
                items: this.tabs,
                deferredRender: true
            }
            ]
        }, config);

        this.callParent([config]);
    },
    saveChanges: function (e) {
        //Rewrite rr config with new addons
        var newAddons = {};
        that['rrInstalledAddons']?.forEach(addonName => {
            newAddons[addonName] = ''
        });

        that['rrConfigNew'] = that['rrConfig']['user_config'];
        that['rrConfigNew']['addons'] = newAddons;

        this.handleFileUpload(that['rrConfigNew']);

        console.log('newRrConfig:', that['rrConfigNew']);
    },
    handleFileUpload: async function (jsonData) {
        let url = `${this.API._prefix}uploadConfigFile.cgi`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                console.log(data);
                alert('JSON uploaded successfully');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error uploading JSON');
            });
    },
    createUploadPannel: function () {
        var that = this;
        var myFormPanel = new Ext.form.FormPanel({
            renderTo: document.body,
            title: 'Please upload the update file:',
            url: 'webapi/entry.cgi?api=SYNO.FileStation.Upload&method=upload&version=2',
            height: '100%',
            fileUpload: true,
            width: 400,
            border: !1,
            bodyPadding: 10,
            items: [{
                xtype: 'syno_filebutton',
                text: 'Select File',
                name: 'filename',
                allowBlank: false,
            }],
            buttons: [{
                text: _T('ldap', 'upload'),
                xtype: 'syno_button',
                btnStyle: 'green',
                handler: function () {
                    var form = myFormPanel.getForm();
                    var fileObject = form.el.dom[1].files[0];
                    if (!form.isValid()) return;
                    //TODO: implement sending file to /tmp/ with name update.zip
                }
            }]
        });
        return myFormPanel;
    },
    createSystemInfoPannel: function () {

        return new SYNO.ux.FieldSet({
            collapsible: true,
            renderTo: document.body,
            title: 'Device Information',
            id: 'deviceInfoPanel',
            name: 'deviceInfoPanel',
            // width: 600,
            frame: true,
            labelWidth: 130,
            bodyStyle: 'padding:10px;',
            autoScroll: true,
            items: []
        });
    },
    // Create the display of CGI calls
    createGeneralSection: function () {
        return new SYNO.ux.FieldSet({
            title: 'General',
            collapsible: true,
            items: [
                // TextField
                {
                    xtype: 'syno_compositefield',
                    hideLabel: true,
                    items: [{
                        xtype: 'displayfield',
                        value: 'RR Version:',
                        width: 100,
                    }, {
                        xtype: 'displayfield',
                        width: 100,
                        id: 'lbRrVersion'
                    }]
                }
            ]
        });
    },
    // Create the display of API calls
    createActionsSection: function () {
        return new SYNO.ux.FieldSet({
            title: 'RR Loader Actions',
            collapsible: true,
            items:
                [
                    {
                        xtype: 'syno_compositefield',
                        hideLabel: true,
                        items: [{
                            xtype: 'syno_displayfield',
                            value: 'Run task: ',
                            width: 140
                        }, {
                            xtype: 'syno_button',
                            btnStyle: 'green',
                            text: 'Mount the loader disk',
                            handler: this.onRunTaskMountLoaderDiskClick.bind(this)
                        }]
                    },
                    {
                        xtype: 'syno_compositefield',
                        hideLabel: true,
                        items: [{
                            xtype: 'syno_displayfield',
                            value: 'Run task: ',
                            width: 140
                        }, {
                            xtype: 'syno_button',
                            btnStyle: 'red',
                            text: 'UnMount the loader disk',
                            handler: this.onRunTaskUnMountLoaderDiskClick.bind(this)
                        }]
                    },
                    {
                        xtype: 'syno_compositefield',
                        hideLabel: true,
                        items: [{
                            xtype: 'syno_displayfield',
                            value: 'Get RR config:',
                            width: 140
                        }, {
                            xtype: 'syno_button',
                            btnStyle: 'blue',
                            text: 'Read RR Update File',
                            handler: this.onReadUpdateFileClick.bind(this)
                        }]
                    }
                ]
        });
    },
    API: {
        _baseUrl: 'webapi/entry.cgi?',
        _prefix: '/webman/3rdparty/rr-manager/',
        runTask: function (taskName, callback) {
            let compound = JSON.stringify([{ 'api': 'SYNO.Core.EventScheduler', 'method': 'run', 'version': 1, 'task_name': taskName }]);
            var t = `${this._baseUrl}api=SYNO.Entry.Request&method=request&version=1&stop_when_error=false&mode='sequential'&compound=${compound}`;
            Ext.Ajax.request({
                url: t,
                method: 'GET',
                timeout: 60000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (response) {
                    if (callback) callback(response.responseText);
                },
                failure: function (response) {
                    window.alert('Request Failed to mount loader disk.');
                }
            });
        },
        callCustomScript: function (scriptName, callback) {
            Ext.Ajax.request({
                url: `${this._prefix}${scriptName}`,
                method: 'GET',
                timeout: 60000,
                headers: {
                    'Content-Type': 'text/html'
                },
                success: function (response) {
                    if (callback) callback(response.responseText);

                },
                failure: function (response) {
                    window.alert('Request Failed.');
                }
            });
        }
    },

    onRunTaskMountLoaderDiskClick: function () {
        this.API.runTask('MountLoaderDisk');
    },
    onRunTaskUnMountLoaderDiskClick: function () {
        this.API.runTask('UnMountLoaderDisk');
    },

    onReadUpdateFileClick: function () {
        that = this;
        this.API.callCustomScript('readUpdateFile.cgi', function (responseText) {
            if (!responseText) {
                window.alert('Unable to read the update file! Please upload file /tmp/update.zip and try againe.');
                return;
            }

            var configName = 'rrUpdateFileVersion';
            that[configName] = JSON.parse(responseText);
            sessionStorage.setItem(configName, responseText);
            window.alert("Update file version: " + that[configName].updateVersion);
            // that.populateSystemInfoPanel(that[configName]);
        });
    },
    // Call Python CGI on click
    onGetConfigClick: function () {
        that = this;
        this.API.callCustomScript('getConfig.cgi', function (responseText) {
            var configName = 'rrConfig';
            that[configName] = JSON.parse(responseText);
            sessionStorage.setItem(configName, responseText);
            that.populateSystemInfoPanel(that[configName]);
        });
    },
    populateSystemInfoPanel: function (config) {
        Ext.getCmp('lbRrVersion').setValue(config.rr_version);
        var userConfig = config.user_config;
        if (!userConfig) return;


        var panel = Ext.getCmp('deviceInfoPanel');
        // Function to handle adding both simple and complex (nested objects) properties
        var addItems = function (object, prefix) {
            var ignoreKeys = ['addons', 'modules'];
            for (var key in object) {
                if (ignoreKeys.indexOf(key) >= 0) return;

                var value = object[key];
                var fieldLabel = prefix ? prefix + '.' + key : key; // Handle nested keys

                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // If the value is a nested object, recursively add its properties
                    addItems(value, fieldLabel);
                } else {
                    // Convert non-string values to strings for display
                    if (typeof value !== 'string') {
                        value = JSON.stringify(value);
                    }

                    panel.add({ xtype: 'displayfield', fieldLabel: fieldLabel, value: value || 'N/A', anchor: '100%' });
                }
            }
        };

        // addItems(userConfig, '');
        // panel.doLayout();
    },
    //
    // Stores
    //

    // Create the display of SQL Store
    createAddonsStore: function () {
        return new SYNO.ux.FieldSet({
            // title: 'Addons',
            collapsible: false,
            autoHeight: true,
            items: [{
                xtype: 'syno_compositefield',
                hideLabel: true,
                items: [
                    this.createAddonsGrid()
                ]
            }
            ]
        });
    },
    _getLng: function (lng) {
        const localeMapping = {
            'dan': 'da_DK', // Danish in Denmark
            'ger': 'de_DE', // German in Germany
            'enu': 'en_US', // English (United States)
            'spn': 'es_ES', // Spanish (Spain)
            'fre': 'fr_FR', // French in France
            'ita': 'it_IT', // Italian in Italy
            'hun': 'hu_HU', // Hungarian in Hungary
            'nld': 'nl_NL', // Dutch in The Netherlands
            'nor': 'no_NO', // Norwegian in Norway
            'plk': 'pl_PL', // Polish in Poland
            'ptg': 'pt_PT', // European Portuguese
            'ptb': 'pt_BR', // Brazilian Portuguese
            'sve': 'sv_SE', // Swedish in Sweden
            'trk': 'tr_TR', // Turkish in Turkey
            'csy': 'cs_CZ', // Czech in Czech Republic
            'gre': 'el_GR', // Greek in Greece
            'rus': 'uk-UA',
            'heb': 'he_IL', // Hebrew in Israel
            'ara': 'ar_SA', // Arabic in Saudi Arabia
            'tha': 'th_TH', // Thai in Thailand
            'jpn': 'ja_JP', // Japanese in Japan
            'chs': 'zh_CN', // Simplified Chinese in China
            'cht': 'zh_TW', // Traditional Chinese in Taiwan
            'krn': 'ko_KR', // Korean in Korea
            'vi': 'vi-VN', // Vietnam in Vietnam 
        };
        return Object.keys(localeMapping).indexOf(lng) > -1
            ? localeMapping[lng] : localeMapping['enu'];
    },
    // Create JSON Store grid calling python SQL API  
    createAddonsGrid: function () {
        var that = this;
        var currentLngCode = this._getLng(SYNO.SDS.UserSettings.data.Personal.lang);

        var gridStore = new SYNO.API.JsonStore({
            autoDestroy: true,
            url: `${this.API._prefix}getAddons.cgi`,
            restful: true,
            root: 'result',
            idProperty: 'name',
            fields: [{
                name: 'name',
                type: 'string'
            }, {
                name: 'version',
                type: 'string'
            }, {
                name: 'description',
                type: 'object'
            }, {
                name: 'system',
                type: 'boolean'
            }, {
                name: 'installed',
                type: 'boolean'
            }]
        });
        var paging = new SYNO.ux.PagingToolbar({
            store: gridStore,
            displayInfo: true,
            pageSize: 5,
            refreshText: 'Reload'
        });

        var c = {
            store: gridStore,
            id: 'gridAddons',
            tbar: [
                {
                    xtype: 'syno_compositefield',
                    hideLabel: true,
                    items: [
                        {
                            xtype: 'syno_button',
                            btnStyle: 'green',
                            text: 'Save Changes',
                            handler: this.saveChanges.bind(this)
                        },

                    ]
                }
            ],
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    sortable: true,
                    menuDisabled: true,
                    width: 180,
                    height: 20
                },
                columns: [{
                    header: 'Name',
                    width: 60,
                    dataIndex: 'name'
                }, {
                    header: 'Verison',
                    width: 30,
                    dataIndex: 'version'
                }, {
                    header: 'Description',
                    width: 400,
                    dataIndex: 'description',
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        return value[currentLngCode] ?? value['en_US'];
                    }
                }, {
                    header: 'System',
                    width: 30,
                    dataIndex: 'system',
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        return value ? '✔️' : '';
                    }
                }, {
                    header: 'Installed',
                    width: 50,
                    dataIndex: 'installed',
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        if (!record.data.system)
                        return '<input type="checkbox" class="grid-checkbox-installed" ' +
                            (value ? 'checked="checked"' : '') +
                            ' data-row="' + row + '" data-record-id="' + record.data.name + '"/>';
                    }
                }]
            }),
            viewConfig: {
                forceFit: true,
                onLoad: Ext.emptyFn,
                listeners: {
                    beforerefresh: function (f) {
                        f.scrollTop = f.scroller.dom.scrollTop;
                    },
                    refresh: function (f) {
                        f.scroller.dom.scrollTop = f.scrollTop;
                    }
                }
            },
            columnLines: true,
            frame: false,
            bbar: paging,
            height: 400,
            renderTo: Ext.getBody(),
            cls: 'resource-monitor-performance',
            listeners: {
                scope: this,
                render: function (grid) {
                    grid.getStore().load({
                        params: {
                            offset: 0,
                            limit: 5
                        }
                    });
                },
                afterrender: function (grid) {
                    // Directly use the grid's 'el' property to attach the event listener
                    grid.el.on('change', function (e, t) {
                        if (t.className && t.className.indexOf('grid-checkbox-installed') > -1) {
                            var recordId = t.getAttribute('data-record-id');
                            var record = gridStore.getById(recordId);
                            if (record) {
                                record.set('installed', t.checked);
                            }
                        }
                        //collect installed modules
                        that['rrInstalledAddons'] = grid.getStore().getRange().filter(x => { return x.data.installed == true }).map((x) => {
                            return x.id
                        });
                    }, this, { delegate: 'input.grid-checkbox-installed' });
                }
            }
        };
        return new SYNO.ux.GridPanel(c);
    },

    onOpen: function (a) {
        SYNOCOMMUNITY.RRManager.AppWindow.superclass.onOpen.call(this, a);
        this.onRunTaskMountLoaderDiskClick();
        this.onGetConfigClick();
    }
});


