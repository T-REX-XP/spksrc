// Namespace definition
Ext.ns("SYNOCOMMUNITY.RRManager");

// Application definition
Ext.define("SYNOCOMMUNITY.RRManager.AppInstance", {
    extend: "SYNO.SDS.AppInstance",
    appWindowName: "SYNOCOMMUNITY.RRManager.AppWindow",
    constructor: function () {
        this.callParent(arguments)
    }
});

// Window definition
Ext.define("SYNOCOMMUNITY.RRManager.AppWindow", {
    extend: "SYNO.SDS.AppWindow",
    appInstance: null,
    tabs: null,
    constructor: function (config) {
        this.appInstance = config.appInstance;

        this.tabs = (function () {
            var allTabs = [];

            // Tab for CGI or API calls
            allTabs.push({
                title: "General",
                items: [
                    //this.createSystemInfoPannel(),
                    this.createDisplayCGI(),
                    this.createDisplayAPI(),
                    // this.createDisplayExternalAPI()
                ]
            });


            // Tab for Stores 1
            allTabs.push({
                title: "Addons",
                layout: "fit",
                items: [
                    // this.createSynoStore(),
                    this.createAddonsStore()
                ]
            });

            // // Tab for Stores 2
            // allTabs.push({
            //     title: "Modules",
            //     layout: "fit",
            //     items: [
            //         this.createModulesStore(),
            //     ]
            // });

            allTabs.push({
                title: "Update",
                layout: "fit",
                items: [
                    this.createUploadPannel()
                ]
            });

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
        that["rrInstalledAddons"]?.forEach(addonName => {
            newAddons[addonName] = ""
        });

        that["rrConfigNew"] = that["rrConfig"];
        that["rrConfigNew"]["addons"] = newAddons;
        //TODO: rewrite the config on the fs
        console.log("newRrConfig:", that["rrConfigNew"]);
    },
    createUploadPannel: function () {
        var that = this;
        async function handleFileUpload(file, url, parent) {
            const CHUNK_SIZE = 8 * 1024 * 1024; // 1MB
            let start = 0;
            while (start < file.size) {
                let end = Math.min(file.size, start + CHUNK_SIZE);
                let chunk = file.slice(start, end);

                let formData = new FormData();
                formData.append('file', chunk);
                formData.append('filename', "update.zip");
                formData.append('create_parents', true);
                formData.append('path', "/docker");
                formData.append('overwrite', true);

                // Include other parameters as needed
                try {
                    const response = await fetch(url, { // Append your session ID (_sid) as required
                        method: 'POST',
                        body: formData,
                        headers:{
                            "Content-Type": "multipart/form-data; boundary=" + "e.boundary"
                        }
                    });
                    if (!response.ok) throw new Error('Upload failed');
                    // Handle response here
                    console.log(`Uploaded chunk from ${start} to ${end}`);
                } catch (error) {
                    console.error('Error uploading chunk', error);
                    parent.getEl().unmask();
                }
                start += CHUNK_SIZE;
            }
            parent.getEl().unmask();
        }
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
                text: _T("ldap", "upload"),
                xtype: "syno_button",
                btnStyle: "green",
                handler: function () {
                    var form = myFormPanel.getForm();
                    var fileObject = form.el.dom[1].files[0];
                    if (form.isValid()) {
                        //show progress indicator
                        form.getEl().mask(_T("common", "loading"), "x-mask-loading");
                        handleFileUpload(fileObject, form.url, form);
                    }
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
    createDisplayCGI: function () {
        return new SYNO.ux.FieldSet({
            title: "General",
            collapsible: true,
            items: [
                // TextField
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'RR Version:',
                        width: 100
                    }, {
                        xtype: "syno_displayfield",
                        fieldLabel: "TextField: ",
                        value: "version",
                        id: "lbRrVersion"
                    }]
                },


            ]
        });
    },
    // Create the display of API calls
    createDisplayAPI: function () {
        return new SYNO.ux.FieldSet({
            title: "RR Loader Actions",
            collapsible: true,
            items:
                [
                    {
                        xtype: "syno_compositefield",
                        hideLabel: true,
                        items: [{
                            xtype: 'syno_displayfield',
                            value: 'Run task: ',
                            width: 140
                        }, {
                            xtype: "syno_button",
                            btnStyle: "green",
                            text: 'Mount the loader disk',
                            handler: this.onRunTaskMountLoaderDiskClick.bind(this)
                        }]
                    },
                    {
                        xtype: "syno_compositefield",
                        hideLabel: true,
                        items: [{
                            xtype: 'syno_displayfield',
                            value: 'Run task: ',
                            width: 140
                        }, {
                            xtype: "syno_button",
                            btnStyle: "red",
                            text: 'UnMount the loader disk',
                            handler: this.onRunTaskUnMountLoaderDiskClick.bind(this)
                        }]
                    },
                    // Core Storage API
                    {
                        xtype: "syno_compositefield",
                        hideLabel: true,
                        items: [{
                            xtype: 'syno_displayfield',
                            value: 'Core.Storage.Volume',
                            width: 140
                        }, {
                            xtype: "syno_button",
                            btnStyle: "green",
                            text: 'Call API ',
                            handler: this.onAPIStorageClick.bind(this)
                        }]
                    },
                    {
                        xtype: "syno_compositefield",
                        hideLabel: true,
                        items: [{
                            xtype: 'syno_displayfield',
                            value: 'Get RR config:',
                            width: 140
                        }, {
                            xtype: "syno_button",
                            btnStyle: "blue",
                            text: 'Read RR Update File',
                            handler: this.onReadUpdateFileClick.bind(this)
                        }]
                    }
                ]
        });
    },
    // Create the display of external API calls
    createDisplayExternalAPI: function () {
        return new SYNO.ux.FieldSet({
            title: "Call to external API",
            collapsible: true,
            items: [{
                xtype: "syno_compositefield",
                hideLabel: true,
                items: [{
                    xtype: 'syno_displayfield',
                    value: 'www.boredapi.com',
                    width: 140
                }, {
                    xtype: "syno_button",
                    btnStyle: "orange",
                    text: 'Words of Day',
                    handler: this.onExternalAPIClick.bind(this)
                }]
            }]
        });
    },
    // Create the display of Form Components / Standard
    createStandardGUI: function () {
        return new SYNO.ux.FieldSet({
            title: "Standard",
            collapsible: true,
            autoHeight: true,
            items: [

                // Button
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'Button :',
                        width: 100
                    }, {
                        xtype: "syno_button",
                        text: "Confirm"
                    }]
                },

                // TextField
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'TextField :',
                        width: 100
                    }, {
                        xtype: "syno_textfield",
                        fieldLabel: "TextField: ",
                        value: "Text"
                    }]
                },
                // Checkbox
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'Checkbox :',
                        width: 100
                    }, {
                        xtype: "syno_checkbox",
                        boxLabel: "Activate option"
                    }]
                },
                // DateTime
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'DateTime :',
                        width: 100
                    },
                    {
                        xtype: "syno_datetimefield",
                        name: "searchdatefrom",
                        editable: !1,
                        emptyText: "date_from",
                        hideClearButton: !0,
                        listeners: {
                            select: function (e, t) {
                                // put logic here 
                            }
                        }
                    }
                    ]
                },
                // Date
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'Date :',
                        width: 100
                    },
                    {
                        xtype: "syno_datefield",
                        name: "searchddateto",
                        editable: !1,
                        emptyText: "date_to",
                        hideClearButton: !0,
                        listeners: {
                            select: function (e, t) {
                                // put logic here 
                            }
                        }
                    }
                    ]
                },
                // NumberField
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'Number :',
                        width: 100
                    },
                    {
                        xtype: "syno_numberfield",
                        name: "columnNumber",
                        value: "45",
                        width: 60,
                        minValue: 2,
                        maxValue: 512
                    }
                    ]
                },
                // Combobox            
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'ComboBox :',
                        width: 100
                    }, {
                        xtype: "syno_combobox",
                        store: this.createTimeItemStore("min"),
                        displayField: "display",
                        itemId: "minute",
                        valueField: "value",
                        value: 0,
                        triggerAction: "all",
                        width: 145,
                        mode: "local",
                        editable: false
                    }]
                },
                // TextArea
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'TextArea :',
                        width: 100
                    }, {
                        xtype: "syno_textarea",
                        margins: "0 0 0 0",
                        name: "url",
                        width: 476,
                        height: 68,
                        autoFlexcroll: !0,
                        selectOnFocus: !0
                    }]
                },
                // Radio Button
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'Radio :',
                        width: 100
                    }, {
                        xtype: "syno_radio",
                        name: "policy",
                        checked: true,
                        boxLabel: "Option 1",
                        inputValue: 1
                    }]
                },
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: '',
                        width: 100
                    }, {
                        xtype: "syno_radio",
                        name: "policy",
                        boxLabel: "Option 2",
                        inputValue: 2
                    }]
                }
            ]
        });
    },
    // Create the display of Form Components / Advanced
    createAdvancedGUI: function () {
        return new SYNO.ux.FieldSet({
            title: "Advanced",
            collapsible: true,
            autoHeight: true,
            items: [
                // SplitButton
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'SplitButton',
                        width: 100
                    },
                    {
                        xtype: "syno_splitbutton",
                        text: "export",
                        menu: {
                            items: [{
                                text: "HTML type",
                                handler: {}
                            }, {
                                text: "CSV_type",
                                handler: {}
                            }]
                        }
                    }
                    ]
                },
                // ColorField
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'ColorField',
                        width: 100
                    },

                    {
                        xtype: "syno_colorfield",
                        value: "#993300"
                    }
                    ]
                },
                // Switch
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'Switch',
                        width: 100
                    },

                    {
                        xtype: "syno_switch",
                        width: 80
                    }
                    ]
                },
                // TimeField
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: 'syno_displayfield',
                        value: 'TimeField',
                        width: 100
                    },

                    {
                        xtype: "syno_timefield",
                        value: "test",
                    }
                    ]
                }


            ]
        });
    },
    // Create the display of Menu & Toolbar Components / Standard
    createMenuGUI: function () {
        return new SYNO.ux.FieldSet({
            title: "Standard",
            collapsible: true,
            autoHeight: true,
            items: [{
                xtype: "syno_compositefield",
                hideLabel: true,
                items: [{
                    xtype: 'syno_displayfield',
                    value: 'Menu :',
                    width: 100
                },
                {
                    xtype: "syno_button",
                    text: "Menu button",
                    menu: {
                        items: [{
                            text: "Undo",
                            disabled: true
                        }, {
                            text: "Redo",
                            disabled: true
                        }, {
                            xtype: "menuseparator"
                        }, {
                            text: "Select All",
                            disabled: false
                        }, {
                            xtype: "menuseparator"
                        }, {
                            text: "Lang",
                            hideOnClick: false,
                            disabled: false,
                            menu: {
                                xtype: "syno_menu",
                                items: [{
                                    text: "FR"
                                }, {
                                    text: "US"
                                }]
                            }
                        }]
                    }
                }


                ]
            }



            ]
        });
    },

    // Create the display of User Interaction
    createInteraction: function () {
        return new SYNO.ux.FieldSet({
            title: "Standard",
            collapsible: true,
            autoHeight: true,
            items: [{
                xtype: "syno_compositefield",
                hideLabel: true,
                items: [{
                    xtype: 'syno_displayfield',
                    value: 'ModalWindow',
                    width: 100
                },
                {
                    xtype: "syno_button",
                    text: 'Open window',
                    handler: this.onModalButtonClick.bind(this)
                }


                ]
            }



            ]
        });
    },

    // Handle display for ModalWindow
    onModalButtonClick: function () {

        var window = new SYNO.SDS.ModalWindow({
            closeAction: "hide",
            layout: "fit",
            width: 400,
            height: 200,
            resizable: !1,
            title: "Make a choice",
            buttons: [{
                text: "Cancel",
                // Handle Cancel
                handler: function () {
                    window.close();
                }
            }, {
                text: "Confirm",
                itemId: "confirm",
                btnStyle: "blue",
                // Handle Confirm
                handler: function () {
                    window.close();
                }
            }],
            items: [{
                xtype: 'syno_displayfield',
                value: 'Do you want to continue the demo ?',
            }
            ],
        });
        window.open();
    },

    // Create the content for the ComboBox
    createTimeItemStore: function (e) {
        var a = [];
        var c = {
            hour: 24,
            min: 60
        };
        if (e in c) {
            for (var d = 0; d < c[e]; d++) {
                a.push([d, String.leftPad(String(d), 2, "0")])
            }
            var b = new Ext.data.SimpleStore({
                id: 0,
                fields: ["value", "display"],
                data: a
            });
            return b
        }
        return null
    },
    onRunTaskMountLoaderDiskClick: function () {
        //https://www.synology.com/en-us/support/developer#tool
        //https://help.synology.com/developer-guide/integrate_dsm/config.html
        //https://www.reddit.com/r/synology/comments/18kl287/api_access_issues_with_dsm7_via_php_script/
        var t = 'webapi/entry.cgi?' + 'api=SYNO.Entry.Request&method=request&version=1&stop_when_error=false&mode="sequential"&compound=[{"api":"SYNO.Core.EventScheduler","method":"run","version":1,"task_name":"MountLoaderDisk"}]';
        Ext.Ajax.request({
            url: t,
            method: 'GET',
            timeout: 60000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (response) {
                //  window.alert('API returned raw list  : ' + response.responseText);
            },
            failure: function (response) {
                window.alert('Request Failed to mount loader disk.');
            }
        });
    },
    onRunTaskUnMountLoaderDiskClick: function () {
        var t = 'webapi/entry.cgi?' + 'api=SYNO.Entry.Request&method=request&version=1&stop_when_error=false&mode="sequential"&compound=[{"api":"SYNO.Core.EventScheduler","method":"run","version":1,"task_name":"UnMountLoaderDisk"}]';
        Ext.Ajax.request({
            url: t,
            method: 'GET',
            timeout: 60000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (response) {
                window.alert('Loader disk has been unmounted  : ' + response.responseText);
            },
            failure: function (response) {
                window.alert('Request Failed.');
            }
        });
    },
    // Call Syno Core API on click
    onAPIClick: function () {
        var t = this.getBaseURL({
            api: "SYNO.Core.System",
            method: "info",
            version: 3
        });
        Ext.Ajax.request({
            url: t,
            method: 'GET',
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (response) {
                var data = Ext.decode(response.responseText).data;
                var cpu_family = data.cpu_family;
                var cpu_clock = data.cpu_clock_speed;
                var ram_size = data.ram_size;
                var firmware_ver = data.firmware_ver;
                var temp = data.sys_temp;
                window.alert('API returned info : cpu family = ' + cpu_family + ', cpu clock speed = ' + cpu_clock + ', ram size = ' + ram_size + ', temperature = ' + temp + ', firmware ver = ' + firmware_ver);
            },
            failure: function (response) {
                window.alert('Request Failed.');

            }
        });

    },
    // Call Syno Storage API on click
    onAPIStorageClick: function () {
        var t = this.getBaseURL({
            api: "SYNO.Core.Storage.Volume",
            method: "list",
            params: {
                limit: -1,
                offset: 0,
                location: "internal",
                option: "include_cold_storage"
            },
            version: 1
        });
        Ext.Ajax.request({
            url: t,
            method: 'GET',
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (response) {
                window.alert('API returned raw list  : ' + response.responseText);
            },
            failure: function (response) {
                window.alert('Request Failed.');

            }
        });

    },
    // Call external API on click
    onExternalAPIClick: function () {
        Ext.Ajax.request({
            url: '/webman/3rdparty/rr-manager/externalapi.cgi',
            method: 'GET',
            timeout: 60000,
            params: {
                id: 1 // add params if needed
            },
            headers: {
                'Content-Type': 'text/html'
            },
            success: function (response) {
                var result = response.responseText;
                window.alert('External API called : ' + result);
            },
            failure: function (response) {
                window.alert('Request Failed.');

            }

        });
    },
    // Call bash CGI on click
    onBashCGIClick: function () {
        Ext.Ajax.request({
            url: '/webman/3rdparty/rr-manager/bash.cgi',
            method: 'GET',
            timeout: 60000,
            params: {
                id: 1 // add params if needed
            },
            headers: {
                'Content-Type': 'text/html'
            },
            success: function (response) {
                var result = response.responseText;
                window.alert('Bash CGI called : ' + result);
            },
            failure: function (response) {
                window.alert('Request Failed.');

            }

        });
    },
    onReadUpdateFileClick: function () {
        that = this;
        Ext.Ajax.request({
            url: '/webman/3rdparty/rr-manager/readUpdateFile.cgi',
            method: 'GET',
            timeout: 60000,
            params: {
                id: 1 // add params if needed
            },
            headers: {
                'Content-Type': 'text/html'
            },
            success: function (response) {
                var configName = "rrConfig";
                that[configName] = JSON.parse(response.responseText);
                sessionStorage.setItem(configName, response.responseText);
                that.populateSystemInfoPanel(that[configName]);
            },
            failure: function (response) {
                window.alert('Request Failed.');
            }
        });
    },
    // Call Python CGI on click
    onGetConfigClick: function () {
        that = this;
        Ext.Ajax.request({
            url: '/webman/3rdparty/rr-manager/getConfig.cgi',
            method: 'GET',
            timeout: 60000,
            params: {
                id: 1 // add params if needed
            },
            headers: {
                'Content-Type': 'text/html'
            },
            success: function (response) {
                var configName = "rrConfig";
                that[configName] = JSON.parse(response.responseText);
                sessionStorage.setItem(configName, response.responseText);
                that.populateSystemInfoPanel(that[configName]);
            },
            failure: function (response) {
                window.alert('Request Failed.');
            }
        });
    },
    populateSystemInfoPanel: function (config) {
        Ext.getCmp('lbRrVersion').setValue(config.rr_version);
        var userConfig = config.user_config;
        if (!userConfig) return;


        var panel = Ext.getCmp('deviceInfoPanel');
        // Function to handle adding both simple and complex (nested objects) properties
        var addItems = function (object, prefix) {
            var ignoreKeys = ["addons", "modules"];
            for (var key in object) {
                if (ignoreKeys.indexOf(key) >= 0) return;

                var value = object[key];
                var fieldLabel = prefix ? prefix + "." + key : key; // Handle nested keys

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
    // Stores
    //

    // Grid search 
    createFilter: function (gridStore) {
        var searchField = new SYNO.ux.TextFilter({
            emptyText: "Search",
            store: gridStore,
            pageSize: 5,
            width: 300
        });

        var toolbar = new SYNO.ux.Toolbar({
            items: [searchField]
        });

        return toolbar;
    },

    // Create the display of Syno Store
    createSynoStore: function () {
        return new SYNO.ux.FieldSet({
            title: "Python Package Store",
            collapsible: true,
            autoHeight: true,
            items: [{
                xtype: "syno_compositefield",
                hideLabel: true,
                items: [
                    this.createGrid()
                ]
            }
            ]
        });
    },

    // Create JSON Store grid calling python API  
    createGrid: function () {
        var gridStore = new SYNO.API.JsonStore({
            autoDestroy: true,
            url: "/webman/3rdparty/rr-manager/storepythonsynoapi.cgi",
            restful: true,
            root: 'result',
            idProperty: 'identifier',
            fields: [{
                name: 'identifier',
                type: 'int'
            }, {
                name: 'pkg_name',
                type: 'string'
            }, {
                name: 'pkg_desc',
                type: 'string'
            }]
        });

        var paging = new SYNO.ux.PagingToolbar({
            store: gridStore,
            displayInfo: true,
            pageSize: 5,
            refreshText: "Reload"
        });

        var c = {
            store: gridStore,
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    sortable: true,
                    menuDisabled: true,
                    width: 100,
                    height: 20
                },
                columns: [{
                    header: "Id",
                    width: 20,
                    dataIndex: "identifier"
                }, {
                    header: "Pkg name",
                    width: 50,
                    dataIndex: "pkg_name"
                }, {
                    header: "Description",
                    width: 300,
                    dataIndex: "pkg_desc"
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
            height: 200,
            cls: "resource-monitor-performance",
            listeners: {
                scope: this,
                render: function (grid) {
                    grid.getStore().load({
                        params: {
                            offset: 0,
                            limit: 5
                        }
                    });
                }
            }
        };
        return new SYNO.ux.GridPanel(c);
    },


    // Create the display of modules
    createModulesStore: function () {
        return new SYNO.ux.FieldSet({
            title: "Modules",
            collapsible: true,
            autoHeight: true,
            items: [{
                xtype: "syno_compositefield",
                hideLabel: true,
                items: [
                    this.createModulesGrid()
                ]
            }
            ]
        });
    },

    // Create API Store grid calling Syno API  
    createModulesGrid: function () {
        var rrConfigJson = sessionStorage.getItem("rrConfig");
        var rrConfig = rrConfigJson ? JSON.parse(rrConfigJson) : {
            user_config: {
                modules: {

                }
            }
        };
        var modules = [];
        Object.keys(rrConfig.user_config.modules).forEach(moduleName => {
            modules.push({
                name: moduleName,
                version: "1.0",
                description: "",
                system: false,
                installed: false
            });
        });
        var gridStore = new SYNO.API.JsonStore({
            autoDestroy: true,
            data: {
                result: modules
            },
            load: function () {
                return Promise.resolve(this.data);
            },
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
                type: 'string'
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
            pageSize: 10,
            refreshText: "Reload"
        });

        var c = {
            store: gridStore,
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    sortable: true,
                    menuDisabled: true,
                    width: 180,
                    height: 20
                },
                columns: [{
                    header: "Name",
                    width: 20,
                    dataIndex: "name"
                }, {
                    header: "Version",
                    width: 60,
                    dataIndex: "version"
                }, {
                    header: "Description",
                    width: 100,
                    dataIndex: "description"
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
            cls: "resource-monitor-performance",
            listeners: {
                scope: this,
                render: function (grid) {
                    grid.getStore().load({
                        params: {
                            offset: 0,
                            limit: 10
                        }
                    });
                }
            }
        };
        return new SYNO.ux.GridPanel(c);
    },


    // Create the display of Rates Store
    createRatesStore: function () {
        return new SYNO.ux.FieldSet({
            title: "Bash Rates Store",
            collapsible: true,
            autoHeight: true,
            items: [{
                xtype: "syno_compositefield",
                hideLabel: true,
                items: [
                    this.createRatesGrid()
                ]
            }
            ]
        });
    },

    // Create JSON Store grid calling bash API  
    createRatesGrid: function () {
        var gridStore = new SYNO.API.JsonStore({
            autoDestroy: true,
            url: "/webman/3rdparty/rr-manager/storebashratesapi.cgi",
            restful: true,
            root: 'result',
            idProperty: 'key',
            fields: [{
                name: 'key',
                type: 'string'
            }, {
                name: 'value',
                type: 'string'
            }]
        });

        var paging = new SYNO.ux.PagingToolbar({
            store: gridStore,
            displayInfo: true,
            pageSize: 5,
            refreshText: "Reload"
        });

        var c = {
            store: gridStore,
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    sortable: true,
                    menuDisabled: true,
                    width: 80,
                    height: 20
                },
                columns: [{
                    header: "Currency",
                    width: 30,
                    dataIndex: "key"
                }, {
                    header: "USD rate",
                    width: 50,
                    dataIndex: "value"
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
            height: 200,
            cls: "resource-monitor-performance",
            listeners: {
                scope: this,
                render: function (grid) {
                    grid.getStore().load({
                        params: {
                            offset: 0,
                            limit: 5
                        }
                    });
                }
            }
        };


        return new SYNO.ux.GridPanel(c);

    },
    // Create the display of SQL Store
    createAddonsStore: function () {
        return new SYNO.ux.FieldSet({
            // title: "Addons",
            collapsible: false,
            autoHeight: true,
            items: [{
                xtype: "syno_compositefield",
                hideLabel: true,
                items: [
                    this.createAddonsGrid()
                ]
            }
            ]
        });
    },
    // Create JSON Store grid calling python SQL API  
    createAddonsGrid: function () {
        var that = this;
        function getLng(lng) {
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
                'rus': 'uk-UA', // Russian in Russia
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
                ? localeMapping[lng] : localeMapping["enu"];
        }

        var currentLngCode = getLng(SYNO.SDS.UserSettings.data.Personal.lang)

        var gridStore = new SYNO.API.JsonStore({
            autoDestroy: true,
            url: '/webman/3rdparty/rr-manager/getAddons.cgi',
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
            refreshText: "Reload"
        });

        var c = {
            store: gridStore,
            id: "gridAddons",
            tbar: [
                {
                    xtype: "syno_compositefield",
                    hideLabel: true,
                    items: [
                        {
                            xtype: "syno_button",
                            btnStyle: "green",
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
                    header: "Name",
                    width: 60,
                    dataIndex: "name"
                }, {
                    header: "Verison",
                    width: 30,
                    dataIndex: "version"
                }, {
                    header: "Description",
                    width: 400,
                    dataIndex: "description",
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        return value[currentLngCode] ?? value["en_US"];
                    }
                }, {
                    header: "System",
                    width: 30,
                    dataIndex: "system",
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        return value ? "✔️" : "";
                    }
                }, {
                    header: "Installed",
                    width: 50,
                    dataIndex: "installed",
                    renderer: function (value, metaData, record, row, col, store, gridView) {
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
            cls: "resource-monitor-performance",
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
                        that["rrInstalledAddons"] = grid.getStore().getRange().filter(x => { return x.data.installed == true }).map((x) => {
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


