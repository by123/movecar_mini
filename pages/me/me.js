var Api = require('../../utils/api.js');
var app = getApp();
Page({
    data: {
        uid: 0,
        tel: '',
        disturb: false,
        userInfo: {}
    },
    onLoad: function () {
        var that = this;
        const accountInfo = wx.getStorageSync('user');
        if (accountInfo == null) {
            return
        }

        this.setData({
            userInfo: accountInfo.userInfo
        });

        if (accountInfo.account == null) {
            return
        }

        this.setData({
            uid: accountInfo.account.uid,
            tel: accountInfo.account.tel,
            disturb: accountInfo.account.disturb == 'on'
        });

    },
    onDisturbChange: function (e) {
        const that = this;
        Api.disturbSwitch({
            data: {
                uid: this.data.uid,
                disturbSwitch: e.detail.value
            },
            success: () => {
                console.log('切换成功');
                const accountInfo = wx.getStorageSync('user');
                if (accountInfo.account != null) {
                    accountInfo.account.disturb = e.detail.value ? 'on' : 'off';
                }
                wx.setStorageSync('user', accountInfo);
                that.setData({
                    disturb: e.detail.value
                })
            },
            fail: (msg) => {
                console.log(msg)
            }
        })
    },
    unbind: function (e) {
        var that = this;
        wx.showModal({
            title: '解绑账号',
            content: '充值金额将被清零, 此操作不可恢复',
            confirmText: "解绑",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    Api.unbind({
                        data: {
                            uid: that.data.uid,
                            tel: that.data.tel
                        },
                        success: () => {
                            wx.setStorageSync('user', null);
                            wx.reLaunch({
                                url: `../index/index`
                            })
                        },
                        fail: (e) => {
                            wx.showToast({
                                title: e
                            })
                        }
                    })
                }else{
                    console.log('用户点击辅助操作')
                }
            }
        });
    }
});
