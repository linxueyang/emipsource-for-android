﻿
Ext.define('YZSoft.src.field.Attachment', {
    xtype: 'yzattachment',

    constructor: function (config) {
        var browserEnv = Ext.browser.is,
            className = 'HTML5';

        if (application.wechat)
            className = 'WeChat';
        if (application.dingtalk)
            className = 'DingTalk';
        else if (browserEnv.WebView && browserEnv.Cordova)
            className = 'Cordova';

        return Ext.create('YZSoft.src.field.Attachment.' + className, config);
    }
});