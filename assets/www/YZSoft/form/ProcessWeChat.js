
Ext.define('YZSoft.form.ProcessWeChat', {
    extend: 'YZSoft.form.Process',

    constructor: function (config) {
        var me = this;

        config.pid = Number(config.pid);

        config.fn = function () {
            WeixinJSBridge.invoke('closeWindow', {}, function (res) {
            });
        };

        var cfg = {};

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});