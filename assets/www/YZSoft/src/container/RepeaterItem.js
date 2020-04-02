
Ext.define('YZSoft.src.xform.RepeaterItem', {
    extend: 'Ext.Container',
    isRepeaterBlock: true,
    config: {
        title:'报销明细 {0}'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnDelete = Ext.create('Ext.Button', {
            text: '删除',
            cls: ['yz-button-flat', 'yz-button-repeateritemtitlebar'],
            //iconCls: 'yz-glyph yz-glyph-e930',
            align: 'right',
            handler: function () {
                me.fireEvent('deleteclick', me);
            }
        });

        me.titlebar = Ext.create('Ext.TitleBar', {
            title: '报销明细',
            cls:'yz-titlebar-repeateritem',
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

        me.titlebar.setTitle(Ext.String.format(format,index+1,total));
    }
});