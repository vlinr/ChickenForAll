import ItemRank from './ItemRank'
import ItemInv from './ItemInv'
import config from '../config/config'
import AllTip from '../common/AllTip';
import GetData from '../request/GetData'
import Share from '../share/Share';
import SoundManager from '../common/SoundManager';
import BtnAnimation from '../common/BtnAnimation';
import FormatNumber from '../common/FormatNumber';
export default class PopupManager extends Laya.Sprite {
    private rbg: Laya.Sprite;
    constructor(callBack: any = null) {
        super();
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.pivot(this.width / 2, this.height / 2);
        this.pos(this.width / 2, this.height / 2)
        this.scaleX = 0;
        this.scaleY = 0;
        Laya.Tween.to(this, {
            scaleX: 1,
            scaleY: 1,
            update: Laya.Handler.create(this, e => {
            })
        }, 300, Laya.Ease.elasticInOut, Laya.Handler.create(this, e => {
            config.openSuccess = true;
            if (callBack !== null) callBack();
        }), 0);
    }
    //最高纪录弹出
    public maxList(): void {
        let maxOpacity: Laya.Sprite = this.opacityBg();
        // let maxBg:
        this.addChild(maxOpacity);
    }
    //制作排行
    public rankBox(): void {
        let rankOpacity: Laya.Sprite = this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        this.rbg = this.getImage('paihangbang/rBg.png', 742 * scX, 1277 * scX, (rankOpacity.width - 742 * scX) / 2, (rankOpacity.height - 1200 * scX) / 2);
        //添加按钮
        let btn: any = this.getImage('paihangbang/friend1.png', 244 * scX, 108 * scX, 395 * scX, 145 * scX);
        btn.zOrder = 3;
        btn.select = false;
        let clickOnce: boolean = false;
        let dataOk: boolean = false;
        btn.on(Laya.Event.CLICK, this, e => {
            if (!dataOk) return;
            if (btn.select) return;
            btn.select = true;
            new SoundManager('shengyin/btn.mp3', false, 1);
            if (clickOnce) return;
            clickOnce = true;
            btn.graphics.clear();  //先清除原来的纹理
            var texture = Laya.loader.getRes('paihangbang/friend.png'); //获取已加载的新的纹理
            btn.graphics.drawTexture(texture, 0, 0, 244 * scX, 108 * scX); //开始绘制
            // 设置交互区域
            btn.size(texture.width, texture.height);
            btn1.graphics.clear();  //先清除原来的纹理
            var texture1 = Laya.loader.getRes('paihangbang/world1.png'); //获取已加载的新的纹理
            btn1.graphics.drawTexture(texture1, 0, 0, 244 * scX, 108 * scX); //开始绘制
            // 设置交互区域
            btn1.size(texture1.width, texture1.height);
            let frData: any = this.friendRankList();
            if (frData != null) this.rbg.addChild(frData);
            clickOnce = false;
            btn1.select = false;
        });
        //打开世界排行
        let btn1: any = this.getImage('paihangbang/world.png', 244 * scX, 108 * scX, 80 * scX, 145 * scX);
        btn1.zOrder = 3;
        btn1.select = true;
        let clickOnce1: boolean = false;
        btn1.on(Laya.Event.CLICK, this, e => {
            if (!dataOk) return;
            if (btn1.select) return;
            btn1.select = true;
            new SoundManager('shengyin/btn.mp3', false, 1);
            if (clickOnce) return;
            clickOnce = true;
            var texture = Laya.loader.getRes('paihangbang/friend1.png'); //获取已加载的新的纹理
            btn.graphics.drawTexture(texture, 0, 0, 244 * scX, 108 * scX); //开始绘制
            // 设置交互区域
            btn.size(texture.width, texture.height);
            btn1.graphics.clear();  //先清除原来的纹理
            var texture1 = Laya.loader.getRes('paihangbang/world.png'); //获取已加载的新的纹理
            btn1.graphics.drawTexture(texture1, 0, 0, 244 * scX, 108 * scX); //开始绘制
            // 设置交互区域
            btn1.size(texture1.width, texture1.height);
            if (Laya.Browser.onMiniGame) {
                let wx: any = Laya.Browser.window.wx;
                wx.showLoading({
                    title: '加载中...'
                });
            }
            let wrData: any = this.rbg.getChildByName('layaList');
            let openData: any = this.rbg.getChildByName('openData');
            if (openData != null) openData.visible = false;
            if (wrData != null) {
                wrData.visible = true;
                clickOnce = false;
                btn.select = false;
                if (Laya.Browser.onMiniGame) {
                    Laya.Browser.window.wx.hideLoading();
                }
            } else {
                new GetData("/EatChicken/user/getRanking.action?firstIndex=1&maxresult=100", 'get', {}, config.cookie, (data) => {
                    clickOnce = false;
                    let wrData: any = this.worldList(data.data.addDatas.resultlist, data.data.message);  //添加排行
                    this.rbg.addChild(wrData);
                    btn.select = false;
                });
            }
        });
        //添加关闭
        let close: Laya.Sprite = this.getImage('paihangbang/close.png', 47 * scX, 39 * scX, this.rbg.width - 47 * scX - 50 * scX, 50 * scX);
        close.zOrder = 6;
        close.on(Laya.Event.CLICK, this, () => {
            if(!dataOk)return;
            let wrData: any = this.rbg.getChildByName('layaList');
            let openData: any = this.rbg.getChildByName('openData');
            if (wrData != null) this.rbg.removeChildByName('layaList');
            if (openData != null) this.rbg.removeChildByName('openData');
            new SoundManager('shengyin/btn.mp3', false, 1);
            this.hidePopup();
        });
        //添加分享
        // let share: Laya.Sprite = this.getImage('paihangbang/share.png', 151 * scX, 70 * scX, (this.rbg.width - 151 * scX) / 2, this.rbg.height+70*scX/2);
        // share.on(Laya.Event.CLICK, this, () => {
        //     new SoundManager('shengyin/btn.mp3', false, 1);
        //     console.log('分享')
        //     let randomNum: number = this.randomNum(0, config.shareText.length - 1);
        //     new Share((randomNum + 1), config.shareText[randomNum]).activeShare(config.shareText[randomNum]);
        // });
        // this.rbg.addChild(rstar);
        // this.rbg.addChild(rgz);
        this.rbg.addChild(btn);
        this.rbg.addChild(btn1);
        this.rbg.addChild(close);
        // this.rbg.addChild(share);
        if (Laya.Browser.onMiniGame) {
            let wx: any = Laya.Browser.window.wx;
            wx.showLoading({
                title: '加载中...'
            });
        }
        new GetData("/EatChicken/user/getRanking.action?firstIndex=1&maxresult=100", 'get', {}, config.cookie, (data) => {
            clickOnce = false;
            dataOk = true;
            let wrData: any = this.worldList(data.data.addDatas.resultlist, data.data.message);  //添加排行
            this.rbg.addChild(wrData);
        });
        // this.rbg.addChild(this.friendRankList());
        rankOpacity.addChild(this.rbg);
        this.addChild(rankOpacity);

    }
    //获取随机数
    public randomNum(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    private hidePopup(): void {
        let timeHide: any = new Laya.TimeLine();
        timeHide.to(this, {
            scaleX: 0,
            scaleY: 0
        }, 500, Laya.Ease.elasticInOut, 0);
        timeHide.on(Laya.Event.COMPLETE, this, e => {
            this.removeSelf();
        });
        timeHide.play(0, false);
    }
    //世界排行
    private worldList(arrData: Array<any>, myNum: string): Laya.Sprite {
        let wrData: any = this.rbg.getChildByName('layaList');
        let openData: any = this.rbg.getChildByName('openData');
        if (openData != null) openData.visible = false;
        if (wrData != null) {
            wrData.visible = true;
            if (Laya.Browser.onMiniGame) {
                Laya.Browser.window.wx.hideLoading();
            }
            return null;
        }
        let spriteBox: Laya.Sprite = new Laya.Sprite();
        spriteBox.name = 'layaList';
        //添加列表
        let layaList: Laya.List = new Laya.List();
        let scX: number = Laya.Browser.window.scX;
        let scY: number = Laya.Browser.window.scY;
        layaList.itemRender = ItemRank; //必须设置，这个类代表更新时候的处理
        layaList.repeatX = 1;
        layaList.repeatY = 5; //y轴个数 
        // layaList.name = 'layaList';
        layaList.x = 0;
        // layaList.y = this.friendBtn.y + this.friendBtn.height * 1.5;
        layaList.y = 0;
        // 使用但隐藏滚动条
        layaList.vScrollBarSkin = "";
        layaList.selectEnable = true;
        // layaList.selectHandler = new Laya.Handler(this, this.onSelect);
        // layaList.renderHandler = new Laya.Handler(this, this.updateItem);
        let data: Array<any> = [];
        for (let i: number = 0; i < arrData.length - 1; ++i) {
            //添加背景
            let listItem: Laya.Sprite = new Laya.Sprite();
            listItem.width = 640 * scX;
            listItem.height = 158 * scX;
            listItem.pos(0, i * 5);
            listItem.graphics.drawTexture(Laya.loader.getRes('paihangbang/right.png'), 0, 0, 640 * scX, 158 * scX);
            let gou: Laya.Sprite = new Laya.Sprite();
            gou.width = 84 * scX;
            gou.height = 87 * scX;
            gou.graphics.drawTexture(Laya.loader.getRes('paihangbang/rlbg.png'), 0, 0, 84 * scX, 87 * scX);
            var rankNum: any;
            rankNum = new Laya.Text();
            rankNum.text = `${i + 1}`;
            rankNum.color = '#fff';
            // rankNum.font = 'whiteShard';
            rankNum.fontSize = 28 * scX;
            rankNum.width = gou.width / 1.2;
            rankNum.align = 'center';
            rankNum.pos(0, (gou.height - rankNum.height) / 1.5);
            gou.pos(20 * scX, (listItem.height - gou.height) / 2);
            gou.addChild(rankNum);
            listItem.addChild(gou);

            let imgBox: Laya.Sprite = new Laya.Sprite();
            let opacImg: Laya.Sprite = new Laya.Sprite();
            opacImg.width = 89 * scX;
            opacImg.height = 89 * scX;
            opacImg.graphics.drawTexture(Laya.loader.getRes('paihangbang/cir.png'), 0, 0, 89 * scX, 89 * scX);
            //添加游戏图标
            let userImg: Laya.Sprite = new Laya.Sprite();
            userImg.width = 89 * scX;
            userImg.height = 89 * scX;
            // userImg.graphics.drawTexture(Laya.loader.getRes('img/home/startBg.jpg'), 0, 0, 80 * scX, 80 * scX);
            userImg.loadImage(`${arrData[i].headUrl}`);
            imgBox.pos(gou.x + gou.width + 10 * scX, (listItem.height - opacImg.height) / 2);

            imgBox.addChild(opacImg);
            imgBox.addChild(userImg);
            imgBox.mask = opacImg;
            listItem.addChild(imgBox);

            //添加右侧
            let rightBg: Laya.Sprite = new Laya.Sprite();
            rightBg.width = 389 * scX;
            rightBg.height = 94 * scX;
            rightBg.graphics.drawTexture(Laya.loader.getRes('paihangbang/list1.png'), 0, 0, 389 * scX, 94 * scX);
            rightBg.pos(imgBox.x + userImg.width + 10 * scX, (listItem.height - rightBg.height) / 2);

            let nickName: Laya.Text = new Laya.Text();
            let userNameLen: any = arrData[i].nickName.toString().length > 6 ? arrData[i].nickName.substring(0, 6) + '...' : arrData[i].nickName;
            nickName.text = `${userNameLen}`;
            nickName.color = '#fff';
            nickName.fontSize = 26 * scX;
            nickName.bold = true;
            nickName.pos(15 * scX, (rightBg.height - nickName.height) / 2);
            rightBg.addChild(nickName);
            //添加分数
            let score: Laya.Text = new Laya.Text();
            score.text = `${arrData[i].checkpoint}关`;
            score.align = 'right';
            score.color = '#fff99a';
            // score.font = 'whiteLevel';
            score.fontSize = 30 * scX;
            score.pos(389 * scX - score.width - 15 * scX, (rightBg.height - score.getBounds().height) / 2)
            rightBg.addChild(score);

            listItem.addChild(rightBg);
            data.push(listItem);
        }
        layaList.array = data;
        spriteBox.pos((this.rbg.width - 640 * scX) / 2, 265 * scX);
        //添加最后一个元素
        let listItem: Laya.Sprite = new Laya.Sprite();
        listItem.width = 620 * scX;
        listItem.height = 98 * scX;
        listItem.pos((640 * scX - 620 * scX) / 2, 780 * scX);
        listItem.graphics.drawTexture(Laya.loader.getRes('paihangbang/my.png'), 0, 0, 620 * scX, 98 * scX);

        let leftText: Laya.Text = new Laya.Text();
        leftText.text = `你的排名`;
        leftText.color = '#482b1c';
        leftText.fontSize = 30 * scX;
        leftText.pos(40 * scX, (listItem.height - leftText.height) / 2)
        listItem.addChild(leftText);

        //添加分数
        let score: Laya.Text = new Laya.Text();
        score.text = `${myNum}名`;
        score.align = 'right';
        score.color = '#fff';
        score.stroke = 1;
        score.strokeColor = '#21201f'
        score.fontSize = 30 * scX;
        score.pos(listItem.width - score.width - 40 * scX, (listItem.height - score.height) / 2)
        listItem.addChild(score);

        //添加游戏规则按钮
        let gameGz: Laya.Sprite = new Laya.Sprite();
        gameGz.width = 125 * scX;
        gameGz.height = 37 * scX;
        gameGz.pos((640 * scX - gameGz.width) / 2, listItem.y + listItem.height + 8 * scX);
        gameGz.graphics.drawTexture(Laya.loader.getRes('paihangbang/xt.png'), 0, 0, 125 * scX, 37 * scX);

        let redPoint: Laya.Sprite = new Laya.Sprite();
        redPoint.width = 14 * scX;
        redPoint.height = 14 * scX;
        redPoint.pos(gameGz.width - 14 * scX / 2, -14 * scX / 2);
        redPoint.graphics.drawTexture(Laya.loader.getRes('paihangbang/red.png'), 0, 0, 14 * scX, 14 * scX);
        gameGz.addChild(redPoint);
        gameGz.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
            this.showGZ();
        });
        spriteBox.addChild(layaList);
        spriteBox.addChild(listItem);
        spriteBox.addChild(gameGz);
        if (Laya.Browser.onMiniGame) {
            Laya.Browser.window.wx.hideLoading();
        }
        return spriteBox;
    }
    //打开规则
    private showGZ(): void {
        let aliveOpac = this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let aliveBg: Laya.Sprite = this.getImage('paihangbang/gz.png', 662 * scX, 637 * scX, (aliveOpac.width - 662 * scX) / 2, (aliveOpac.height - 637 * scX) / 2);
        let cf: Laya.Sprite = this.getImage('paihangbang/cf.png', 167 * scX, 70 * scX, (aliveBg.width - 167 * scX) / 2, 485 * scX);
        aliveBg.addChild(cf);
        cf.on(Laya.Event.CLICK, this, () => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            aliveOpac.removeSelf();
        });
        aliveOpac.addChild(aliveBg);
        this.addChild(aliveOpac);
    }
    //好友排行
    private friendRankList(): Laya.WXOpenDataViewer {
        let wrData: any = this.rbg.getChildByName('layaList');
        let openData: any = this.rbg.getChildByName('openData');
        if (wrData != null) { wrData.visible = false; }
        if (openData != null) {
            openData.visible = true;
            return null;
        }
        if (Laya.Browser.onMiniGame) {
            let scX: number = Laya.Browser.window.scX;
            let scY: number = Laya.Browser.window.scY;
            let wx: any = Laya.Browser.window.wx;
            let openData: any = new Laya.WXOpenDataViewer();
            openData.name = 'openData';
            openData.width = 640 * scX;
            openData.height = 935 * scX;
            openData.pos((this.rbg.width - 640 * scX) / 2, 270 * scX);
            let openDataContext: any = wx.getOpenDataContext();
            openDataContext.postMessage({ action: 'clear' });
            openDataContext.postMessage({ action: 'ranking', gameData: [scX, config.openId] });//第一个参数缩放比，第二个参数openid
            return openData;
        }
        return null;
    }
    private getImage(key: string, _w: number, _h: number, x: number = 0, y: number = 0): Laya.Sprite {
        let sp: Laya.Sprite = new Laya.Sprite();
        sp.width = _w;
        sp.height = _h;
        sp.graphics.drawTexture(Laya.loader.getRes(`${key}`), 0, 0, _w, _h);
        sp.pos(x, y);
        return sp;
    }
    //透明层
    private opacityBg(): Laya.Sprite {
        let opacity: Laya.Sprite = new Laya.Sprite();
        opacity.x = 0;
        opacity.y = 0;
        opacity.width = Laya.stage.width;
        opacity.height = Laya.stage.height;
        let graphics: Laya.Graphics = new Laya.Graphics();
        graphics.clear();
        graphics.save();
        graphics.alpha(0.6);
        graphics.drawRect(0, 0, this.width, this.height, '#000000');
        graphics.restore();
        opacity.graphics = graphics;
        opacity.on(Laya.Event.CLICK, this, (): any => {
            return false;
        })
        this.addChild(opacity);
        return opacity;
    }
    private opacityBg1(): Laya.Sprite {
        let opacity: Laya.Sprite = this.getImage('daoju/popupBg.png', Laya.stage.width, Laya.stage.height, 0, 0);
        opacity.on(Laya.Event.CLICK, this, (): any => {
            return false;
        })
        this.addChild(opacity);
        return opacity;
    }
    //复活界面
    public alivePopup(callback: any): void {
        let aliveOpac = this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let aliveBg: Laya.Sprite = this.getImage('fuhuo/beijing.png', 662 * scX, 560 * scX, (aliveOpac.width - 662 * scX) / 2, (aliveOpac.height - 660 * scX) / 2);
        //看视频复活
        if (config.lookNum <= 10) {
            let aliveBtn: Laya.Sprite = this.getImage('fuhuo/kanshiping.png', 200 * scX, 70 * scX, (aliveBg.width - 200 * scX) / 2, aliveBg.height - 70 * scX * 1.75);
            aliveBtn.on(Laya.Event.CLICK, this, e => {
                new SoundManager('shengyin/btn.mp3', false, 1);
                console.log('复活')
                new GetData("/EatChicken/user/lockAd.action", 'get', {}, config.cookie, (data) => {
                    config.lookNum++;
                    this.hidePopup();
                    callback(4);
                });
            })
            aliveBg.addChild(aliveBtn);
        } else {
            //分享复活
            let aliveBtn: Laya.Sprite = this.getImage('fuhuo/fenxiang.png', 200 * scX, 70 * scX, (aliveBg.width - 200 * scX) / 2, aliveBg.height - 70 * scX * 1.75);
            aliveBtn.on(Laya.Event.CLICK, this, e => {
                new SoundManager('shengyin/btn.mp3', false, 1);
                console.log('复活')
                Laya.Browser.window.timeDesc = new Date().getTime();  //记录当前时间
                let randomNum: number = this.randomNum(0, config.shareText.length - 1);
                new Share((randomNum + 1), config.shareText[randomNum]).activeShare(config.shareText[randomNum], null, null, null, null, data => {
                    if (data == 1) {
                        callback(4);
                        console.log('领取成功')
                    } else {
                        Laya.Browser.window.wx.showToast({
                            title: '分享失败',
                            icon: '',
                            image: 'jiazai/fails.png'
                        })
                    }
                    this.hidePopup();
                });
            })
            aliveBg.addChild(aliveBtn);
        }
        //跳过
        let jumpBtn: Laya.Sprite = this.getImage('fuhuo/tiaoguo.png', 97 * scX, 26 * scX, (aliveBg.width - 97 * scX) / 2, aliveBg.height + 70 * scX * 1.5);
        jumpBtn.on(Laya.Event.CLICK, this, e => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            console.log('跳过');
            this.hidePopup();
            callback(-1);
        })
        jumpBtn.alpha = .6;
        // let close: Laya.Sprite = this.getImage('paihangbang/close.png', 76 * scX, 62 * scX, aliveBg.width - 76 * scX, 100 * scX);
        // close.zOrder = 1;
        // close.on(Laya.Event.CLICK, this, () => {
        //     this.hidePopup();
        // });

        // aliveBg.addChild(close);
        aliveBg.addChild(jumpBtn);
        aliveOpac.addChild(aliveBg);
        this.addChild(aliveOpac);
    }
    //获得道具界面
    public getProp(propName: string, num: number, target: any, getType: boolean = false): void {
        let giftOpac = this.opacityBg1();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let giftBox: Laya.Sprite = new Laya.Sprite();
        //添加顶部文字
        let txtTop: Laya.Sprite = this.getImage('daoju/topTxt.png', 427 * scX, 66 * scX, (giftOpac.width - 427 * scX) / 2, 0);
        txtTop.zOrder = 1;
        //添加第二层文字
        let txtBg: Laya.Sprite = this.getImage('daoju/txtBg.png', 322 * scX, 60 * scX, (giftOpac.width - 322 * scX) / 2, txtTop.y + txtTop.height * 1.5);
        //添加文字
        var txt: Laya.Text = new Laya.Text();
        let str: string = '';
        if (propName == 'gcz') str = `获得道具：炸弹${num}个`;
        if (propName == 'greset') str = `获得道具：闪光弹${num}个`;
        if (propName == 'glx') str = `获得道具：信号枪${num}个`;
        if (propName == 'gsz') str = `获得道具：烟雾弹${num}个`;
        if (propName == 'gzs') str = `获得钻石：+${num}`;
        txt.text = `${str}`;
        txt.fontSize = 32 * scX;
        txt.width = 300 * scX;
        txt.font = 'clawFont';
        txt.pos((txtBg.width - txt.width) / 2, (txtBg.height - txt.getBounds().height) / 2);
        txtBg.addChild(txt);
        //添加圈圈
        let cir: Laya.Sprite = this.getImage('daoju/cir.png', 750 * scX, 832 * scX, (giftOpac.width - 750 * scX) / 2, txtTop.y + txtBg.height);
        /*******
         * 
         * 道具太小
         * 
         * *******/
        let prop: Laya.Sprite = this.getImage(`daoju/${propName}.png`, 86 * scX * 2, 98 * scX * 2, (cir.width - 86 * scX * 2) / 2, (cir.height - 98 * scX * 2) / 2);
        cir.addChild(prop);

        //添加领取按钮
        giftBox.addChild(txtTop);
        giftBox.addChild(txtBg);
        giftBox.addChild(cir);
        //领取按钮
        let getGift: Laya.Sprite = this.getImage('daoju/get.png', 272 * scX, 94 * scX, giftOpac.width / 2, cir.y + cir.height + 94 * scX / 2);
        getGift.pivot(getGift.width / 2, getGift.height / 2);
        getGift.on(Laya.Event.CLICK, this, () => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            if (!getType) {
                console.log('免费获得')
                // config.levelGetNum--;
                // this.hidePopup();
                // let rx: number = 0, ry: number = 0;
                // this.getGiftCode(propName, num, target);
                // new AllTip('领取成功');
            } else {
                console.log('看视频领取或者分享')
                // new GetData("/EatChicken/user/lockAd.action", 'get', {}, config.cookie, (data) => {
                //     config.lookNum++;
                //     new AllTip('暂未开放');
                //     return;
                // });
                Laya.Browser.window.timeDesc = new Date().getTime();  //记录当前时间
                let randomNum: number = this.randomNum(0, config.shareText.length - 1);
                new Share((randomNum + 1), config.shareText[randomNum]).activeShare(config.shareText[randomNum], null, null, null, null, data => {
                    if (data == 1) {
                        console.log('领取成功')
                        if (propName == 'gzs') {
                            new GetData("/EatChicken/user/addMoney.action?count=500", 'get', {}, config.cookie, (data) => {
                                new AllTip('领取成功');
                            });
                        }
                    } else {
                        Laya.Browser.window.wx.showToast({
                            title: '分享失败',
                            icon: '',
                            image: 'jiazai/fails.png'
                        })
                    }
                });
            }
            this.hidePopup();
            let rx: number = 0, ry: number = 0;
            this.getGiftCode(propName, num, target);
            new AllTip('领取成功');
            if (Laya.stage.getChildByName('getDayGift') != null) Laya.stage.removeChildByName('getDayGift');
        });
        giftBox.addChild(getGift);
        let jumpBtn: Laya.Sprite = this.getImage('daoju/fq.png', 121 * scX, 33 * scX, (giftOpac.width - 121 * scX) / 2, getGift.y + getGift.height * 1.2);
        jumpBtn.on(Laya.Event.CLICK, this, e => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            console.log('跳过');
            this.hidePopup();
        })
        jumpBtn.alpha = .6;
        giftBox.addChild(jumpBtn);
        giftBox.width = giftOpac.width;
        giftBox.height = txtTop.height + txtBg.height + cir.height + getGift.height;
        giftBox.pos(0, (giftOpac.height - giftBox.height) / 2);
        new BtnAnimation(getGift, () => { }, true).zoom();
        giftOpac.addChild(giftBox);
        this.addChild(giftOpac);
    }
    //领取逻辑,
    private getGiftCode(name: string, num: number, target: any): void {
        let btnGroup: any = target.btnGroup;
        let scX: number = Laya.Browser.window.scX;
        if (name == 'gcz') {  //锤子
            let boxSp: any = btnGroup.getChildAt(1); //锤子的盒子
            //创建道具
            let goX: number = btnGroup.x + boxSp.x;
            let goY: number = btnGroup.y + boxSp.y;
            this.getPropAnim(boxSp, goX, goY, num, scX);
            config.prop['cz'] += num;
        } else if (name == 'glx') {
            let boxSp: any = btnGroup.getChildAt(4); //流星的盒子
            let goX: number = btnGroup.x + boxSp.x;
            let goY: number = btnGroup.y + boxSp.y;
            this.getPropAnim(boxSp, goX, goY, num, scX);
            config.prop['bomb'] += num;
        } else if (name == 'greset') {
            let boxSp: any = btnGroup.getChildAt(3); //重置的盒子
            let goX: number = btnGroup.x + boxSp.x;
            let goY: number = btnGroup.y + boxSp.y;
            this.getPropAnim(boxSp, goX, goY, num, scX);
            config.prop['resetImg'] += num;
        } else if (name == 'gsz') {
            let boxSp: any = btnGroup.getChildAt(2); //刷子的盒子
            let goX: number = btnGroup.x + boxSp.x;
            let goY: number = btnGroup.y + boxSp.y;
            this.getPropAnim(boxSp, goX, goY, num, scX);
            config.prop['pen'] += num;
        }
    }
    //处理领取道具动画
    private getPropAnim(target: any, x: number, y: number, num: number, scX: number): void {
        let propImg: Laya.Sprite = this.getImage(`xinzhuye/${target.name}.png`, 96 * scX, 98 * scX, (Laya.stage.width - 86 * scX) / 2, (Laya.stage.height - 98 * scX) / 2);
        propImg.zOrder = 3;
        //搞一个动画，飞到指定位置
        Laya.Tween.to(propImg, {
            x: x, y: y, scX: .5, scY: .5, alpha: .3, update: Laya.Handler.create(this, e => {
            })
        }, 1500, Laya.Ease.circInOut, Laya.Handler.create(this, e => {
            Laya.stage.removeChild(propImg);
            target.nums += num;
            let txt: any = target.getChildByName('oText').getChildAt(0);
            if (txt != null) txt.text = '拥有:' + target.nums;
            let showPay: any = target.getChildByName('oHaveImg');
            target.getChildByName('oText').visible = true;
            if (showPay != null) showPay.visible = false;
        }), 0)
        Laya.stage.addChild(propImg);
    }
    //每日礼包
    public getDayGift(callBack: any = null): void {

        let giftOpac = this.opacityBg1();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let giftBox: Laya.Sprite = new Laya.Sprite();
        //添加顶部文字
        let txtTop: Laya.Sprite = this.getImage('meirilibao/dayTxt.png', 425 * scX, 66 * scX, (giftOpac.width - 425 * scX) / 2, 0);
        txtTop.zOrder = 1;
        //添加圈圈
        let cir: Laya.Sprite = this.getImage('daoju/cir.png', 750 * scX, 832 * scX, (giftOpac.width - 750 * scX) / 2, txtTop.y + txtTop.height / 2);
        let prop: Laya.Sprite = this.getImage(`meirilibao/zs.png`, 409 * scX, 392 * scX, (cir.width - 409 * scX) / 2, (cir.height - 392 * scX) / 2);
        cir.addChild(prop);
        //添加领取按钮
        giftBox.addChild(txtTop);
        giftBox.addChild(cir);
        let url: string = 'get';
        if (config.lookNum > 10) {
            let url: string = 'get1';

        } else {
            let url: string = 'get';
        }
        //领取按钮
        let getGift: Laya.Sprite = this.getImage(`meirilibao/${url}.png`, 272 * scX, 94 * scX, giftOpac.width / 2, cir.y + cir.height + 94 * scX / 2);
        getGift.pivot(getGift.width / 2, getGift.height / 2);
        Object.defineProperty(getGift, 'getType', {
            value: url
        })
        getGift.on(Laya.Event.CLICK, this, () => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            new AllTip('暂未开放');
            return;
            if (url == 'get') {
                console.log('视频获取')
                //看视频接口
                new GetData("/EatChicken/user/lockAd.action", 'get', {}, config.cookie, (data) => {
                    config.lookNum++;
                });
            } else {
                console.log('分享获得')
                Laya.Browser.window.timeDesc = new Date().getTime();  //记录当前时间
                let randomNum: number = this.randomNum(0, config.shareText.length - 1);
                new Share((randomNum + 1), config.shareText[randomNum]).activeShare(config.shareText[randomNum], null, null, null, null, data => {
                    if (data == 1) {
                        callBack(1);
                    } else {
                        Laya.Browser.window.wx.showToast({
                            title: '分享失败',
                            icon: '',
                            image: 'jiazai/fails.png'
                        })
                    }
                });
            }
            new GetData("/EatChicken/user/getLoginTask.action?type=2", 'get', {}, config.cookie, (data) => {
                config.getDayGift = true;
                if (callBack != null) callBack(1);
            });
        });
        giftBox.addChild(getGift);
        let jumpBtn: Laya.Sprite = this.getImage('meirilibao/jump.png', 142 * scX, 26 * scX, (giftOpac.width - 142 * scX) / 2, getGift.y + getGift.height * 1.2);
        jumpBtn.on(Laya.Event.CLICK, this, e => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            console.log('跳过');
            this.hidePopup();
            new GetData("/EatChicken/user/getLoginTask.action?type=1", 'get', {}, config.cookie, (data) => {
                config.getDayGift = true;
                if (callBack != null) callBack(2);
            });
        })
        jumpBtn.alpha = .6;
        giftBox.addChild(jumpBtn);
        giftBox.width = giftOpac.width;
        giftBox.height = txtTop.height + cir.height + getGift.height;
        giftBox.pos(0, (giftOpac.height - giftBox.height) / 2);
        new BtnAnimation(getGift, () => { }, true).zoom();
        giftOpac.addChild(giftBox);
        this.addChild(giftOpac);
    }
    //邀请奖励
    public invGift(callback: any = null): void {
        let giftOpac = this.opacityBg1();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let giftBg: Laya.Sprite = this.getImage('yaoqing/invBg.png', 742 * scX, 1149 * scX, (giftOpac.width - 742 * scX) / 2, (giftOpac.height - 1149 * scX) / 2);
        //添加中部list
        let invList: Laya.List = new Laya.List();
        invList.itemRender = ItemInv; //必须设置，这个类代表更新时候的处理
        invList.repeatX = 1;
        invList.repeatY = 7; //y轴个数
        invList.name = 'ingList';
        invList.x = (giftBg.width - 640 * scX) / 2;
        invList.y = 140 * scX;
        invList.height = 927 * scX;
        invList.width = 630 * scX;
        // 使用但隐藏滚动条
        invList.vScrollBarSkin = "";
        let invArray: Array<any> = [];
        let datas: Array<any> = [];
        let closeOk: boolean = false;
        new GetData('/EatChicken/task/getTask.action', 'get', {}, config.cookie, (data): void => {
            closeOk = true;
            invArray = data.data.addDatas.resultlist;
            for (let i: number = 0; i < invArray.length; ++i) {
                //添加背景
                let listItem: Laya.Sprite = new Laya.Sprite();
                listItem.width = 640 * scX;
                listItem.height = 158 * scX;
                listItem.pos(0, i * 10);
                listItem.graphics.drawTexture(Laya.loader.getRes('yaoqing/right.png'), 0, 0, 640 * scX, 158 * scX);
                listItem.size(1, 1);  //父元素的交互区域，一定不能设置0，也一定要设置，否则添加按钮点击时候，滚动将会无效
                //添加头像
                let imgBox: Laya.Sprite = new Laya.Sprite();
                let opacImg: Laya.Sprite = new Laya.Sprite();
                opacImg.width = 89 * scX;
                opacImg.height = 89 * scX;
                opacImg.graphics.drawTexture(Laya.loader.getRes('yaoqing/cir.png'), 0, 0, 89 * scX, 89 * scX);
                let userImg: Laya.Sprite = new Laya.Sprite();
                userImg.width = 89 * scX;
                userImg.height = 89 * scX;
                if (invArray[i].headUrl != null) userImg.loadImage(`${invArray[i].headUrl}`);
                else
                    userImg.loadImage(`yaoqing/d.png`); //需要更换头像
                imgBox.pos(30 * scX, (158 * scX - opacImg.height) / 2);

                imgBox.addChild(opacImg);
                imgBox.addChild(userImg);
                imgBox.mask = opacImg;
                listItem.addChild(imgBox);

                let rightBg: Laya.Sprite = new Laya.Sprite();
                rightBg.width = 476 * scX;
                rightBg.height = 94 * scX;
                rightBg.graphics.drawTexture(Laya.loader.getRes('yaoqing/list.png'), 0, 0, 476 * scX, 94 * scX);
                rightBg.pos(640 * scX - 476 * scX - 30 * scX, (158 * scX - 94 * scX) / 2);
                rightBg.size(1, 1);
                //添加文字
                let nickName: Laya.Text = new Laya.Text();
                let userNameLen: any = '';
                if (invArray[i].nickName != null) {
                    userNameLen = invArray[i].nickName.toString().length > 6 ? invArray[i].nickName.substring(0, 6) + '...' : invArray[i].nickName;
                    nickName.color = '#fff';
                    nickName.fontSize = 28 * scX;
                }
                else {
                    userNameLen = '邀请好友助力'.toString().length > 6 ? '邀请好友助力'.substring(0, 6) + '...' : '邀请好友助力';
                    // nickName.font = 'invFont';
                    nickName.color = '#fff';
                    nickName.fontSize = 28 * scX;
                }
                nickName.text = `${userNameLen}`;
                nickName.pos(10 * scX, nickName.getBounds().height / 4);
                rightBg.addChild(nickName);
                //需要邀请的人数
                let invNum: Laya.Text = new Laya.Text();
                invNum.text = `需求人数：${i + 1}`;
                invNum.color = '#fff';
                // invNum.font = 'invFont';
                invNum.fontSize = 24 * scX;
                invNum.pos(10 * scX, opacImg.height - invNum.getBounds().height - invNum.getBounds().height / 4);
                rightBg.addChild(invNum);
                //根据算法去计算
                let zsNum: Laya.Text = new Laya.Text();
                zsNum.text = `奖励：${invArray[i].task.reward}`;
                zsNum.color = '#f5b239';
                zsNum.fontSize = 30 * scX;
                zsNum.pos(invNum.x + invNum.width + 10 * scX, (94 * scX - zsNum.height) / 2);
                rightBg.addChild(zsNum);
                let invBtn: Laya.Button = null;
                if (invArray[i].taskState == "working") {
                    invBtn = new Laya.Button('yaoqing/invget.png', '');
                    invBtn.name = 'working';
                } else if (invArray[i].taskState == "completed") {
                    invBtn = new Laya.Button('yaoqing/mget.png', '');
                    invBtn.name = 'completed';
                } else if (invArray[i].taskState == "draw") {
                    invBtn = new Laya.Button('yaoqing/yget.png', '');
                    invBtn.name = 'draw';
                }
                invBtn.width = 131 * scX;
                invBtn.height = 70 * scX;
                invBtn.stateNum = 1;
                Object.defineProperty(invBtn, 'nums', {
                    value: invArray[i].task.reward
                })
                Object.defineProperty(invBtn, 'taskId', {
                    value: invArray[i].id
                })
                invBtn.pos(476 * scX - invBtn.width - 10 * scX, (94 * scX - invBtn.height) / 2);
                // invBtn.mouseEnabled=false;
                invBtn.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
                    new SoundManager('shengyin/btn.mp3', false, 1);
                    console.log('处理逻辑。领取邀请等')
                    let target: any = e.target;
                    if (target.name == 'working') {
                        let randomNum: number = this.randomNum(0, config.shareText.length - 1);
                        new Share((randomNum + 1), config.shareText[randomNum]).activeShare(config.shareText[randomNum]);
                    } else if (target.name == 'completed') {  //领取奖励
                        new GetData('/EatChicken/task/drawTask.action?type=' + target.taskId, 'get', {}, config.cookie, (data): void => {
                            target.skin = 'yaoqing/yget.png';
                            target.name = 'draw';
                            new AllTip(`领取成功，钻石+${target.nums}`);
                            if (callback != null) callback(target.nums);
                        });
                    } else return;
                });
                rightBg.addChild(invBtn);
                //添加底部线条
                listItem.addChild(rightBg);
                datas.push(listItem);
            }
            invList.array = datas;
        });
        let close: Laya.Sprite = this.getImage('paihangbang/close.png', 47 * scX, 39 * scX, giftBg.width - 47 * scX - 39 * scX * 1.7, 39 * scX * 1.5);
        close.on(Laya.Event.CLICK, this, () => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            if (!closeOk) return;
            this.hidePopup();
        });
        giftBg.addChild(close);
        giftBg.addChild(invList);
        giftOpac.addChild(giftBg);
        this.addChild(giftOpac);
        invList.renderHandler = new Laya.Handler(this, this.onListRender);
    }
    private selectSub(): void {
        console.log(123456456)
    }
    //监听更新
    private onListRender(item: any, index: number): void {
        // console.log(item)
        // let invBtn: any = item.getChildByName('invBtn');
        // invBtn.off(Laya.Event.CLICK, this, this.onInvBtnClick, [index]);
        // invBtn.on(Laya.Event.CLICK, this, this.onInvBtnClick, [index]); //监听点击并且传递参数
        // item.mouseEnabled=false;
        // item.mouseThrough=true;
    }
    private onInvBtnClick(index: number): void {
        console.log("你点击了第：" + index + "个btn");
    }
    //编辑继续游戏
    public continueGame(callback: any = null): void {
        let giftOpac = this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let giftBg: Laya.Sprite = this.getImage('jixuyouxi/jxBg.png', 662 * scX, 637 * scX, (giftOpac.width - 662 * scX) / 2, (giftOpac.height - 637 * scX) / 2);
        giftOpac.addChild(giftBg);
        //添加list
        new GetData("/EatChicken/user/maxValueList.action", 'get', {}, config.cookie, (data) => {
            let maxResultArr: Array<any> = data.data.addDatas.resultlist[0];
            if (maxResultArr != null && maxResultArr.length >= 1) {
                //添加文字
                let title: Laya.Sprite = this.getImage('jixuyouxi/title.png', 140 * scX, 34 * scX, (giftBg.width - 140 * scX) / 2, 80 * scX);
                let score: Laya.Text = new Laya.Text();
                score.text = `${maxResultArr[0].checkpoint+1}关`;
                score.color = '#f8e0ad';
                // score.font = 'whiteLevel';
                // score.color = '#fcd26f';
                score.fontSize = 48 * scX;
                score.pos((giftBg.width - score.width) / 2, title.y + title.height + 30 * scX);
                let txt: Laya.Sprite = this.getImage('jixuyouxi/txt.png', 450 * scX, 187 * scX, (giftBg.width - 450 * scX) / 2, score.y + score.height + 30 * scX);
                //添加按钮
                let btns1: Laya.Sprite = null;
                btns1 = this.getImage('jixuyouxi/video.png', 224 * scX, 94 * scX, (giftBg.width - 224 * scX) / 2 - 224 * scX / 1.5, giftBg.height - 94 * scX * 2);  //金色
                Object.defineProperty(btns1, 'level', {
                    value: maxResultArr[0].checkpoint
                })

                btns1.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
                    new SoundManager('shengyin/btn.mp3', false, 1);
                    console.log('拉取视频或者分享')
                    if (Laya.Browser.onMiniGame) {
                        let target: any = e.target;
                        //看视频接口
                        new GetData("/EatChicken/user/lockAd.action", 'get', {}, config.cookie, (data) => {
                            config.lookNum++;
                            config.nowLevel = parseInt(target.level);
                            config.passLevel = config.nowLevel;
                            if (callback != null) callback(1);
                        });

                    }
                });
                let btns2: Laya.Sprite = null;
                btns2 = this.getImage('jixuyouxi/share.png', 224 * scX, 94 * scX, (giftBg.width - 224 * scX) / 2 + 224 * scX / 1.5, giftBg.height - 94 * scX * 2);  //金色
                Object.defineProperty(btns2, 'level', {
                    value: maxResultArr[0].checkpoint
                })
                btns2.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
                    new SoundManager('shengyin/btn.mp3', false, 1);
                    console.log('拉取视频或者分享')
                    if (Laya.Browser.onMiniGame) {
                        let target: any = e.target;
                        let wx: any = Laya.Browser.window.wx;
                        let randomNum: number = this.randomNum(0, config.shareText.length - 1);
                        new Share((randomNum + 1), config.shareText[randomNum]).activeShare(config.shareText[randomNum], 'getLevel');
                        wx.onShow(e => {
                            if (config.shareSuccess) {
                                config.shareSuccess = false;
                                config.nowLevel = parseInt(target.level);
                                config.passLevel = config.nowLevel;
                                if (callback != null) callback(1);

                            } else {
                                wx.showToast({
                                    title: '分享失败',
                                    icon: '',
                                    image: 'jiazai/fails.png'
                                })
                            }
                        });
                    }
                });
                giftBg.addChild(title);
                giftBg.addChild(score);
                giftBg.addChild(txt);
                giftBg.addChild(btns1);
                giftBg.addChild(btns2);
            }
        });
        let close: Laya.Sprite = this.getImage('jixuyouxi/close.png', 22 * scX, 22 * scX, 555 * scX, 80 * scX);
        close.on(Laya.Event.CLICK, this, () => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            this.hidePopup();
        });
        close.size(50 * scX, 50 * scX);
        giftBg.addChild(close);
        this.addChild(giftOpac);
    }
    //是否读取存档
    public redSave(callBack: any = null): void {
        let giftOpac = this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let giftBg: Laya.Sprite = this.getImage('baocun/save.png', 662 * scX, 497 * scX, (giftOpac.width - 662 * scX) / 2, (giftOpac.height - 497 * scX) / 2);

        let noSave: Laya.Sprite = this.getImage('baocun/restart.png', 200 * scX, 70 * scX, (giftBg.width - 200 * scX) / 2 - 200 * scX / 1.5, 365 * scX);
        let save: Laya.Sprite = this.getImage('baocun/constart.png', 200 * scX, 70 * scX, (giftBg.width - 200 * scX) / 2 + 200 * scX / 1.5, 365 * scX);
        noSave.on(Laya.Event.CLICK, this, () => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            console.log('新的开始');
            this.hidePopup();
            if (callBack != null) callBack(1);
        });
        save.on(Laya.Event.CLICK, this, () => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            console.log('关卡开始')
            this.hidePopup();
            if (callBack != null) callBack(2);
        });
        giftBg.addChild(noSave);
        giftBg.addChild(save);
        giftOpac.addChild(giftBg);
        this.addChild(giftOpac);
    }
    //钻石不足
    public noZs(num: number, callBack: any = null): void {
        let giftOpac = this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let giftBg: Laya.Sprite = this.getImage('zuanshi/zsBg.png', 662 * scX, 560 * scX, (giftOpac.width - 662 * scX) / 2, (giftOpac.height - 560 * scX) / 2);
        let zsIcon: Laya.Sprite = this.getImage('zuanshi/zs.png', 86 * scX, 95 * scX, (giftBg.width - 86 * scX) / 2, 260 * scX);
        //操作按钮
        let invNum: Laya.Text = new Laya.Text();
        invNum.text = `奖励钻石：${new FormatNumber(num).formatPointNumber()}`;
        invNum.color = '#f8e0ad';
        invNum.fontSize = 36 * scX;
        invNum.pos((giftBg.width - invNum.width) / 2, zsIcon.y + zsIcon.height + 15 * scX);
        giftBg.addChild(zsIcon);
        giftBg.addChild(invNum);
        //操作按钮，得处理加钻石
        if (config.lookNum > 10) {
            let getZs: Laya.Sprite = this.getImage('zuanshi/share.png', 272 * scX, 94 * scX, (giftBg.width - 272 * scX) / 2, 420 * scX);
            getZs.on(Laya.Event.CLICK, this, () => {
                new SoundManager('shengyin/btn.mp3', false, 1);
                console.log('分享获得');
                this.hidePopup();
                new AllTip('暂未开放');
                return;

                //分享获得
                Laya.Browser.window.timeDesc = new Date().getTime();  //记录当前时间
                let randomNum: number = this.randomNum(0, config.shareText.length - 1);
                new Share((randomNum + 1), config.shareText[randomNum]).activeShare(config.shareText[randomNum], null, null, null, null, data => {
                    if (data == 1) {
                        //绑定接口
                        new GetData("/EatChicken/user/addMoney.action?count=500", 'get', {}, config.cookie, (data) => {
                            new AllTip('领取成功');
                            if (callBack != null) callBack(num);
                        });
                    } else {
                        Laya.Browser.window.wx.showToast({
                            title: '分享失败',
                            icon: '',
                            image: 'jiazai/fails.png'
                        })
                    }
                    this.hidePopup();
                });
            });
            giftBg.addChild(getZs);
        } else {
            let getZs: Laya.Sprite = this.getImage('zuanshi/video.png', 272 * scX, 94 * scX, (giftBg.width - 272 * scX) / 2, 420 * scX);
            getZs.on(Laya.Event.CLICK, this, () => {
                new SoundManager('shengyin/btn.mp3', false, 1);
                console.log('视频领取');
                this.hidePopup();
                new AllTip('暂未开放!');
                return;
                new GetData("/EatChicken/user/addMoney.action?count=500", 'get', {}, config.cookie, (data) => {
                    new AllTip('领取成功');
                    if (callBack != null) callBack(num);
                });
            });
            giftBg.addChild(getZs);
        }
        //放弃
        let fq: Laya.Sprite = this.getImage('zuanshi/fq.png', 97 * scX, 26 * scX, (giftBg.width - 97 * scX) / 2, giftBg.height + 26 * scX * 2);
        fq.alpha = .6;
        fq.on(Laya.Event.CLICK, this, () => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            this.hidePopup();
        });
        giftBg.addChild(fq);
        giftOpac.addChild(giftBg);
        this.addChild(giftOpac);
    }
    //恭喜过关
    public pass(callback: any = null): void {
        new SoundManager('shengyin/shengli.mp3', false, 1);
        let giftOpac = this.opacityBg1();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let giftBox: Laya.Sprite = new Laya.Sprite();
        //添加顶部文字
        let txtTop: Laya.Sprite = this.getImage('guoguan/pass.png', 324 * scX, 67 * scX, (giftOpac.width - 324 * scX) / 2, 0);
        txtTop.zOrder = 1;
        //添加圈圈
        let cir: Laya.Sprite = this.getImage('guoguan/passBg.png', 750 * scX, 832 * scX, (giftOpac.width - 750 * scX) / 2, txtTop.y);
        //添加领取按钮
        giftBox.addChild(txtTop);
        giftBox.addChild(cir);
        //领取按钮
        if (config.lookNum > 10) {
            var getGift: Laya.Sprite = this.getImage('meirilibao/get1.png', 272 * scX, 94 * scX, giftOpac.width / 2, cir.y + cir.height / 1.1);
            getGift.pivot(getGift.width / 2, getGift.height / 2);
            getGift.on(Laya.Event.CLICK, this, () => {
                new SoundManager('shengyin/btn.mp3', false, 1);
                new AllTip('暂未开放');
                this.hidePopup();
                return;
                Laya.Browser.window.timeDesc = new Date().getTime();  //记录当前时间
                let randomNum: number = this.randomNum(0, config.shareText.length - 1);
                new Share((randomNum + 1), config.shareText[randomNum]).activeShare(config.shareText[randomNum], null, null, null, null, data => {
                    if (data == 1) {
                        new AllTip('领取成功');
                        if (callback != null) callback(1);
                    } else {
                        Laya.Browser.window.wx.showToast({
                            title: '分享失败',
                            icon: '',
                            image: 'jiazai/fails.png'
                        })
                    }
                    this.hidePopup();
                });
            });
            giftBox.addChild(getGift);
        } else {
            var getGift: Laya.Sprite = this.getImage('meirilibao/get.png', 272 * scX, 94 * scX, giftOpac.width / 2, cir.y + cir.height / 1.1);
            getGift.pivot(getGift.width / 2, getGift.height / 2);
            getGift.on(Laya.Event.CLICK, this, () => {
                new SoundManager('shengyin/btn.mp3', false, 1);
                new AllTip('暂未开放');
                this.hidePopup();
                return;
                this.hidePopup();
                new AllTip('领取成功');
                if (callback != null) callback(1);
            });
            giftBox.addChild(getGift);

        }
        let jumpBtn: Laya.Sprite = this.getImage('daoju/fq.png', 121 * scX, 33 * scX, (giftOpac.width - 121 * scX) / 2, getGift.y + getGift.height * 1.2);
        jumpBtn.on(Laya.Event.CLICK, this, e => {
            new SoundManager('shengyin/btn.mp3', false, 1);
            console.log('跳过');
            this.hidePopup();
            if (callback != null) callback(1);
        })
        jumpBtn.alpha = .6;
        giftBox.addChild(jumpBtn);
        giftBox.width = giftOpac.width;
        giftBox.height = txtTop.height + cir.height + getGift.height;
        giftBox.pos(0, (giftOpac.height - giftBox.height) / 2);
        new BtnAnimation(getGift, () => { }, true).zoom();
        giftOpac.addChild(giftBox);
        this.addChild(giftOpac);
    }
}