
Ext.define('YZSoft.src.device.Phone', {
    singleton: true,

    sendSMS: function (phone) {
        document.location.href = 'sms:' + phone;
    },

    call: function (phone) {
        document.location.href = 'tel:' + phone;
    }
});
