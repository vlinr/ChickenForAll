require("weapp-adapter.js");
const updateManager = wx.getUpdateManager();
updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate)
});
updateManager.onUpdateReady(function () {
  wx.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success: function (res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
});
updateManager.onUpdateFailed(function () {
  // 新版本下载失败
  wx.showToast({
    title: '版本下载失败！',
    icon: '',
    image: 'jiazai/fails.png'
  })
});
const loadTask = wx.loadSubpackage({
  name: 'fenbao', // name 可以填 name 或者 root
  success: function (res) {
    require("fenbao/libs/laya.wxmini.js");
    window.Parser = require('./parser/dom-parser.js');
    window.loadLib = require;
    require("index.js");
  },
  fail: function (res) {
    // 分包加载失败通过 fail 回调
    console.log('加载失败');
  }
})
loadTask.onProgressUpdate(res => {
  console.log('下载进度', res.progress)
  // console.log('已经下载的数据长度', res.totalBytesWritten)
  // console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
})