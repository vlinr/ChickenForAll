
import GameItem from './GameItem'
import PopupManager from '../popup/PopupManager'
import BtnAnimation from '../common/BtnAnimation';
import config from '../config/config'
import GetData from '../request/GetData'
import Share from '../share/Share'
import SoundManager from '../common/SoundManager';
import FormatNumber from '../common/FormatNumber';
import AllTip from '../common/AllTip';
export default class Home extends Laya.Script {
    private scene: any; //记录场景
    private jewelNum: Laya.Text;
    private clickOk: boolean = true;
    private openRank: boolean = true;
    private openInv: boolean = true;
    private openS: boolean = true;
    constructor() {
        super();
    }
    //提示界面
    onEnable(): void {
        this.scene = this.owner;
        //处理事件区域
        this.scene.width = Laya.stage.width;
        this.scene.height = Laya.stage.height;
        //处理一下适配,按照X进行适配
        let scX: number = Laya.Browser.window.scX;
        let tipBg: any = this.scene.getChildByName('tipBg');
        tipBg.width = this.scene.width;
        tipBg.height = this.scene.height;
        config.useUpLevel = false;
        this.initTips();
    }
    //添加界面元素
    private initTips(): void {
        //从上到下依次添加
        let scX: number = Laya.Browser.window.scX;
        let scY: number = Laya.Browser.window.scY;
        //钻石
        let jewelBg: Laya.Sprite = this.getImage('kaishiyouxi/zsbg.png', 211 * scX, 60 * scX, 40 * scX, 55 * scX);
        //钻石
        // let jewel: Laya.Sprite = this.getImage('kaishiyouxi/gone.png', 47 * scX, 41 * scX, 10 * scX, 11 * scX);
        // jewelBg.addChild(jewel);
        //数量
        this.jewelNum = new Laya.Text();
        this.jewelNum.fontSize = 32 * scX;
        this.jewelNum.text = `${new FormatNumber(config.zsNum).formatPointNumber()}`;
        this.jewelNum.align = 'center';
        this.jewelNum.color='#fff';
        this.jewelNum.width = jewelBg.width - 48*scX;
        this.jewelNum.pos(48*scX, (jewelBg.height - this.jewelNum.height) / 2);
        jewelBg.addChild(this.jewelNum);
        this.scene.addChild(jewelBg);

        //处理logo
        let logo: any = this.scene.getChildByName('logo');
        let logoZone: any = logo.getBounds();
        logo.width = logoZone.width * scX;
        logo.height = logoZone.height * scX;
        logo.pos((Laya.stage.width-logo.width)/2, logoZone.y * scY);

        let logoTween: Laya.TimeLine = new Laya.TimeLine();
        let logoY: number = logo.y;
        logoTween.to(logo, {
            y: logoY - 50 * scX,
        }, 3000, Laya.Ease.linearInOut, 0);
        logoTween.to(logo, {
            y: logoY
        }, 3000, Laya.Ease.linearInOut, 0);
        logoTween.play(0, true);

        //添加中部开始按钮
        let startBox: Laya.Sprite = new Laya.Sprite(); //用于存放开始按钮组
        startBox.width = 363 * scX;

        let startBtn: Laya.Sprite = this.getImage('kaishiyouxi/videoBtn.png', 358 * scX, 195 * scX, (startBox.width - 358 * scX) / 2, 0);
        startBtn.pivot(startBtn.width / 2, startBtn.height / 2);
        startBtn.pos(startBox.width / 2, startBtn.height / 2);
        startBtn.zOrder = 2;
        startBox.addChild(startBtn);


        //普通开始按钮
        let startBtn1: Laya.Sprite = this.getImage('kaishiyouxi/comBtn.png', 184 * scX, 74 * scX, (startBox.width - 184 * scX) / 2, startBtn.height*1.5);
        startBtn1.pivot(startBtn1.width / 2, startBtn1.height / 2);
        startBtn1.pos(startBox.width / 2- startBtn1.width / 1.5, startBtn.height+startBtn1.height+50*scX);
        startBtn1.zOrder = 2;
        startBox.addChild(startBtn1);

        // //添加角色
        // let role: Laya.Sprite = this.getImage('kaishiyouxi/role.png', 103 * scX, 157 * scX, (startBox.width - 103 * scX) / 2, -157 * scX / 1.3);
        // role.zOrder = 1;
        // startBox.addChild(role);

        //添加底部最高纪录
        // let maxScoreBox: Laya.Sprite = new Laya.Sprite();
        // maxScoreBox.y = startBtn.y + startBtn.height / 2 + 20 * scX;
        // let maxIcon: Laya.Sprite = this.getImage('kaishiyouxi/max.png', 47 * scX, 49 * scX, 0, 0);
        let maxText: Laya.Sprite = this.getImage('kaishiyouxi/max.png', 188 * scX, 51 * scX, (startBox.width - 188 * scX) / 2+ startBtn1.width / 1.5, startBtn1.y - 65* scX/2);
        // maxScoreBox.width = maxIcon.width * 1.2 + maxText.width;
        // maxScoreBox.x = (startBox.width - maxScoreBox.width) / 2;
        // maxScoreBox.height = maxIcon.height;
        // maxScoreBox.addChild(maxIcon);
        // maxScoreBox.addChild(maxText);
        startBox.addChild(maxText);
        maxText.on(Laya.Event.CLICK, this, this.popupMax);
        startBox.height = startBtn.height+ startBtn1.height+ maxText.height + maxText.height
        new BtnAnimation(startBtn, () => { }, true).jelly();
        startBox.pos((this.scene.width - startBox.width) / 2, logoY+logo.height+startBtn.height/7);
        //是小游戏的话,使用创建授权按钮
        let clickOnce: any = false;
        let self: any = this;
        //到时候授权需要处理
        if (Laya.Browser.onMiniGame) {
            let wx: any = Laya.Browser.window.wx;
            //授权按钮
            if (!config.authorize) {
                let startGame: any = wx.createUserInfoButton({
                    type: 'image',
                    image: 'jiazai/startBg.jpg',
                    style: {
                        left:0,
                        top: 0,
                        width: Laya.stage.width/2,
                        height: Laya.stage.height/2,
                        opacity: 0.1
                    }
                });
                //授权操作
                startGame.onTap(res => {
                    if (clickOnce) return;
                    clickOnce = true;
                    if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                        // 处理用户拒绝授权的情况,关闭游戏
                        wx.showToast({
                            title: '拒绝授权',
                            icon: '',
                            image: 'jiazai/fails.png'
                        })
                        clickOnce = false;
                    } else if (res.errMsg.indexOf('getUserInfo:ok') > -1) {
                        let invNum = config.userInv == 0 ? 0 : config.userInv + ',' + config.userPage;
                        let rawData = JSON.parse(res.rawData);
                        let userImg = rawData.avatarUrl == "" ? 'jiazai/d.png' : rawData.avatarUrl;
                        config.userImg = userImg;
                        config.nickName = rawData.nickName;
                        new GetData("/EatChicken/user/authorization.action?position=" + encodeURIComponent(rawData.city) + "&nickName=" + encodeURIComponent(rawData.nickName) + "&headUrl=" + encodeURI(userImg) + "&gender=" + rawData.gender + "&inviteUserId=" + invNum, 'get', {}, config.cookie, (data) => {
                            startGame.destroy();
                            config.authorize=true;
                            clickOnce = false;
                            new AllTip('授权成功!');
                            startBtn1.on(Laya.Event.CLICK, self, self.startBtn);
                            //授权成功
                            // let scene: Laya.Scene = new Laya.Scene();
                            // //创建这个场景,分离模式这样使用
                            // scene.loadScene('MyScene/Main.scene');
                            // //分离模式
                            // Laya.stage.addChild(scene);
                            // self.scene.removeSelf();
                        });
                    }
                })
            } else {
                startBtn1.on(Laya.Event.CLICK, this, this.startBtn);
            }
        } else {
            startBtn1.on(Laya.Event.CLICK, this, this.startBtn);
        }
        startBtn.on(Laya.Event.CLICK, this, (e:Laya.Event)=>{
            // new AllTip('暂未开放');
            config.nowLevel = 0;
            config.passLevel = 0;
            config.btPlay=true;
            config.prop = {  //四种道具的数量
                'cz': 10, 'pen': 10, 'resetImg': 10, 'bomb': 10
            }
            let scene: Laya.Scene = new Laya.Scene();
            //创建这个场景,分离模式这样使用
            scene.loadScene('MyScene/Main.scene');
            //分离模式
            Laya.stage.addChild(scene);
            this.scene.removeSelf();
        });
        this.scene.addChild(startBox);
        //添加底部，包括按钮+猜您喜欢
        let btmBox: Laya.Sprite = new Laya.Sprite();
        //添加邀请奖励
        let invitBox: Laya.Sprite = new Laya.Sprite();
        invitBox.width = 113 * scX;
        let invitIcon: Laya.Sprite = this.getImage('kaishiyouxi/inv.png', 100 * scX, 100 * scX, 0, 0);
        let inviText: Laya.Sprite = this.getImage('kaishiyouxi/invTxt.png', 113 * scX, 35 * scX, 0, 111 * scX);
        let red:Laya.Sprite=this.getImage('kaishiyouxi/red.png', 14 * scX, 14 * scX, 95*scX, 5*scX);
        invitBox.height = inviText.height + invitIcon.height;
        invitBox.addChild(inviText);
        invitBox.addChild(invitIcon);
        invitIcon.pivot(invitIcon.width / 2, invitIcon.height / 2);
        invitIcon.pos(invitBox.width/2, invitIcon.height / 2);
        invitBox.addChild(red);
        invitBox.pos((this.scene.width - invitBox.width)/2 + invitBox.width * 2,invitIcon.height / 2)

        //添加排行
        let rankBox: Laya.Sprite = new Laya.Sprite();
        rankBox.width = 113 * scX;
        let rankIcon: Laya.Sprite = this.getImage('kaishiyouxi/rank.png', 116 * scX, 104 * scX, 0, 0);
        let rankText: Laya.Sprite = this.getImage('kaishiyouxi/rankTxt.png', 113 * scX, 35 * scX, 0, 111 * scX);
        let red1:Laya.Sprite=this.getImage('kaishiyouxi/red.png', 14 * scX, 14 * scX,95*scX,  5*scX);
        rankBox.height = rankText.height + rankIcon.height;
        rankBox.addChild(rankText);
        rankBox.addChild(rankIcon);
        rankIcon.pivot(rankIcon.width / 2, rankIcon.height / 2);
        rankIcon.pos(rankBox.width/2, rankIcon.height / 2);
        rankBox.addChild(red1);
        rankBox.pos(invitBox.x - invitBox.width * 2, rankIcon.height / 2);
        //添加分享
        let shareBox: Laya.Sprite = new Laya.Sprite();
        shareBox.width = 113 * scX;
        let shareText: Laya.Sprite = this.getImage('kaishiyouxi/ylikeTxt.png', 107 * scX, 37 * scX, 0, 111 * scX);
        let shareIcon: Laya.Sprite = this.getImage('kaishiyouxi/cirBg.png', 116 * scX, 104 * scX, 0, 0);
        shareBox.height = shareText.height + shareIcon.height;
        shareBox.addChild(shareText);
        shareBox.addChild(shareIcon);
        shareIcon.pivot(shareIcon.width / 2, shareIcon.height / 2);
        shareIcon.pos(shareBox.width/2, shareIcon.height / 2)
        Object.defineProperty(shareIcon,'appid',{
            value:'wxac913252ced539ee',
            writable:true
        })
        shareBox.pos(rankBox.x - invitBox.width * 2, shareIcon.height / 2);
        //添加一个图
        let gameBox:Laya.Sprite=new Laya.Sprite();
        let gOpac:Laya.Sprite=this.getImage('kaishiyouxi/cir.png', 73 * scX, 73 * scX, 0, 0);
        let gImg:Laya.Sprite=this.getImage('kaishiyouxi/game.png', 73 * scX, 73 * scX, 0, 0);
        gameBox.width=73 * scX;
        gameBox.height=73 * scX;
        gameBox.addChild(gOpac);
        gameBox.addChild(gImg);
        gameBox.mask=gOpac;
        gameBox.pos((shareIcon.width-gameBox.width)/2,(shareIcon.height-gameBox.height)/2);
        shareIcon.addChild(gameBox);
        btmBox.addChild(invitBox);
        btmBox.addChild(rankBox);
        btmBox.addChild(shareBox);
        btmBox.pos(0, startBox.y + startBox.height / 2 + 260 * scX);
        this.scene.addChild(btmBox);

        invitIcon.on(Laya.Event.CLICK, this, this.openInvit);
        rankIcon.on(Laya.Event.CLICK, this, this.openRanking);
        shareIcon.on(Laya.Event.CLICK, this, this.openShare);
        //添加浮动元素
        // this.scene.addChild(this.floatRole());
        //添加星星
        // this.scene.addChild(this.randomStar());
        // let getDayGift: any = new PopupManager();
        // this.scene.addChild(getDayGift);
        // getDayGift.pass(function(){

        // });
        //弹出每日礼包，如果领取了，则不弹出
        
        if (config.authorize && !config.getDayGift) {
            let getDayGift: any = new PopupManager();
            this.scene.addChild(getDayGift);
            getDayGift.getDayGift(data => {
                if (data == 1) {
                    config.zsNum += 300;
                    new AllTip('钻石+300');
                } else {
                    config.zsNum += 100;
                    new AllTip('钻石+100');
                }
                this.jewelNum.text = `${new FormatNumber(config.zsNum).formatPointNumber()}`;
            });
        }
        if(config.nickName.indexOf("rdgztest") != -1 || config.nickName.indexOf("minigame") != -1 || config.nickName.indexOf("Lu。")!=-1|| config.nickName.indexOf("水星")!=-1
        || config.nickName.indexOf("Fs")!=-1|| config.nickName.indexOf("子昂2019")!=-1|| config.nickName.indexOf("唐若")!=-1|| config.nickName.indexOf("雨墨")!=-1){
            invitBox.visible=false;
            rankBox.pos(invitBox.x, rankIcon.height / 2);
        }
    }
    //添加星星
    private randomStar(): Laya.Sprite {
        let scX: number = Laya.Browser.window.scX;
        let starBox: Laya.Sprite = new Laya.Sprite();
        let star: Laya.Sprite = this.getImage('kaishiyouxi/star.png', 49 * scX, 52 * scX, -49 * scX, this.scene.height / 1.4);
        star.pivot(star.width / 2, star.height / 2);
        let starTween: Laya.TimeLine = new Laya.TimeLine();
        starTween.to(star, {
            y: 80 * scX,
            x: this.scene.width + 200 * scX,
            rotation: 600
        }, 1000, Laya.Ease.linearInOut, 0);
        starTween.to(star, {

        }, 3000, Laya.Ease.linearInOut, 0);
        starTween.to(star, {
            y: this.scene.height / 1.4,
            x: -49 * scX,
            rotation: 0
        }, 0, Laya.Ease.linearInOut, 0);
        starTween.play(0, true);

        let star1: Laya.Sprite = this.getImage('kaishiyouxi/star.png', 49 * scX, 52 * scX, -49 * scX, this.scene.height / 2);
        star1.pivot(star1.width / 2, star1.height / 2);
        let starTween1: Laya.TimeLine = new Laya.TimeLine();
        starTween1.to(star1, {
            y: -200 * scX,
            x: this.scene.width,
            rotation: 600
        }, 1000, Laya.Ease.linearInOut, 100);
        starTween1.to(star1, {

        }, 3000, Laya.Ease.linearInOut, 0);
        starTween1.to(star1, {
            y: this.scene.height / 1.4,
            x: -49 * scX,
            rotation: 0
        }, 0, Laya.Ease.linearInOut, 0);
        starTween1.play(0, true);

        starBox.addChild(star);
        starBox.addChild(star1);
        return starBox;
    }
    //浮动元素
    private floatRole(): Laya.Sprite {
        let scX: number = Laya.Browser.window.scX;
        let giftBox: Laya.Sprite = new Laya.Sprite();
        giftBox.width = this.scene.width;
        giftBox.height = this.scene.height;
        giftBox.pos(0, 0);
        let gift1: Laya.Sprite = this.getImage('kaishiyouxi/gift1.png', 131 * scX, 135 * scX, 45 * scX, 300 * scX);
        let gift2: Laya.Sprite = this.getImage('kaishiyouxi/gift2.png', 131 * scX, 136 * scX, 590 * scX, 360 * scX);
        let gift3: Laya.Sprite = this.getImage('kaishiyouxi/gift3.png', 90 * scX, 93 * scX, 595 * scX, 565 * scX);
        let gift4: Laya.Sprite = this.getImage('kaishiyouxi/gift4.png', 106 * scX, 111 * scX, 70 * scX, 675 * scX);

        giftBox.addChild(gift1);
        giftBox.addChild(gift2);
        giftBox.addChild(gift3);
        giftBox.addChild(gift4);

        //添加动画，让其动起来
        let tweenGift1: Laya.TimeLine = new Laya.TimeLine();
        let g1y: number = gift1.y;
        tweenGift1.to(gift1, {
            y: g1y - 30 * scX
        }, 3000, Laya.Ease.linearInOut, 0);
        tweenGift1.to(gift1, {
            y: g1y
        }, 3000, Laya.Ease.linearInOut, 0);
        tweenGift1.play(0, true)

        let tweenGift2: Laya.TimeLine = new Laya.TimeLine();
        let g2y: number = gift2.y;
        tweenGift2.to(gift2, {
            y: g2y - 40 * scX
        }, 3000, Laya.Ease.linearInOut, 0);
        tweenGift2.to(gift2, {
            y: g2y
        }, 3000, Laya.Ease.linearInOut, 0);
        tweenGift2.play(0, true)

        let tweenGift3: Laya.TimeLine = new Laya.TimeLine();
        let g3y: number = gift3.y;
        tweenGift3.to(gift3, {
            y: g3y - 25 * scX
        }, 3300, Laya.Ease.linearInOut, 0);
        tweenGift3.to(gift3, {
            y: g3y
        }, 3300, Laya.Ease.linearInOut, 0);
        tweenGift3.play(0, true)

        let tweenGift4: Laya.TimeLine = new Laya.TimeLine();
        let g4y: number = gift4.y;
        tweenGift4.to(gift4, {
            y: g4y - 30 * scX
        }, 4000, Laya.Ease.linearInOut, 0);
        tweenGift4.to(gift4, {
            y: g4y
        }, 4000, Laya.Ease.linearInOut, 0);
        tweenGift4.play(0, true)
        return giftBox;
    }

    //排行
    private openRanking(e: Laya.Event): void {
        new SoundManager('shengyin/btn.mp3', false, 1);
        if (!this.openRank) return;
        this.openRank = false;
        new BtnAnimation(e.target, data => {
            let maxResult: any = new PopupManager((data: any) => {
                this.openRank = true;
            });
            this.scene.addChild(maxResult);
            maxResult.rankBox();
            console.log('排行')
        }).jelly();
    }
    //邀请
    private openInvit(e: Laya.Event): void {
        new SoundManager('shengyin/btn.mp3', false, 1);
        if (!this.openInv) return;
        this.openInv = false;
        new BtnAnimation(e.target, data => {
            let maxResult: any = new PopupManager((data: any) => {
                this.openInv = true;
            });
            this.scene.addChild(maxResult);
            maxResult.invGift(data => {
                config.zsNum += parseInt(data);
                this.jewelNum.text = `${config.zsNum}`;
            });
            console.log('邀请')
            this.openInv = true;
        }).jelly();
    }
    //分享
    private openShare(e: Laya.Event): void {
        new SoundManager('shengyin/btn.mp3', false, 1);
        if (!this.openS) return;
        this.openS = false;
        let self:any=this;
        let target:any=e.target;
        new BtnAnimation(target, data => {
            // console.log('分享')
            // let randomNum: number = this.randomNum(0, config.shareText.length - 1);
            // new Share((randomNum + 1), config.shareText[randomNum]).activeShare(config.shareText[randomNum]);
            Laya.Browser.window.wx.navigateToMiniProgram({
                appId: `${target.appid}`,
                path: 'pages/index/index?fromChannel=cjxxx',
                success(res) {//跳转成功
                    self.openS = false;
                },
                fail(res) {
                    self.openS = false;
                }
              });
            this.openS = true;
        }).jelly();
    }
    //获取随机数
    public randomNum(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    //随机获取一个图标，给一个动画
    private randIcon(): void {
        let iconArr: Array<any> = [];
    }
    //弹出最高纪录列表
    private popupMax(): void {
        console.log('弹出最高纪录')
        new SoundManager('shengyin/btn.mp3', false, 1);
        if (!config.openSuccess) return;
        config.openSuccess = false;
        let maxResult: any = new PopupManager();
        this.scene.addChild(maxResult);
        maxResult.continueGame(data => {
            if (data == 1) {
                config.btPlay=false;
                config.prop = {  //四种道具的数量
                    'cz': 1, 'pen': 1, 'resetImg': 1, 'bomb': 1
                }
                let scene: Laya.Scene = new Laya.Scene();
                //创建这个场景,分离模式这样使用
                scene.loadScene('MyScene/Main.scene');
                //分离模式
                Laya.stage.addChild(scene);
                this.scene.removeSelf();
            }
        });
    }
    //处理开始游戏逻辑,如授权等操作
    private startBtn(e: Laya.Event): void {
        // if (!this.clickOk) return;
        // this.clickOk = false;
        // new BtnAnimation(e.target, data => {
        new SoundManager('shengyin/btn.mp3', false, 1);
        this.clickOk = true;
        if (!config.gameOver && config.saveLevelInfo != null) {
            let getDayGift: any = new PopupManager();
            this.scene.addChild(getDayGift);
            getDayGift.redSave(data => {
                if (data == 1) {  //新的开始
                    config.nowLevel = 0;
                    config.passLevel = 0;
                    config.btPlay=false;
                    config.prop = {  //四种道具的数量
                        'cz': 1, 'pen': 1, 'resetImg': 1, 'bomb': 1
                    }
                    let scene: Laya.Scene = new Laya.Scene();
                    //创建这个场景,分离模式这样使用
                    scene.loadScene('MyScene/Main.scene');
                    //分离模式
                    Laya.stage.addChild(scene);
                    this.scene.removeSelf();
                } else { //记录开始
                    config.useUpLevel = true;
                    config.btPlay=false;
                    config.userUpArr = config.saveLevelInfo.value;
                    config.nowLevel = config.saveLevelInfo.checkpoint;
                    config.userHp = config.saveLevelInfo.result;
                    config.userNowHp = config.saveLevelInfo.surplusResult;
                    config.passLevel = config.saveLevelInfo.maxResult;
                    config.prop = config.saveLevelInfo.prop;
                    config.showTxt = config.saveLevelInfo.showTxt;
                    let scene: Laya.Scene = new Laya.Scene();
                    //创建这个场景,分离模式这样使用
                    scene.loadScene('MyScene/Main.scene');
                    //分离模式
                    Laya.stage.addChild(scene);
                    this.scene.removeSelf();
                }
            });
        } else {
            config.nowLevel = 0;
            config.passLevel = 0;
            config.prop = {  //四种道具的数量
                'cz': 1, 'pen': 1, 'resetImg': 1, 'bomb': 1
            }
            // var wrData = this.rbg.getChildByName('layaList');
            // var openData = this.rbg.getChildByName('openData');
            let scene: Laya.Scene = new Laya.Scene();
            //创建这个场景,分离模式这样使用
            scene.loadScene('MyScene/Main.scene');
            //分离模式
            Laya.stage.addChild(scene);
            this.scene.removeSelf();
        }
        console.log('开始游戏')
        // })

    }
    private getImage(key: string, _w: number, _h: number, x: number = 0, y: number = 0): Laya.Sprite {
        let sp: Laya.Sprite = new Laya.Sprite();
        sp.width = _w;
        sp.height = _h;
        sp.graphics.drawTexture(Laya.loader.getRes(`${key}`), 0, 0, _w, _h);
        sp.pos(x, y);
        return sp;
    }
    //更多游戏列表
    private moreGameList(parm: Array<any>, parent: any): void {
        let len: number = 0;
        for (let i: number = 0; i < parm.length; ++i) {
            Laya.loader.load(`${parm[i].icon}`, null, Laya.Handler.create(this, (e: Laya.Event): void => {
                len++;
                if (len == parm.length) {
                    let scX: number = Laya.Browser.window.scX;
                    let layaList: Laya.List = new Laya.List();
                    layaList.itemRender = GameItem; //必须设置，这个类代表更新时候的处理
                    layaList.repeatX = 4;
                    layaList.repeatY = 1; //y轴个数 
                    layaList.name = 'layaList';
                    layaList.x = 25 * scX;
                    layaList.y = 50 * scX;
                    layaList.width = 700 * scX;
                    layaList.spaceX = (700 * scX - 103 * scX * 4) / 3;
                    // 使用但隐藏滚动条
                    layaList.hScrollBarSkin = "";
                    layaList.selectEnable = true;
                    // layaList.selectHandler = new Laya.Handler(this, this.onSelect);
                    // layaList.renderHandler = new Laya.Handler(this, this.updateItem);
                    let data: Array<any> = [];
                    for (let j: number = 0; j < parm.length; ++j) {
                        let gameBox: Laya.Sprite = new Laya.Sprite();
                        gameBox.width = 103 * scX;
                        gameBox.height = 103 * scX;
                        gameBox.size(1, 1);
                        gameBox.pos(103 * scX, 0);
                        let itemSprite: Laya.Sprite = new Laya.Sprite();
                        itemSprite.width = 103 * scX;
                        itemSprite.height = 103 * scX;
                        itemSprite.graphics.drawTexture(Laya.loader.getRes(`kaishiyouxi/gameCir.png`), 0, 0, 103 * scX, 103 * scX);
                        itemSprite.pos(0, 0);
                        //添加游戏图标
                        let gameImg: Laya.Sprite = new Laya.Sprite();
                        // gameImg.loadImage(listData[i].icon);
                        gameImg.width = 103 * scX;
                        gameImg.height = 103 * scX;
                        //设置属性
                        Object.defineProperty(gameImg, 'appId', {
                            value: parm[j].appid
                        })
                        gameImg.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
                            new SoundManager('shengyin/btn.mp3', false, 1);
                            let target: any = e.target;
                            if (Laya.Browser.onMiniGame) {
                                Laya.Browser.window.wx.navigateToMiniProgram({
                                    appId: target.appId,
                                    path: 'page/index/index',
                                    extraData: {
                                        formChannel: 'xmznxc'
                                    },
                                    envVersion: 'develop',
                                    success(res) {
                                        // 打开成功
                                    }
                                })
                            }

                        });
                        gameImg.graphics.drawTexture(Laya.loader.getRes(`${parm[j].icon}`), 0, 0, 103 * scX, 103 * scX);
                        gameImg.pos(0, 0)
                        gameBox.addChild(itemSprite);
                        gameBox.addChild(gameImg);
                        gameBox.mask = itemSprite;
                        data.push(gameBox);
                    }
                    layaList.array = data;
                    parent.addChild(layaList);
                }
            }, null, false))
        }
    }
}