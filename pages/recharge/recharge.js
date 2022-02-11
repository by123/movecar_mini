const Api = require('../../utils/api.js');
Page({
    data: {
        days: 0,
        id: 0,
        types: [],
        phonenum : ''
    },
    onLoad: function () {
        var that = this;
        const accountInfo = wx.getStorageSync('user');
        setAccount(that, accountInfo);
        Api.getMemberTypes(function (data) {
            const types = data.data;
            types[0].checked = true;
            const id = types[0].mid;
            that.setData({
                id: id,
                types: types
            })
        })
    },
    bindTypeChange: function (e) {
        const id = e.detail.value;
        console.log(id);
        const types = this.data.types;
        for (let type of types) {
            type.checked = type.mid == id;
        }
        this.setData({
            id: id,
            types: types
        })
    },
    recharge: function (e) {
        const accountInfo = wx.getStorageSync('user');
        const uid = accountInfo.account.uid;
        const cardId = accountInfo.account.cardId;
        const mid = this.data.id;
        Api.pay(uid, mid, function (orderInfo) {
            console.log(orderInfo);
            // const accessToken = orderInfo.accessToken;
            wx.requestPayment({
                'timeStamp': orderInfo.timeStamp,
                'nonceStr': orderInfo.nonceStr,
                'package': orderInfo.package,
                'signType': orderInfo.signType,
                'paySign': orderInfo.paySign,
                'success': function (res) {
                    console.log(res);
                    wx.reLaunch({
                        url: `../index/index`
                    });
                },
                'fail': function (res) {
                    console.log(res);
                    wx.reLaunch({
                        url: `../index/index`
                    });
                }
            });
        })
    }
});

function setAccount(that, currAccountInfo) {
    let expiredTs = 0;
    if (currAccountInfo.account) {
        expiredTs = currAccountInfo.account.expiredTs;
    }
    let days = 0;
    const now = new Date().getTime();
    if (expiredTs > now) {
        console.log(expiredTs);
        console.log(now);
        days = parseInt((expiredTs - now) / (1000 * 60 * 60 * 24));
    }
    that.setData({
        days: days,
        tel: currAccountInfo.account.tel
    });
}
