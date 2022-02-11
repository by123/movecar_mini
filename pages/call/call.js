const Api = require('../../utils/api.js');
Page({
    data: {
        cardId: '',
        tel: ''
    },
    onLoad: function (options) {
        if (options.card_id && options.card_id != undefined) {
            this.setData({
                cardId: options.card_id
            });
        }
        const accountInfo = wx.getStorageSync('user');
        if (accountInfo.account != null) {
            this.setData({
                tel: accountInfo.account.tel
            })
        }
    },
    setTel: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    call: function (e) {
        Api.calling({
            data: {
                tel: this.data.tel,
                cardId: this.data.cardId
            },
            success: function () {
                console.log('呼叫成功');
                wx.showModal({
                    title: '正在为您接通，请稍后',
                    showCancel: false
                })
            },
            fail: function (msg) {
                console.log(msg);
                wx.showModal({
                    title: msg,
                    showCancel: false
                });
            }
        })
    }
});