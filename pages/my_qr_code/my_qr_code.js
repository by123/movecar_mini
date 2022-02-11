var Api = require('../../utils/api.js');
var app = getApp();
Page({
    data: {
        qr_code_url: ''
    },
    onLoad: function () {
        const accountInfo = wx.getStorageSync('user');
        if (!accountInfo || !accountInfo.account) {
            wx.showToast({
                title: '尚未注册'
            });
            return
        }
        const cardId = accountInfo.account.cardId;
        console.log(`https://xdesh.scrats.cn/car/api/qrcode?cardid=${cardId}`);
        this.setData({
            qr_code_url: `https://xdesh.scrats.cn/car/api/qrcode?cardid=${cardId}`
        })
    },
    previewImage: function (e) {
        wx.previewImage({
            current: this.data.qr_code_url,
            urls: [this.data.qr_code_url]
        })
    }
});
