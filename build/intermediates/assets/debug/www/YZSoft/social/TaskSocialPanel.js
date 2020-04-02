
Ext.define('YZSoft.social.TaskSocialPanel', {
    extend: 'Ext.Container',
    config: {
        tid: null
    },

    constructor: function (config) {
        var me = this;

        me.btnBack = Ext.create('Ext.Button', {
            text: '返回',
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.btnForm = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'right',
            handler: function () {
            }
        });

        me.cnt = Ext.create('Ext.Panel', {
            items: []
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '任务',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.pnlSocial = Ext.create('YZSoft.src.panel.Social', {
            resType: 'task',
            resId: config.tid
        });

        var cfg = {
            layout: 'fit',
            items: [
                me.titleBar,
                me.pnlSocial
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});