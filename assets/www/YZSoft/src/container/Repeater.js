
Ext.define('YZSoft.src.xform.Repeater', {
    extend: 'Ext.Container',
    isRepeaterContainer:true,
    config: {
        template: null,
        initBlocks: 0
    },

    constructor: function (config) {
        var me = this,
            initBlocks = 'initBlocks' in config ? config.initBlocks : 1,
            cfg;

        for (var i = 0; i < initBlocks; i++) {

        }

        cfg = {
            items: [me.createRepeaterItem(config.template), {
                xtype: 'container',
                cls: ['yz-list-button-container'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'button',
                    text: '增加报销明细',
                    cls: ['yz-button-flat','yz-button-noflex'],
                    iconCls: 'yz-glyph yz-glyph-e907',
                    padding: '7 10',
                    style: 'background-color:white;border-radius:0px;',
                    handler: function () {
                        me.addBlock();
                    }
                }]
            }]
        };

        Ext.apply(cfg, config);

        me.callParent([cfg]);
        me.addCls('yz-repeatable-container');

        me.on({
            scope: me,
            add: 'updateIndex',
            remove:'updateIndex'
        });

        me.updateIndex();
    },

    createRepeaterItem: function (template) {
        var me = this,
            template = template || me.getTemplate(),
            repeaterItem;

        repeaterItem = Ext.create('YZSoft.src.xform.RepeaterItem', {
            items: template
        });

        repeaterItem.on({
            scope: me,
            deleteclick: 'onBlockDeleteClick'
        });

        return repeaterItem;
    },

    updateIndex: function () {
        var me = this,
            items = me.getItems().items,
            ln = items.length,
            i;

        for (i = 0; i < ln - 1; i++) {
            item = items[i];
            item.fireEvent('indexChanged', i, ln);
        }
    },

    onBlockDeleteClick: function (block) {
        var me = this;

        me.remove(block);
    },

    addBlock: function () {
        var me = this,
            repeaterItem = me.createRepeaterItem();

        me.insert(me.getItems().items.length - 1, repeaterItem);
        return repeaterItem;
    },

    getElementConfig1: function () {
        return {
            reference: 'element',
            classList: ['x-container', 'x-unsized', 'yz-repeatable-container'],
            children: [{
                reference: 'innerElement',
                className: 'x-inner'
            }, {
                reference: 'addbtn',
                className: 'yz-repeatable-container-button-add',
                html: '增加报销明细'
            }]
        };
    }
});