import GetData from '../request/GetData'
import config from '../config/config'
import getCookie from '../common/getCookie'
import Share from '../share/Share'
export default class Load extends Laya.Script {
    private scene: any; //记录场景
    private lA: Laya.Sprite;
    private fontLen: number = 0;
    private loadNum:Laya.Text;
    constructor() {
        super();
    }
    //加载界面显示
    onEnable(): void {
        if (Laya.Browser.onMiniGame) {
            let randomNum: number = this.randomNum(0, config.shareText.length - 1);
            new Share((randomNum + 1), config.shareText[randomNum]).passiveShare(config.shareText[randomNum], 1);
        }
        console.log('加载界面!');
        
        this.scene = this.owner;
        //处理事件区域
        this.scene.width = Laya.stage.width;
        this.scene.height = Laya.stage.height;
        //处理一下适配,按照X进行适配
        let scX: number = Laya.Browser.window.scX;
        let scY: number = Laya.Browser.window.scY;
        let loading: any = this.scene.getChildByName('loading');
        loading.width = this.scene.width;
        loading.height = this.scene.height;

        //处理logo
        let logo: any = this.scene.getChildByName('logo');
        let logoZone: any = logo.getBounds();
        logo.width = logoZone.width * scX;
        logo.height = logoZone.height * scX;
        logo.pos((Laya.stage.width-logo.width)/2, logoZone.y * scY);

        let logoTween: Laya.TimeLine = new Laya.TimeLine();
        let logoY:number=logo.y;
        logoTween.to(logo, {
            y: logoY-50*scX,
        }, 3000, Laya.Ease.linearInOut, 0);
        logoTween.to(logo, {
            y:logoY
        }, 3000, Laya.Ease.linearInOut, 0);
        logoTween.play(0, true);

        //制作加载进度条
        let loadBg: Laya.Sprite = new Laya.Sprite();
        loadBg.width = 616 * scX;
        loadBg.height = 41 * scX;
        loadBg.graphics.drawTexture(Laya.loader.getRes('jiazai/loadActive1.png'), 0, 0, 616 * scX, 41 * scX);
        //用于存放两个加载条
        let loadBox: Laya.Sprite = new Laya.Sprite();

        let lD: Laya.Sprite = new Laya.Sprite();
        lD.width = 600 * scX;
        lD.height = 22 * scX;
        lD.graphics.drawTexture(Laya.loader.getRes('jiazai/loadDefault.png'), 0, 0, 600 * scX, 22 * scX);
        lD.pos(0, 0);

        this.lA = new Laya.Sprite();
        this.lA.width = 600 * scX;
        this.lA.height = 22 * scX;
        this.lA.graphics.drawTexture(Laya.loader.getRes('jiazai/loadActive.png'), 0, 0, 600 * scX, 22 * scX);
        this.lA.pos(-this.lA.width, 0);

        loadBox.addChild(lD);
        loadBox.addChild(this.lA);
        loadBox.mask = lD;
        loadBox.pos((this.scene.width - lD.width) / 2-2, this.scene.height / 1.65 + 3);
        loadBg.pos((this.scene.width - loadBg.width) / 2, this.scene.height / 1.65);
        //添加到场景
        this.scene.addChild(loadBg);
        this.scene.addChild(loadBox);
        this.loadNum = new Laya.Text();
        this.loadNum.fontSize = 42 * scX;
        this.loadNum.text = `0%`;
        this.loadNum.align = 'center';
        this.loadNum.font='loadFont';
        this.loadNum.width=loadBg.width;
        this.loadNum.pos(0, -this.loadNum.height/1.15);
        loadBg.addChild(this.loadNum);
        //处理提示
        let hTip: any = this.scene.getChildByName('hethTip');
        let hZone: any = hTip.getBounds();
        hTip.width = hZone.width * scX;
        hTip.height = hZone.height * scX;
        hTip.pos(hZone.x * scX, this.scene.height - hZone.height * 1.4);
        var sourceArr: Array<any> = [
            { url: "MyScene/Main.json", type: Laya.Loader.JSON },
            { url: 'res/atlas/zhuye.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
            { url: 'res/atlas/kaishiyouxi.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
            { url: 'res/atlas/paihangbang.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
            { url: 'res/atlas/fuhuo.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
            { url: 'res/atlas/daoju.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
            { url: 'res/atlas/meirilibao.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
            { url: 'res/atlas/yaoqing.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
            { url: 'res/atlas/jixuyouxi.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
            { url: 'res/atlas/baocun.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
            { url: 'res/atlas/donghua/chuizi.atlas', type: Laya.Loader.ATLAS }, //加载动画
            { url: 'res/atlas/donghua/yanwu.atlas', type: Laya.Loader.ATLAS }, //加载动画
            { url: 'res/atlas/donghua/baozha.atlas', type: Laya.Loader.ATLAS }, //加载动画
            { url: 'res/atlas/tupian.atlas', type: Laya.Loader.ATLAS }, //加载动画
            { url: 'res/atlas/xinzhuye.atlas', type: Laya.Loader.ATLAS }, //加载动画
            { url: 'res/atlas/ziti.atlas', type: Laya.Loader.ATLAS }, //加载动画
            { url: 'res/atlas/zuanshi.atlas', type: Laya.Loader.ATLAS }, //加载动画
            { url: 'res/atlas/guoguan.atlas', type: Laya.Loader.ATLAS }, //加载动画
            { url: 'lz.png', type: Laya.Loader.IMAGE },
            { url: 'paihangbang/rBg.png', type: Laya.Loader.IMAGE },
            { url: 'baocun/save.png', type: Laya.Loader.IMAGE },
            { url: 'paihangbang/right.png', type: Laya.Loader.IMAGE },
            { url: 'paihangbang/gz.png', type: Laya.Loader.IMAGE },
            { url: 'paihangbang/my.png', type: Laya.Loader.IMAGE },
            { url: 'daoju/popupBg.png', type: Laya.Loader.IMAGE },
            { url: 'daoju/cir.png', type: Laya.Loader.IMAGE },
            { url: 'fuhuo/beijing.png', type: Laya.Loader.IMAGE },
            { url: 'yaoqing/invBg.png', type: Laya.Loader.IMAGE },
            { url: 'yaoqing/right.png', type: Laya.Loader.IMAGE },
            { url: 'jixuyouxi/jxBg.png', type: Laya.Loader.IMAGE },
            { url: 'guoguan/passBg.png', type: Laya.Loader.IMAGE },
            { url: 'xinzhuye/mainBg.jpg', type: Laya.Loader.IMAGE },
            { url: 'xinzhuye/btmk.png', type: Laya.Loader.IMAGE },
            { url: 'xinzhuye/center.png', type: Laya.Loader.IMAGE },
            { url: 'xinzhuye/kk.png', type: Laya.Loader.IMAGE },
            { url: 'zuanshi/zsBg.png', type: Laya.Loader.IMAGE },
        ];
        //加载加载界面资源，防止黑屏
        Laya.loader.load(sourceArr, null, Laya.Handler.create(this, (e: Laya.Event): void => {
            this.onProgress(e);
        }, null, false));
    }
    private onProgress(pros: any):void{
        let nowLoad: number = pros * 90; //根据回调，进行百分比计算
        this.lA.x = -this.lA.width + this.lA.width / 100 * nowLoad;
        this.loadNum.text=Math.floor(nowLoad)+'%';
        if (pros == 1) {
            // this.gameTip();
            //注册位图字体
            let fontArr: Array<any> = [{
                name: 'invFont',
                src: 'ziti/invFont.fnt'
            }];
            for (let i: number = 0; i < fontArr.length; ++i) {
                var bitmapFont: Laya.BitmapFont = new Laya.BitmapFont();
               ((bitmapFont) => {  //闭包处理一下，否则都是最后一个
                    bitmapFont.loadFont(fontArr[i].src, new Laya.Handler(this, function () {
                        this.fontLen++;
                        bitmapFont.setSpaceWidth(10);  //设置字体间距
                        bitmapFont.letterSpacing = 2;
                        bitmapFont.autoScaleSize = true;//自动大小
                        Laya.Text.registerBitmapFont(fontArr[i].name, bitmapFont);  //注册字体
                    }, [bitmapFont]));
                })(bitmapFont)
            }
            Laya.timer.loop(1, this, this.loopMonitor, [fontArr.length]);
        }  //加载完成后进入加载界面
    }
    private loopMonitor(len: number = 0) {
        if (this.fontLen == len) {
            this.loadNum.text='100%';
            Laya.timer.clear(this, this.loopMonitor);
            this.lA.x = 0;
            this.gameTip();//注册完成进入游戏
        }
    }
    //进入游戏提示界面
    private gameTip(): void {
        console.log('进入游戏主界面');
        let self: any = this;
        //登录
        if (Laya.Browser.onMiniGame) {
            let wx: any = Laya.Browser.window.wx;
            wx.showLoading({
                title: 'Login...',
            });
            wx.login({
                success(res) {
                    wx.getSystemInfo({
                        success: function (sysRes) {
                            new GetData('/EatChicken/user/code2accessToken.action?jsCode=' + res.code + '&clientSystemInfo=' + encodeURI(JSON.stringify(sysRes)) + '&fromChannel=' + config.fromChannel + '&upUserId=' + config.upUserInfoId, 'get', {}, config.cookie, (data): void => {
                                if (data.data.addDatas.resultlist.length == 0) return;
                                config.cookie = new getCookie(data).getCookie();
                               config.wqPZ=data.data.addDatas.resultlist[0]; //武器配置
                                new GetData('/EatChicken/user/getUserInfos.action', 'get', {}, config.cookie, (datas): void => {
                                    wx.hideLoading();
                                    if (datas.data.addDatas.resultlist.length == 0) return;
                                    let userInfoData: any = datas.data.addDatas.resultlist[0];
                                    config.openId = userInfoData.openId;
                                    config.lookNum = userInfoData.lockAdNum;  //观看广告次数
                                    config.getDayGift = userInfoData.loginTaskNUm ? true : false; //是否领取当日奖励
                                    config.fromChannel = userInfoData.fromChannel;
                                    config.zsNum = userInfoData.money<0?0:userInfoData.money;  //钻石数量
                                    config.authorize = userInfoData.isAuthorize;
                                    Laya.Browser.window.wx.userId = userInfoData.id; //记录userID，分享使用
                                    if (userInfoData.keepGame != null) {
                                        config.saveLevelInfo = JSON.parse(userInfoData.keepGame.value);
                                    }
                                    let goneArr:Array<any>=userInfoData.userWeapons;
                                    for(let i:number=0;i<goneArr.length;++i){
                                        config.gone[i]={};
                                    }
                                    for(let i:number=0;i<goneArr.length;++i){
                                        if(i==2){
                                            config.gone[i]=goneArr[goneArr.length-1];
                                            config.gone[i].zdNum=10;
                                            config.gone[i].name='dgone';
                                            config.gone[i].id=goneArr[goneArr.length-1].id;
                                        }else if(i>2){
                                            config.gone[i]=goneArr[i-1];
                                            config.gone[i].zdNum=i*2;
                                            if(i==3){
                                                config.gone[i].name='bgone'
                                            }else {
                                                config.gone[i].name='jgone'
                                            }
                                            config.gone[i].id=goneArr[i-1].id;
                                        }
                                        else{
                                            config.gone[i]=goneArr[i]
                                            config.gone[i].zdNum=2+i*2;
                                            config.gone[i].id=goneArr[i].id;
                                            if(i==1){
                                                config.gone[i].name='cgone'
                                            }else {
                                                config.gone[i].name='sgone'
                                            }
                                        }
                                    }
                                    let scene: Laya.Scene = new Laya.Scene();
                                    //创建这个场景,分离模式这样使用
                                    scene.loadScene('MyScene/Home.scene');
                                    // scene.loadScene('MyScene/Main.scene');
                                    //分离模式
                                    Laya.stage.addChild(scene);
                                });
                            }, (data): void => {
                                console.log(data)
                            });
                        }
                    })
                }
            });
        } else {
            let scene: Laya.Scene = new Laya.Scene();
            //创建这个场景,分离模式这样使用
            scene.loadScene('MyScene/Home.scene');
            // scene.loadScene('MyScene/Main.scene');
            //分离模式
            Laya.stage.addChild(scene);
        }
    }
    //获取随机数
    public randomNum(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}