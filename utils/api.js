function register(tel, code, cardId, userInfo, cb) {
    wx.request({
        method: 'POST',
        url: 'https://xdesh.scrats.cn/car/api/register',
        data: {
            tel: tel,
            code: code,
            cardId: cardId,
            userInfo: userInfo
        },
        success: function (res) {
            console.log(res.data);
            cb(res.data);
        }
    });
}

function getSmsCode(tel, cb) {
    wx.request({
        method: 'POST',
        data: {
            tel: tel
        },
        url: 'https://xdesh.scrats.cn/car/api/sms',
        success: function (res) {
            cb(res.data.code == 200)
        }
    })
}

function verifySmsCode(tel, smsCode, cb) {
    wx.request({
        method: 'POST',
        data: {
            tel: tel,
            smsCode: smsCode
        },
        url: 'https://xdesh.scrats.cn/car/api/sms/verify',
        success: function (res) {
            const response = res.data;
            if (response.code == 200) {
                cb(null);
            } else {
                cb(response.msg);
            }
        }
    })
}

function getMemberTypes(cb) {
    wx.request({
        method: 'GET',
        url: 'https://xdesh.scrats.cn/car/api/member/type',
        success: function (res) {
            const response = res.data;
            cb(response)
        }
    })
}

function call(openId, cardId, cb) {
    wx.request({
        method: 'POST',
        url: 'https://xdesh.scrats.cn/car/api/call',
        data: {
            open_id: openId,
            card_id: cardId
        },
        success: function (res) {
            const response = res.data;
            cb(response.code == 200)
        }
    })
}

function getAccount(cardId, cb) {
    wx.request({
        method: 'GET',
        url: `https://xdesh.scrats.cn/car/api/account/${cardId}`,
        success: function (res) {
            const response = res.data;
            cb(response)
        }
    })
}

function getWxToken(cb) {
    wx.request({
        method: 'GET',
        url: 'https://xdesh.scrats.cn/car/api/wxtoken',
        success: function (res) {
            cb(res.data.data);
        }
    })
}

function pay(uid, mid, cb) {
    console.log({uid: uid, mid: mid});
    wx.request({
        url: 'https://xdesh.scrats.cn/car/api/pay',
        data: {uid: uid, mid: mid},
        method: 'POST',
        success: function (res) {
            console.log(res.data);
            cb(res.data);
        },
        fail: function (res) {
            // fail
        },
        complete: function (res) {
            // complete
        }
    })
}

function login(opts) {
    wx.request({
        url: 'https://xdesh.scrats.cn/car/api/login',
        data: {code: opts.data.code},
        method: 'POST',
        success: function (res) {
            const data = res.data;
            if (data.code == 200) {
                opts.success(data.data)
            } else {
                console.log(data);
                opts.fail(data.code, data.msg)
            }
        },
        fail: function (res) {
            opts.fail(500, '网络异常');
        }
    })
}

function calling(opts) {
    wx.request({
        url: 'https://xdesh.scrats.cn/car/api/calling',
        data: {
            card_id: opts.data.cardId,
            tel: opts.data.tel
        },
        method: 'POST',
        success: function (res) {
            const data = res.data;
            if (data.code == 200) {
                opts.success()
            } else {
                console.log(data);
                opts.fail(data.msg);
            }
        },
        fail: function (res) {
            opts.fail('网络异常');
        }
    })

}

function signUp(opts) {
    wx.request({
        url: 'https://xdesh.scrats.cn/car/api/signup',
        data: {
            tel: opts.data.tel,
            code: opts.data.code,
            cardId: opts.data.cardId,
            userInfo: opts.data.userInfo
        },
        method: 'POST',
        success: function (res) {
            const data = res.data;
            if (data.code == 200) {
                opts.success(data.data)
            } else {
                console.log(data);
                opts.fail(data.msg);
            }
        },
        fail: function (res) {
            opts.fail('网络异常');
        }
    })
}

function disturbSwitch(opts) {
    wx.request({
        url: 'https://xdesh.scrats.cn/car/api/disturb',
        data: {
            uid: opts.data.uid,
            disturbSwitch: opts.data.disturbSwitch
        },
        method: 'POST',
        success: (res) => {
            const data = res.data;
            if (data.code == 200) {
                opts.success()
            } else {
                console.log(data);
                opts.fail(data.msg);
            }
        },
        fail: (res) => {
            opts.fail('网络异常');
        }
    })
}

function unbind(opts) {
    wx.request({
        url: 'https://xdesh.scrats.cn/car/api/unbind',
        data: {
            uid: opts.data.uid,
            tel: opts.data.tel
        },
        method: 'POST',
        success: (res) => {
            const data = res.data;
            if (data.code == 200) {
                opts.success()
            } else {
                console.log(data);
                opts.fail(data.msg);
            }
        },
        fail: (res) => {
            opts.fail('网络异常');
        }
    })
}

function wxLogin(opts) {
    wx.login({
        success: function (login_res) {
            const code = login_res.code;
            console.log(code);
            wx.getUserInfo({
                success: function (res) {
                    opts.success(res.userInfo, code)
                },
                fail: function () {
                    opts.fail('获取用户信息失败')
                }
            })
        },
        fail: function () {
            opts.fail('登录失败')
        }
    });
}

module.exports = {
    register: register,
    getSmsCode: getSmsCode,
    verifySmsCode: verifySmsCode,
    getMemberTypes: getMemberTypes,
    call: call,
    getAccount: getAccount,
    getWxToken: getWxToken,
    pay: pay,
    wxLogin: wxLogin,
    login: login,
    calling: calling,
    signUp: signUp,
    disturbSwitch: disturbSwitch,
    unbind: unbind
};