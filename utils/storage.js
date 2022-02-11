function getToken(cb) {
    wx.getStorage({
        key: 'token',
        success: function (res) {
            cb(res.data)
        },
        fail: function () {
            cb(null)
        }
    });
}

function setToken(value, cb) {
    wx.setStorage({
        key: 'token',
        data: value,
        success: function (res) {
            if (cb) {
                cb(res)
            }
        }
    })
}

module.exports = {
    getToken: getToken,
    setToken: setToken
};
