import config from "../config/config";
export default class AdManager {
    private isBanner: boolean = false;
    constructor(isBanner) {
        this.isBanner = isBanner;
    }
    //创建广告
    createAd(callBack: any = null, left: number = 0, top: number = 0, width: number = 350): void {
        if (Laya.Browser.onMiniGame) {
            let wx: any = Laya.Browser.window.wx;
            let self: any = this;
            wx.getSystemInfo({
                success: function (res) {
                    if (res.SDKVersion >= '2.0.4') { //版本超过2.0.4才会进行处理
                        if (!self.isBanner) {
                            wx.showLoading({
                                title: '正在加载...',
                            })
                            let videoAd = wx.createRewardedVideoAd({
                                adUnitId: 'adunit-23056ba52b75e1ee'
                            })
                            videoAd.load()
                                .then(() => {
                                    wx.hideLoading();
                                    videoAd.show().catch(err => {

                                    });
                                })
                                .catch(err => {
                                    console.log(err)
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: '获取失败',
                                        icon: '',
                                        image: 'jiazai/fails.png'
                                    })

                                })
                            videoAd.onError(err => {//拉取失败
                                callBack(0);
                                wx.hideLoading();
                                wx.showToast({
                                    title: '获取错误',
                                    icon: '',
                                    image: 'jiazai/fails.png'
                                })
                            })
                            videoAd.onClose(res => {
                                videoAd.offClose();
                                if (res && res.isEnded || res === undefined) {
                                    //观看完成
                                    callBack(1);
                                } else {
                                    callBack(2);
                                    wx.showToast({
                                        title: '中途退出',
                                        image: 'jiazai/fails.png'
                                    })
                                }
                            })
                        } else {
                            let bannerAd = wx.createBannerAd({
                                adUnitId: 'adunit-a87f16ad9bce89aa',
                                style: {
                                    left: left,
                                    top: top,
                                    width: width
                                }
                            })
                            config.bannerAd = bannerAd;
                            //拉去错误
                            bannerAd.onError((): void => {
                                callBack(0);
                            });
                            bannerAd.onLoad((): void => {
                                callBack(1);
                            })
                            config.bannerAd.onResize(function () {
                                config.bannerAd.style.height = config.bannerAd.style.realHeight;
                                config.bannerAd.style.width = config.bannerAd.style.realWidth;
                                config.bannerAd.style.top = config.bannerAd.style.top - config.bannerAd.style.realHeight / 3;
                                config.bannerAd.style.left = config.bannerAd.style.left - (config.bannerAd.style.realWidth - width) / 2;
                            })
                        }
                    } else { //版本过低
                        callBack();
                        wx.hideLoading();
                        wx.showToast({
                            title: '版本过低',
                            image: 'jiazai/fails.png'
                        })
                    }
                },
            })

        }
    }
}