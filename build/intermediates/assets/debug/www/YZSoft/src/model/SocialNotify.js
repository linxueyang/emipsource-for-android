Ext.define('YZSoft.src.model.SocialNotify', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'id', type: 'string' },
            { name: 'Account', type: 'string' },
            { name: 'ResType', type: 'string' },
            { name: 'ResID', type: 'string' },
            { name: 'ResName', type: 'string' },
            { name: 'LastMessage', type: 'string' },
            { name: 'Date', type: 'date' },
            { name: 'NewMessageCount', type: 'int' },
            { name: 'ext', type: 'object' }
        ]
    }
});