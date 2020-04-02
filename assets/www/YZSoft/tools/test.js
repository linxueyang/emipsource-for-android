Ext.define('YZSoft.tools.test', {
    extend: 'Ext.Container',
    config: {
        scrollable: {
            direction: 'vertical',
            indicators: false
        }
    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        for (var i = 0; i < 50; i++) {
            Ext.Ajax.request({
                url: 'http://192.169.1.100/emip/test/performance/async.ashx',
                timeout: 100000,
                params: {
                    timestamp: 'a'
                },
                success: function (action) {
                    me.setHtml((me.getHtml() || '') + action.responseText + '<br/>');
                },
                failure: function (action) {
                    debugger;
                    me.setHtml((me.getHtml() || '') + action.statusText + '<br/>');
                }
            });
        }
    }
});