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
                title: "Server Calls",
                items: [
                    this.createDisplayCGI(),
                    this.createDisplayAPI(),
                    // this.createDisplayExternalAPI()
                ]
            });

            // Tab for Form components
            allTabs.push({
                title: "Form Components",
                layout: "fit",
                items: [
                    this.createStandardGUI(),
                    this.createAdvancedGUI()
                ]
            });

            // Tab for Menu & Toolbar components
            allTabs.push({
                title: "Menu & Toolbar Components",
                layout: "fit",
                items: [
                    this.createMenuGUI()
                ]
            });

            // Tab for User interaction
            allTabs.push({
                title: "User interaction",
                layout: "fit",
                items: [
                    this.createInteraction()
                ]
            });

            // Tab for Stores 1
            allTabs.push({
                title: "Stores 1",
                layout: "fit",
                items: [
                    this.createSynoStore(),
                    this.createSqlStore()
                ]
            });

            // Tab for Stores 2
            allTabs.push({
                title: "Stores 2",
                layout: "fit",
                items: [
                    this.createSynoAPIStore(),
                    this.createRatesStore()
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
                        text: 'Read RR User Config',
                        handler: this.onPythonCGIClick.bind(this)
                    }]
                }
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
    // Call C CGI on click
    onCGIClick: function () {
        Ext.Ajax.request({
            url: '/webman/3rdparty/rr-manager/test.cgi',
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
                window.alert('C CGI called :\n' + result);
            },
            failure: function (response) {
                window.alert('Request Failed.');

            }

        });

    },
    // Call Python CGI on click
    onPythonCGIClick: function () {
        Ext.Ajax.request({
            url: '/webman/3rdparty/rr-manager/python.cgi',
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
                var response = JSON.parse(result);
                Ext.getCmp('lbRrVersion').setValue(response.rr_version);
                console.log('--Response: ', result);
                // window.alert('Python CGI called :\n' + result);
            },
            failure: function (response) {
                window.alert('Request Failed.');
            }

        });

    },
    // Call Perl CGI on click
    onPerlCGIClick: function () {
        Ext.Ajax.request({
            url: '/webman/3rdparty/rr-manager/perl.cgi',
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
                window.alert('Perl CGI called :\n' + result);
            },
            failure: function (response) {
                window.alert('Request Failed.');

            }

        });

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

        var localUrl = "/webman/3rdparty/rr-manager/storepythonsynoapi.cgi";

        var gridStore = new SYNO.API.JsonStore({
            autoDestroy: true,
            url: localUrl,
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


    // Create the display of API Store
    createSynoAPIStore: function () {
        return new SYNO.ux.FieldSet({
            title: "Syno API Store",
            collapsible: true,
            autoHeight: true,
            items: [{
                xtype: "syno_compositefield",
                hideLabel: true,
                items: [
                    this.createAPIGrid()
                ]
            }



            ]
        });
    },

    // Create API Store grid calling Syno API  
    createAPIGrid: function () {

        var APIName = "SYNO.Core.TaskScheduler";

        var gridStore = new SYNO.API.JsonStore({
            api: APIName,
            method: "list",
            version: 2,
            root: "tasks",
            totalProperty: "total",
            fields: ["id", "name", "action"],
            remoteSort: true,
            sortInfo: {
                field: "name",
                direction: "ASC"
            },
            defaultParamNames: {
                sort: "sort_by",
                dir: "sort_direction"
            },
            baseParams: {
                start: 0,
                limit: this.TotalRecords
            },
            autoDestroy: false,
            autoLoad: false
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
                    header: "Id",
                    width: 20,
                    dataIndex: "id"
                }, {
                    header: "Name",
                    width: 60,
                    dataIndex: "name"
                }, {
                    header: "Action",
                    width: 100,
                    dataIndex: "action"
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

        var localUrl = "/webman/3rdparty/rr-manager/storebashratesapi.cgi";

        var gridStore = new SYNO.API.JsonStore({
            autoDestroy: true,
            url: localUrl,
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
    createSqlStore: function () {
        return new SYNO.ux.FieldSet({
            title: "Python SQLite Store",
            collapsible: true,
            autoHeight: true,
            items: [{
                xtype: "syno_compositefield",
                hideLabel: true,
                items: [
                    this.createSqlGrid()
                ]
            }



            ]
        });
    },

    // Create JSON Store grid calling python SQL API  
    createSqlGrid: function () {

        var localUrl = "/webman/3rdparty/rr-manager/storepythonsqlapi.cgi";

        var gridStore = new SYNO.API.JsonStore({
            autoDestroy: true,
            url: localUrl,
            restful: true,
            root: 'result',
            idProperty: 'identifier',
            fields: [{
                name: 'identifier',
                type: 'int'
            }, {
                name: 'title',
                type: 'string'
            }, {
                name: 'description',
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
                    width: 180,
                    height: 20
                },
                columns: [{
                    header: "Id",
                    width: 20,
                    dataIndex: "identifier"
                }, {
                    header: "Title",
                    width: 60,
                    dataIndex: "title"
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

    onOpen: function (a) {
        SYNOCOMMUNITY.RRManager.AppWindow.superclass.onOpen.call(this, a);
        var myMask = new Ext.LoadMask(Ext.getBody(), { msg: "Please wait..." });
        myMask.show();

        console.log("----onOpen");
        //TODO: run mount loader disk task
        this.onRunTaskMountLoaderDiskClick();
        //TODO: run read rr config api
        setTimeout(x => {
            this.onPythonCGIClick();
            myMask.hide();
        }, 1000);

        //TODO: fix install yaml package for python to read user-config.yml
        //TODO: implement mount/unmount loader disk tasks to call them from the app
    }
});

