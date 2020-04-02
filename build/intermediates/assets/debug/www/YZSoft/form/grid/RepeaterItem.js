﻿
Ext.define('YZSoft.form.grid.RepeaterItem', {
    extend: 'Ext.Container',
    xtype: 'yzrepeateritem',
    isRepeaterBlock: true,
    config: {
        title: null,
        delButton: null
    },

    constructor: function (config) {
        config = config || {};

        var me = this,
            delButton = config.delButton,
            cfg;

        me.btnDelete = Ext.create('Ext.Button', Ext.apply({
            text: RS.$('All__Delete'),
            cls: ['yz-button-flat', 'yz-button-repeateritemtitlebar'],
            //iconCls: 'yz-glyph yz-glyph-e930',
            align: 'right',
            handler: function () {
                me.fireEvent('deleteclick', me);
            }
        }, delButton));

        me.btnDelete.addCls('yz-button-repeateritem-delete');

        me.titlebar = Ext.create('Ext.TitleBar', {
            cls: 'yz-titlebar-repeateritem',
            titleAlign: 'left',
            items: [me.btnDelete]
        });

        cfg = {
            items: [me.titlebar, {
                xtype: 'container',
                items: config.items
            }]
        };

        delete config.items;
        Ext.apply(cfg, config);

        me.callParent([cfg]);

        me.on({
            scope: me,
            indexChanged: 'onIndexChanged'
        });
    },

    onIndexChanged: function (index, total) {
        var me = this,
            format = me.getTitle();

        me.titlebar.setTitle(Ext.String.format(format, index + 1, total));
    }
});