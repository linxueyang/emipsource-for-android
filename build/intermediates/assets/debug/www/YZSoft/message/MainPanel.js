Ext.define('YZSoft.message.MainPanel', {
    extend: 'Ext.Container',

    constructor: function (config) {
        var me = this;

        me.btnAdd = Ext.create('Ext.Button', {
            cls: ['yz-button-flat','yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e907',
            align: 'right'
        });

        me.titleBar = Ext.create('Ext.TitleBar',{
            docked: 'top',
            cls: ['yz-titlebar'],
            title: '消息',
            items: [me.btnAdd]
        });

        var cfg = {
            items: [me.titleBar]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
