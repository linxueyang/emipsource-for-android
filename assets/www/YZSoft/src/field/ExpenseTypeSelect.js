
Ext.define('YZSoft.src.field.ExpenseTypeSelect', {
    extend: 'YZSoft.src.field.ExpandSelect',
    config: {
        valueField: 'Code',
        displayField: 'Text',
        cls: ['yz-field-expense','yz-field-valuealign-right']
    },

    getPicker: function () {
        var me = this,
            config = me.getDefaultPickerConfig();

        if (!me.picker) {
            me.picker = Ext.create('YZSoft.src.field.picker.ExpenseTypePicker', Ext.apply({
                name: me.getName(),
                store: me.getStore(),
                valueField: me.getValueField(),
                displayField: me.getDisplayField(),
                listeners: {
                    scope: me,
                    change: me.onPickerChange,
                    hide: 'onPickerHide',
                    show: 'onPickerShow'
                }
            }, config));
        }

        return me.picker;
    },

    updateValue: function (newValue, oldValue) {
        var me = this,
            cmp = me.getComponent();

        cmp.imageIcon.dom.style.backgroundImage = Ext.String.format('url({0})', newValue.data.imageurl);
        me.callParent([newValue]);
    }
});