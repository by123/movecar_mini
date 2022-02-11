const Api = require('../../utils/api.js');
Page({
    data: {
        imgUrls: [
            'http://www.neko-kurashi.com/img/kao01.jpg',
            'http://4493bz.1985t.com/uploads/allimg/160222/5-160222145918.jpg',
            // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        interval: 5000,
        duration: 1000,
        sendCodeDelaySecond: 0,
        tel: '',
        smsCode: '',
        showTopTips: false,
        tipMsg: '加载中',
        cardId: '',
        tips: ''
    },
    onLoad: function (options) {
        console.log('onLoad');
        if (options.card_id && options.card_id != undefined) {
            this.setData({
                cardId: options.card_id
            });
        }
    },
    login: function (e) {
        const tel = this.data.tel;
        if (tel == '') {
            showTip(this, '请输入手机号');
            return
        }

        const smsCode = this.data.smsCode;
        if (smsCode == '') {
            showTip(this, '请输入验证码');
            return
        }

        this.setData({
            tips: '(请稍候...)'
        });
        const cardId = this.data.cardId;
        var that = this;
        Api.verifySmsCode(tel, smsCode, (err) => {
            if (err) {
                showTip(that, err);
                that.setData({
                    tips: ''
                });
                return
            }

            Api.wxLogin({
                success: (userInfo, code) => {
                    Api.signUp({
                        data: {
                            tel: tel,
                            code: code,
                            cardId: cardId,
                            userInfo: userInfo
                        },
                        success: (account) => {
                            const accountInfo = {
                                account: account,
                                userInfo: userInfo
                            };
                            that.setData({
                                tips: ''
                            });
                            wx.setStorageSync('user', accountInfo);
                            // wx.navigateBack({
                            //     delta: 1
                            // })
                            wx.reLaunch({
                                url: `../index/index?id=${account.cardId}`
                            })
                        },
                        fail: (msg) => {
                            console.log(msg);
                            that.setData({
                                tips: ''
                            });
                            wx.showToast({
                              title: '注册失败'
                            })
                        }
                    })
                },
                fail: (msg) => {
                    console.log(msg);
                    that.setData({
                        tips: ''
                    });
                    wx.showToast({
                      title: '授权失败'
                    })
                }
            });
        });
    },
    getSMSCode: function (e) {
        let sendCodeDelaySecond = this.data.sendCodeDelaySecond;
        if (sendCodeDelaySecond > 0) {
            return
        }

        if (this.data.tel == '') {
            showTip(this, '请输入手机号');
            return
        }

        let that = this;
        Api.getSmsCode(this.data.tel, function (success) {
            showTip(that, '获取短信成功')
        });

        console.log('start interval');
        sendCodeDelaySecond = 60;
        that.setData({
            sendCodeDelaySecond: sendCodeDelaySecond
        });
        let intervalId = setInterval(function () {
            console.log(sendCodeDelaySecond);
            sendCodeDelaySecond--;
            that.setData({
                sendCodeDelaySecond: sendCodeDelaySecond
            });
            if (sendCodeDelaySecond < 1) {
                clearInterval(intervalId)
            }
        }, 1000);
    },

    //input
    setTel: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    setSmsCode: function (e) {
        this.setData({
            smsCode: e.detail.value
        })
    }
});

function showTip(that, msg) {
    that.setData({
        tipMsg: msg,
        showTopTips: true
    });
    setTimeout(function () {
        that.setData({
            showTopTips: false
        });
    }, 3000);
}