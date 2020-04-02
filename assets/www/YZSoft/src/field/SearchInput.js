
Ext.define('YZSoft.src.field.SearchInput', {
    extend: 'Ext.field.Input',
    xtype: 'yzsearchinput',

    getTemplate: function () {
        var me = this,
            items;

        items = [{
            reference: 'input',
            tag: this.tag
        }, {
            reference: 'mask',
            classList: [this.config.maskCls]
        }, {
            reference: 'clearIcon',
            cls: 'x-clear-icon'
        }];

        return items;
    },

    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    }
});