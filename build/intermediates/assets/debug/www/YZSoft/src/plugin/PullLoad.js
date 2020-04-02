
Ext.define('YZSoft.src.plugin.PullLoad', {
    extend: 'Ext.plugin.PullRefresh',
    alias: 'plugin.yzpullrefresh',
    config: {
        cls: ['yz-pullrefresh'],
        pullText: '继续下拉刷新',
        releaseText: '松开即可刷新',
        loadingText: '刷新中...',
        loadedText: '刷新中...',
        fetchCopyFields: null,
        fetchCopyFieldsExcept: null,
        pullTpl: [
            '<div class="x-list-pullrefresh-arrow"></div>',
            '<div class="x-loading-spinner">',
                '<span class="x-loading-top"></span>',
                '<span class="x-loading-right"></span>',
                '<span class="x-loading-bottom"></span>',
                '<span class="x-loading-left"></span>',
            '</div>',
            '<div class="x-list-pullrefresh-wrap">',
                '<div class="x-list-pullrefresh-message">{message}</div>',
                '<div class="x-list-pullrefresh-updated">{updated}</div>',
            '</div>'
        ].join('')
    },

    setState: function (value) {
        this.$state = value;

        var me = this,
            state = me.getState(),
            stateFn = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase(),
            fn = "get" + stateFn + "Text",
            message;

        if (me[fn] && Ext.isFunction(me[fn])) {
            message = me[fn].call(me);
        }

        me.innerElement.removeCls(["loaded", "loading", "release", "pull"], Ext.baseCSSPrefix + "list-pullrefresh");
        me.innerElement.addCls(me.getState(), Ext.baseCSSPrefix + "list-pullrefresh");

        me.innerElement.down('.x-list-pullrefresh-message').setHtml(message);
    }
});