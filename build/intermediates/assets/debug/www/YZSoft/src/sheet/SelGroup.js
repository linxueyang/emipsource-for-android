﻿
Ext.define('YZSoft.src.sheet.SelGroup', {
    extend: 'YZSoft.src.panel.SelGroup',
    config: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        modal: {
            transparent: true
        },
        showAnimation: {
            type: 'slideIn',
            duration: 350,
            easing: 'ease-out',
            direction: 'up'
        },
        hideAnimation: {
            type: 'slideOut',
            duration: 350,
            easing: 'ease-in',
            direction: 'down'
        }
    }
});