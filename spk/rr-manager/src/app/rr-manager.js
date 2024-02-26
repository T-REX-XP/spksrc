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
                id: "tabGeneral",
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
                id: "tabAddons",
                items: [
                    // this.createSynoStore(),
                    this.createAddonsStore()
                ]
            });

            allTabs.push({
                title: 'Update',
                layout: 'fit',
                id: "tabUpdate",
                name: "tabUpdate",
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
        that['rrInstalledAddons']?.forEach(addonName => {
            newAddons[addonName] = ''
        });

        that['rrConfigNew'] = that['rrConfig']['user_config'];
        that['rrConfigNew']['addons'] = newAddons;
        this.handleFileUpload(that['rrConfigNew']);
    },
    handleFileUpload: function (jsonData) {
        let url = `${this.API._prefix}uploadConfigFile.cgi`;
        return new Promise((resolve, reject) => {
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                jsonData: jsonData,
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (response) {
                    resolve(Ext.decode(response.responseText));
                },
                failure: function (response) {
                    reject('Failed with status: ' + response.status);
                }
            });
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
                    that.tabUpload.mask(_T("common", "loading"), "x-mask-loading");
                    that.onUploadFile(fileObject);
                    //TODO: implement sending file to /tmp/ with name update.zip
                }
            }]
        });
        this.tabUpload = myFormPanel.getForm().getEl();
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
                            handler: this.onRunRrUpdateManuallyClick.bind(this)
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
        callCustomScript: function (scriptName) {

            return new Promise((resolve, reject) => {
                Ext.Ajax.request({
                    url: `${this._prefix}${scriptName}`,
                    method: 'GET',
                    timeout: 60000,
                    headers: {
                        'Content-Type': 'text/html'
                    },
                    success: function (response) {
                        resolve(Ext.decode(response.responseText));
                    },
                    failure: function (response) {
                        reject('Failed with status: ' + response.status);
                    }
                });
            });
        }
    },

    onRunTaskMountLoaderDiskClick: function () {
        this.API.runTask('MountLoaderDisk');
    },
    onRunTaskUnMountLoaderDiskClick: function () {
        this.API.runTask('UnMountLoaderDisk');
    },
    _showUpdateconfirmDialog: function (text, yesCallback) {
        var window = new SYNO.SDS.ModalWindow({
            closeAction: "hide",
            layout: "fit",
            width: 400,
            height: 200,
            resizable: !1,
            title: "RR Update confirmation dialog",
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
                    if (yesCallback) yesCallback();
                    window.close();
                }
            }],
            items: [{
                xtype: 'syno_displayfield',
                value: text,
            }
            ],
        });
        window.open();
    },
    onRunRrUpdateManuallyClick: function () {
        that = this;
        this.API.callCustomScript('readUpdateFile.cgi').then((responseText) => {
            if (!responseText) {
                window.alert('Unable to read the update file! Please upload file /tmp/update.zip and try againe.');
                return;
            }

            var configName = 'rrUpdateFileVersion';
            that[configName] = responseText;
            let currentRrVersion = that["rrConfig"]?.rr_version;
            let updateRrVersion = that[configName].updateVersion;

            async function runUpdate() {
                console.log('--in Run update');
                that.API.runTask('RunRrUpdate');
                //TODO: run check progress in setinterval in 2 second
                //var interval = setInterval(function(){
                var responseText = await that.API.callCustomScript('checkUpdateStatus.cgi?filename=rr_update_progress');
                window.alert('--CheckUpdateStatus response status: '+ responseText.result.errmsg);
                // }, 1000);
            }
            that._showUpdateconfirmDialog(
                `Curent RR version: ${currentRrVersion}. Update file version: ${updateRrVersion}`,
                runUpdate);
        });
    },
    // Call Python CGI on click
    onGetConfigClick: function () {
        that = this;
        this.API.callCustomScript('getConfig.cgi').then((responseText) => {
            var configName = 'rrConfig';
            that[configName] = responseText;
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
        this.messageBoxProvider = new SYNO.SDS.MessageBoxV5({
            owner: this,
            preventDelay: true,
            draggable: false
        });
    },
    sendArray: function (e, t, i, o, r) {
        var that = this;
        if ("CANCEL" !== t.status) {
            var n, s = {}, l = {};
            if (!0 === t.chunkmode)
                if (l = {
                    "Content-Type": "multipart/form-data; boundary=" + e.boundary
                },
                    s = {
                        "X-TYPE-NAME": "SLICEUPLOAD",
                        "X-FILE-SIZE": t.size,
                        "X-FILE-CHUNK-END": 1 > o.total || o.index === o.total - 1 ? "true" : "false"
                    },
                    r && Ext.apply(s, {
                        "X-TMP-FILE": r
                    }),
                    window.XMLHttpRequest.prototype.sendAsBinary)
                    n = e.formdata + ("" !== i ? i : "") + "\r\n--" + e.boundary + "--\r\n";
                else if (window.Blob) {
                    var a, d = 0, p = 0, h = 0, c = "\r\n--" + e.boundary + "--\r\n", f = e.formdata.length + c.length;
                    for (h = Ext.isString(i) ? i.length : new Uint8Array(i).byteLength,
                        a = new Uint8Array(f += h),
                        d = 0; d < e.formdata.length; d++)
                        a[d] = e.formdata.charCodeAt(d);
                    if (Ext.isString(i))
                        for (p = 0; p < i.length; p++)
                            a[d + p] = i.charCodeAt(p);
                    else
                        a.set(new Uint8Array(i), d);
                    for (d += h,
                        p = 0; p < c.length; p++)
                        a[d + p] = c.charCodeAt(p);
                    n = a
                } else {
                    var u;
                    window.MSBlobBuilder ? u = new MSBlobBuilder : window.BlobBuilder && (u = new BlobBuilder),
                        u.append(e.formdata),
                        "" !== i && u.append(i),
                        u.append("\r\n--" + e.boundary + "--\r\n"),
                        n = u.getBlob(),
                        u = null
                }
            else
                e.append("size", t.size),
                    t.name ? e.append(this.opts.filefiledname, t, this.opts.params.fileName) : e.append(this.opts.filefiledname, t.file),
                    n = e;
            this.conn = new Ext.data.Connection({
                method: "POST",
                url: `${that.API._baseUrl}api=SYNO.FileStation.Upload&method=upload&version=2&SynoToken=${localStorage["SynoToken"]}`,
                defaultHeaders: l,
                timeout: null
            });
            var m = this.conn.request({
                headers: s,
                html5upload: !0,
                chunkmode: t.chunkmode,
                uploadData: n,
                success: (x) => {
                    that?.tabUpload?.unmask();
                    that.messageBoxProvider.alert("title", "File has been successfully uploaded to the downloads folder.", function (d, e) { });
                    that.API.runTask('MoveUpdateToTmp');
                },
                failure: (x) => {
                    that?.tabUpload?.unmask();
                    that.messageBoxProvider.alert("title", "Error file uploading.", function (d, e) { });
                    console.log(x);
                },
                progress: (x) => { },
            });
        }
    },
    MAX_POST_FILESIZE: Ext.isWebKit ? -1 : window.console && window.console.firebug ? 20971521 : 4294963200,
    onUploadFile: function (e) {
        //rename file to update.zip
        e = new File([e], this.opts.params.filename);
        var t, i = !1;
        if (-1 !== this.MAX_POST_FILESIZE && e.size > this.MAX_POST_FILESIZE && i)
            this.onError({
                errno: {
                    section: "error",
                    key: "upload_too_large"
                }
            }, e);
        else if (t = this.prepareStartFormdata(e), e.chunkmode) {
            var o = this.opts.chunksize,
                r = Math.ceil(e.size / o);
            this.onUploadPartailFile(t, e, {
                start: 0,
                index: 0,
                total: r
            })
        } else
            this.sendArray(t, e)
    },
    opts: {
        chunkmode: false,
        filefiledname: "file",
        file: function (t) {
            var FileObj = function (e, t, i, o) {
                var r = SYNO.SDS.copy(t || {})
                    , n = SYNO.webfm.utils.getLastModifiedTime(e);
                return n && (r = Ext.apply(r, {
                    mtime: n
                })),
                {
                    id: i,
                    file: e,
                    dtItem: o,
                    name: e.name || e.fileName,
                    size: e.size || e.fileSize,
                    progress: 0,
                    status: "NOT_STARTED",
                    params: r,
                    chunkmode: !1
                }
            }

            mtime = SYNO.webfm.utils.getLastModifiedTime(t);
            var i = new FileObj(t, { mtime: mtime });
            return i;
        },
        params: {
            path: "/downloads",
            filename: "update.zip",
            overwrite: true
        }
    },
    prepareStartFormdata: function (e) {
        e.chunkmode = (-1 !== this.MAX_POST_FILESIZE && e.size > this.MAX_POST_FILESIZE);
        if (this.opts.chunkmode) {
            var boundary = "----html5upload-" + (new Date).getTime().toString() + Math.floor(65535 * Math.random()).toString();
            var contentPrefix = "";

            if (this.opts.params)
                for (var paramName in this.opts.params) {
                    if (this.opts.params.hasOwnProperty(paramName)) {
                        contentPrefix += "--" + boundary + '\r\n';
                        contentPrefix += 'Content-Disposition: form-data; name="' + paramName + '"\r\n\r\n';
                        contentPrefix += unescape(encodeURIComponent(this.opts.params[paramName])) + "\r\n";
                    }
                }

            if (e.params)
                for (var paramName in e.params) {
                    if (e.params.hasOwnProperty(paramName)) {
                        contentPrefix += "--" + boundary + '\r\n';
                        contentPrefix += 'Content-Disposition: form-data; name="' + paramName + '"\r\n\r\n';
                        contentPrefix += unescape(encodeURIComponent(e.params[paramName])) + "\r\n";
                    }
                }

            var filename = unescape(encodeURIComponent(e.name));
            contentPrefix += "--" + boundary + '\r\n';
            contentPrefix += 'Content-Disposition: form-data; name="' + (this.opts.filefiledname || "file") + '"; filename="' + filename + '"\r\n';
            contentPrefix += 'Content-Type: application/octet-stream\r\n\r\n';

            return {
                formdata: contentPrefix,
                boundary: boundary
            };
        } else {
            var formData = new FormData();

            if (this.opts.params)
                for (var paramName in this.opts.params) {
                    if (this.opts.params.hasOwnProperty(paramName)) {
                        formData.append(paramName, this.opts.params[paramName]);
                    }
                }

            if (e.params)
                for (var paramName in e.params) {
                    if (e.params.hasOwnProperty(paramName)) {
                        formData.append(paramName, e.params[paramName]);
                    }
                }

            return formData;
        }
    },
    onUploadPartailFile: function (e, t, i, o) {
        i.start = i.index * this.opts.chunksize;
        var chunkSize = Math.min(this.opts.chunksize, t.size - i.start);

        if ("PROCESSING" === t.status) {
            var fileSlice;

            if (window.File && File.prototype.slice) {
                fileSlice = t.file.slice(i.start, i.start + chunkSize);
            } else if (window.File && File.prototype.webkitSlice) {
                fileSlice = t.file.webkitSlice(i.start, i.start + chunkSize);
            } else if (window.File && File.prototype.mozSlice) {
                fileSlice = t.file.mozSlice(i.start, i.start + chunkSize);
            } else {
                this.onError({}, t);
                return;
            }

            this.sendArray(e, t, fileSlice, i, o);
        }
    }
});


