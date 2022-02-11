App({
    onLaunch: function () {
    },
    getUserInfo: function (cb) {
        var that = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function (login_res) {
                    const code = login_res.code;
                    console.log(code);
                    wx.getUserInfo({
                        success: function (res) {
                            console.log(res.userInfo)
                            that.globalData.userInfo = res.userInfo;
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null
    }
});