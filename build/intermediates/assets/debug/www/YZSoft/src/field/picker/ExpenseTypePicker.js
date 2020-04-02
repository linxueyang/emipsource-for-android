
Ext.define('YZSoft.src.field.picker.ExpenseTypePicker', {
    extend: 'YZSoft.src.container.SquaredContainer',
    config: {
        minBoxCount: 5,
        minBoxWidth: 80,
        itemDefaults: {
            xtype: 'button',
            iconAlign: 'top',
            cls: 'yz-button-expensepicker'
        },
        value: null,
        cls: 'yz-container-expensepicker'
    },

    constructor: function (config) {
        var me = this,
            store = config.store,
            items = [];

        store.each(function (record) {
            items.push({
                text: record.data.Text,
                icon: record.data.imageurl,
                scope: me,
                record: record,
                handler: 'onTap'
            });
        });

        var cfg = {
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onTap: function (button) {
        var me = this;
        me.fireEvent('change', me, button.config.record);
    }
});