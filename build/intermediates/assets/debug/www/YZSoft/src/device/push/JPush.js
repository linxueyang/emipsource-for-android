
Ext.define('YZSoft.src.device.push.JPush', {
    extend: 'YZSoft.src.device.push.Abstract',
    isJPush: true,

    construtor: function () {
        var me = this;
        me.callParent(arguments);
    },

    register: function () {
        var me = this;

        window.plugins.jPushPlugin.init();
        window.plugins.jPushPlugin.resumePush();

        document.addEventListener('jpush.receiveNotification', function (event) {
            me.fireEvent('notification', me.copyNotification(event));
        }, false);

        document.addEventListener('jpush.receiveMessage', function (event) {
            me.fireEvent('message', me.copyMessage(event));
        }, false);

        document.addEventListener('jpush.openNotification', function (event) {
            me.fireEvent('openNotification', me.copyNotification(event));
        }, false);

        window.plugins.jPushPlugin.getRegistrationID(function (data) {
            me.registerPushNotificationClient('jpush', 'android', data, function () {
            });
        });
    },

    stopPush: function () {
        //���ܵ��ô˷�����һ�������ˣ��ٽ��붼�ղ�������
        //window.plugins.jPushPlugin.stopPush();
    },

    copyNotification: function (event) {
        //alert(event);
        return {
            title: event.title,
            message: event.alert,
            extras: Ext.copyTo({}, event.extras, ['newsid'])
        };
    },

    copyMessage: function (event) {
        //alert(event);
        return {
            title: event.title,
            message: event.alert,
            extras: Ext.copyTo({}, event.extras, ['newsid'])
        };
    }
});
