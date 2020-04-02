
Ext.define('YZSoft.src.field.InputExt', {
    extend: 'Ext.field.Input',
    xtype: 'yzinputext',

    getTemplate: function () {
        var me = this,
            items;

        items = [{
            reference: 'input',
            tag: this.tag
        }, {
            reference: 'imageIcon',
            cls: 'yz-image-icon'
        }, {
            reference: 'mask',
            classList: [this.config.maskCls]
        }, {
            reference: 'clearIcon',
            cls: 'x-clear-icon'
        }];

        return items;
    }
});