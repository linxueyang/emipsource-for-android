Ext.define('YZSoft.login.Panel', {
    extend: 'Ext.Panel',

    constructor: function (config) {
        var me = this;

        me.banner = Ext.create('Ext.Component', {
            cls: 'logo-cnt',
            html: '<div class="logo"></div>'
        });

        me.uid = Ext.create('Ext.field.Text', {
            cls: 'x-field-first uid',
            label: '&nbsp;',
            labelWidth: '2.0em',
            clearIcon: true,
            placeHolder: $rs.LoginEmptyAccount
        });

        me.pwd = Ext.create('Ext.field.Password', {
            cls: 'pwd',
            label: '&nbsp;',
            labelWidth: '2.0em',
            clearIcon: true,
            placeHolder: $rs.LoginEmptyPassword
        });

        me.savepwd = Ext.create('Ext.field.Checkbox', {
            label: $rs.LoginChkSavePwd,
            labelAlign: 'right',
            margin: '3 0 3 10'
        });

        me.btnLogin = Ext.create('Ext.Button', {
            cls: 'yz-login-btn first',
            text: $rs.LoginBtnLogin,
            disabled: false,
            handler: function () {
                if (Ext.Mobile || Ext.iAnywhereUrlInternel) {
                    Ext.iAnywhereUrl = Ext.iAnywhereUrlInternel;
                    Ext.Loader.setPath({
                        'YZSoft': Ext.iAnywhereUrl + '/YZSoft'
                    });
                }

                me.login();
            }
        });

        me.btnLoginIntranet = Ext.create('Ext.Button', {
            cls: 'yz-login-btn internal-login',
            text: $rs.LoginBtnLoginIntranet,
            disabled: false,
            handler: function () {
                if (Ext.Mobile || Ext.iAnywhereUrlIntranet) {
                    Ext.iAnywhereUrl = Ext.iAnywhereUrlIntranet;
                    Ext.Loader.setPath({
                        'YZSoft': Ext.iAnywhereUrlIntranet + '/YZSoft'
                    });
                }

                me.login();
            }
        });

        me.btnHelp = Ext.create('Ext.Button', {
            align: 'left',
            text: $rs.LoginBtnHelp,
            handler: function () {
            }
        });

        me.btnSetting = Ext.create('Ext.Button', {
            align: 'right',
            text: $rs.LoginBtnSetting,
            handler: function () {
                var view = Ext.create('YZSoft$ux.view.Connection', { title: $rs.LoginBtnSettingServer, btnText: $rs.LoginBtnSettingOK, canBack: true });
                Ext.mainWin.push(view);
                //Ext.Viewport.setActiveItem(view);
            }
        });

        me.bottomBar = Ext.create('Ext.TitleBar', {
            cls: 'yz-login-bbar',
            //hidden: !Ext.Mobile || Ext.fixServerUrl,
            items: [me.btnHelp, me.btnSetting]
        });

        if (localStorage) {
            me.uid.setValue(localStorage.getItem('uid'));
            me.pwd.setValue(localStorage.getItem('pwd'));
            if (localStorage.getItem('savepwd') === '0')
                me.savepwd.uncheck();
            else
                me.savepwd.check();
        }

        var cfg = {
            cls: 'yz-login',
            scrollable: true,
            layout: 'vbox',
            items: [me.banner, me.uid, me.pwd, me.savepwd, me.btnLogin, me.btnLoginIntranet, { flex: 1 }, me.bottomBar]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        //this.mask({ xtype: 'circleprogressmask' });
        //this.mask({ xtype: 'circleprogressmask', circleWidth: 24, circleHeight: 24, hiddenMessage: true, borderWidth: 3 });
        //var mask = this.getMasked();
        //mask.setProgress(60);
        //me.aaa = Ext.create('YZSoft$ux.scroll.Mask', { docked: 'top', messages: ['下拉刷新1', '释放刷新', '刷新中请等待...'], scrollablePanel: me });
        //me.bbb = Ext.create('YZSoft$ux.scroll.Mask', { docked: 'bottom', messages: ['上拉刷新', '释放刷新', '刷新中请等待...'], scrollablePanel: me });
    },

    login: function () {
        if (navigator.connection) {
            if (navigator.connection.type == Connection.NONE) {
                alert($rs.NoConnection);
                return;
            }
        }

        var me = this,
            uid = me.uid.getValue(),
            pwd = me.pwd.getValue(),
            savepwd = me.savepwd.getChecked() ? 1 : 0;

        me.clearCatch();
        Ext.Viewport.mask({ message: $rs.Authenticating, cls: 'yz-mask-bg' });

        YZSoft.Ajax.request({
            timeout: 8000,
            url: YZSoft.$url('YZSoft.Services/core/Auth.ashx'),
            //waitMsg: { message: $rs.Authenticating, autoClose: false },
            delay: true,
            params: {
                Method: 'Login',
                uid:uid,
                pwd:pwd
            },
            success: function (action) {

                //添加扩展css
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = YZSoft.$url('app/resources/css/app.css');
                document.getElementsByTagName("head")[0].appendChild(link);

                RS.clearErrors();
                YZSoft.Globalization.JSLangInit.serverIndicated();

                YZSoft.LoginUser = action.result.user;
                try {
                    localStorage.setItem("uid", action.result.user.Account);
                    localStorage.setItem("pwd", params.savepwd ? params.pwd : '');
                    localStorage.setItem("savepwd", params.savepwd);
                }
                catch (exp) {
                    //alert(exp);
                }

                me.hadler(action);

                Ext.Viewport.unmask();
            },
            failure: function (action) {
                Ext.Viewport.unmask();
                alert(action.result.errorMessage, $rs.LoginFailedTitle);
            }
        });
    },

    hadler: function (action) {
        //Ext.mainWin = Ext.create(action.result.xclass || 'EMIP.view.Main', { id: 'mainWin' });
        //Ext.Viewport.add(Ext.mainWin);
        //Ext.Viewport.setActiveItem(Ext.mainWin);
    },

    clearCatch: function () {
        if (!Ext.Mobile)
            return;

        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
            function (fileSystem) {
                fileSystem.root.getDirectory("download", { create: false, exclusive: false },
                    function (entry) {
                        entry.removeRecursively();
                    }
                );
                fileSystem.root.getDirectory("FlowPortal", { create: false, exclusive: false },
                    function (entry) {
                        entry.removeRecursively();
                    }
                );
            }
        );
    }
});
