const Api = require('../../utils/api.js');
Page({
    data: {
        accountInfo: null,
        cardId: '',
        canRegister: false
    },
    onLoad: function (options) {
        console.log('onLoad');
        console.log(options);
        if (options.id && options.id != undefined) {
            this.setData({
                cardId: options.id
            });
        }
    },
    onShow: function () {
        const that = this;
        if (that.data.accountInfo != null) {
            return
        }
        
        Api.wxLogin({
            success: (userInfo, code) => {
                console.log(userInfo);
                Api.login({
                    data: {code: code},
                    success: (account) => {
                        console.log(account);
                        const accountInfo = {
                            account: account,
                            userInfo: userInfo
                        };
                        wx.setStorageSync('user', accountInfo);
                        that.setData({
                            accountInfo: accountInfo
                        });
                        if (that.data.cardId != '' && account.cardId != that.data.cardId) {
                            call(that, that.data.cardId)
                        }
                    },
                    fail: (code, msg) => {
                        console.log(msg);
                        if (code == 404) {
                            const accountInfo = {
                                userInfo: userInfo
                            };
                            wx.setStorageSync('user', accountInfo);
                            that.setData({
                                accountInfo: accountInfo,
                                canRegister: true
                            });
                            if (that.data.cardId != '') {
                                call(that, that.data.cardId)
                            }
                        } else {
                            console.log('提示网络异常');
                            wx.showToast({
                                title: '网络异常，请检查您的网络'
                            })
                        }
                    }
                })
            },
            fail: (msg) => {
                console.log(msg);
            }
        });
    },
    scanQrCode: function (e) {
        var that = this;
        wx.scanCode({
            success: (res) => {
                const [url, cardId] = res.path.split('=');
                call(that, cardId)
            }
        })
    },
    goToRegister: function (e) {
        wx.navigateTo({
            url: '../login/login'
        });
    },
    onShareAppMessage: function (res) {
        // if (res.from === 'button') {
        //     console.log(res.target)
        // }
        return {
            title: '快人挪车',
            path: '/pages/index/index',
            success: function(res) {
                // 转发成功
                console.log(res);
                console.log('success');
            },
            fail: function(res) {
                // 转发失败
                console.log(res);
                console.log('fail');
            }
        }
    }
});

function call(that, cardId) {
    Api.getAccount(cardId, (response) => {
        console.log(response);
        if (response.code == 200) {
            const account = response.data;
            // wx.setStorageSync('qrAccount', account);
            const accountInfo = wx.getStorageSync('user');
            if (accountInfo != null && accountInfo.account != null) {
                if(accountInfo.account.cardId == account.cardId) {
                    console.log('自己');
                    return;
                }
            }
            wx.navigateTo({
                url: '../call/call?card_id=' + account.cardId
            });
        } else {
            const accountInfo = that.data.accountInfo;
            if (accountInfo == null) {
                console.log('提示授权失败');
                wx.showToast({
                    title: '授权失败'
                });
                return
            }
            if (accountInfo.account != null) {
                console.log('界面提示此卡尚未激活');
                wx.showToast({
                    title: '您已经绑定挪车卡，不需要重新绑定新的挪车卡'
                });
                return
            }

            console.log('跳到注册页面');
            console.log(response);
            wx.navigateTo({
                url: '../login/login?card_id=' + cardId
            });
        }
    });
}