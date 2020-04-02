﻿Ext.define('YZSoft.src.panel.social.base.Abstract', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.device.AudioPlayer',
        'YZSoft.src.ux.Push'
    ],
    onImageTap: Ext.emptyFn,
    onVideoTap: Ext.emptyFn,
    onDocTap: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.player = YZSoft.src.device.AudioPlayer;

        me.callParent(arguments);

        me.on({
            single: true,
            painted: function () {
                me.on({
                    hide: function () {
                        me.player.stop();
                        me.player.bind(null);
                    }
                });
            }
        });

        me.on({
            scope: me,
            audiotimeupdate: 'onAudioTimeUpdate',
            audioended: 'onAudioEnd',
            audiostop: 'onAudioEnd'
        });

        me.noNext = !('msgId' in config);
    },

    onScrollChange: function (scroller, x, y) {
        var me = this,
            minPos = scroller.getMinPosition(),
            maxPos = scroller.getMaxPosition();

        if (me.loading)
            return;

        if (y < minPos.y + 50) {
            if (!me.noPrev) {
                me.loading = true;
                me.fetchPrevMessage();
            }
        }
        else if (y > maxPos.y - 50) {
            if (!me.noNext) {
                me.loading = true;
                me.fetchNextMessage();
            }
        }
    },

    fetchPrevMessage: function () {
        var me = this,
            store = me.store,
            proxy = store.getProxy(),
            rec = store.first(),
            params, operation;

        params = {
            dir: 'prev',
            msgId: rec ? rec.getId() : -1
        };

        operation = Ext.create('Ext.data.Operation', {
            params: params,
            model: store.getModel(),
            limit: store.getPageSize(),
            action: 'read',
            sorters: store.getSorters(),
            filters: store.getRemoteFilter() ? store.getFilters() : []
        });

        proxy.read(operation, me.onPrevMessageFetched, me);
    },

    onPrevMessageFetched: function (operation) {
        var me = this,
            store = me.store,
            oldRecords = store.getData(),
            newRecords = operation.getRecords(),
            length = newRecords.length,
            toInsert = [],
            newRecord, oldRecord, i;

        for (i = 0; i < length; i++) {
            newRecord = newRecords[i];
            oldRecord = oldRecords.getByKey(newRecord.getId());

            if (oldRecord)
                oldRecord.set(newRecord.getData());
            else
                toInsert.push(newRecord);

            oldRecord = undefined;
        }

        store.insert(0, toInsert);

        me.noPrev = newRecords.length == 0;
        me.loading = false;
    },

    fetchNextMessage: function () {
        var me = this,
            store = me.store,
            proxy = store.getProxy(),
            rec = store.last(),
            params, operation;

        params = {
            dir: 'next',
            msgId: rec ? rec.getId() : -1
        };

        operation = Ext.create('Ext.data.Operation', {
            params: params,
            model: store.getModel(),
            limit: store.getPageSize(),
            action: 'read',
            sorters: store.getSorters(),
            filters: store.getRemoteFilter() ? store.getFilters() : []
        });

        proxy.read(operation, me.onNextMessageFetched, me);
    },

    onNextMessageFetched: function (operation) {
        var me = this,
            store = me.store,
            oldRecords = store.getData(),
            newRecords = operation.getRecords(),
            length = newRecords.length,
            toInsert = [],
            newRecord, oldRecord, i;

        for (i = 0; i < length; i++) {
            newRecord = newRecords[i];
            oldRecord = oldRecords.getByKey(newRecord.getId());

            if (oldRecord)
                oldRecord.set(newRecord.getData());
            else
                toInsert.push(newRecord);

            oldRecord = undefined;
        }

        store.add(toInsert);

        me.noNext = newRecords.length == 0;
        me.loading = false;
    },

    updateReaded: function (msgId) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
            params: {
                method: 'UpdateReaded',
                resType: me.getResType(),
                resId: me.getResId(),
                msgId: msgId
            }
        });
    },

    onAudioTap: function (list, index, target, record, e, eOpts) {
        var me = this,
            targetAudio = Ext.get(e.getTarget('.yz-social-msg-item-audio')),
            fileid = targetAudio.getAttribute('fileid'),
            uri = targetAudio.getAttribute('uri'),
            player = me.player;

        if (targetAudio.hasCls('playing')) {
            player.stop();
            targetAudio.removeCls('playing');
        }
        else {
            player.stop();

            if (fileid)
                player.setFileId(fileid);
            else
                player.setFileUri(uri);

            player.bind(me, record.getId());
            player.play();
        }
    },

    getAudioEl: function (fileid) {
        return fileid && this.element.down(Ext.String.format('div.yz-social-msg-item-audio[fileid="{0}"]', fileid));
    },

    onAudioTimeUpdate: function (player, time, itemid) {
        var me = this,
            fileid = player.fileid,
            targetAudio = me.getAudioEl(fileid);

        if (targetAudio) {
            if (!targetAudio.hasCls('playing'))
                targetAudio.addCls('playing');

            var duel = targetAudio.up('.message-body').down('.message-body>.duration'),
                total = player.getDuration(),
                remain = Math.floor(total - time);

            if (total && remain >= 0)
                duel.setHtml(Ext.util.Format.mediaDurationM(remain));
        }
    },

    onAudioEnd: function (player, time, itemid) {
        var me = this,
            fileid = player.fileid,
            targetAudio = me.getAudioEl(fileid),
            duel = targetAudio && targetAudio.up('.message-body').down('.message-body>.duration'),
            orgdur = duel && duel.dom.getAttribute('orgdur') || '';

        if (targetAudio) {
            Ext.defer(function () {
                targetAudio.removeCls('playing');
                duel.setHtml(orgdur);
            }, 100);
        }
    },

    onNotify: function (message) {
        var me = this;

        if (message.channel != me.channel || message.clientid == YZSoft.src.ux.Push.clientid)
            return;

        var s = me.list.getScrollable().getScroller(),
            r = me.store.add(message.message)[0];

        r.phantom = true;
        s.scrollToEnd();

        me.updateReaded(message.message.id);
    },

    destroy: function () {
        var me = this,
            imagePreviews = me.imagePreviews = me.imagePreviews || {},
            videoPlayers = me.videoPlayers = me.videoPlayers || {};

        Ext.Object.each(imagePreviews, function (key, pnl) {
            if (pnl)
                pnl.destroy();
        });
        delete imagePreviews;

        Ext.Object.each(videoPlayers, function (key, pnl) {
            if (pnl)
                pnl.destroy();
        });
        delete videoPlayers;

        me.callParent(arguments);
    }
});