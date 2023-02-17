import GameCode from './GameCode'
import config from '../config/config';
import AllTip from '../common/AllTip';
import PopupManager from '../popup/PopupManager'
import GetData from '../request/GetData'
import SoundManager from '../common/SoundManager';
import FormatNumber from '../common/FormatNumber';
export default class Mains extends Laya.Script {
    private scene: any;
    private leftTop: Laya.Sprite;
    private role: any;
    private sa: Laya.Sprite;
    private zsNum: Laya.Text;
    private gameCode: any;
    private tipText: Laya.Text;
    private roleBox: Laya.Sprite;
    private longDown: boolean = false; //是否长按
    public btnGroup: Laya.Sprite;  //按钮组
    private leftBg: Laya.Sprite;
    private centerBox: Laya.Sprite;
    private prosBox: Laya.Sprite;
    private nowGold:Laya.Text;
    constructor() {
        super();
    }
    onEnable(): void {
        this.scene = this.owner;
        this.scene.width = Laya.stage.width;
        this.scene.height = Laya.stage.height;
        console.log('进入主场景')
        let mainBg: any = this.scene.getChildByName('mainBg');
        mainBg.width = Laya.stage.width;
        mainBg.height = Laya.stage.height;
        let scX: number = Laya.Browser.window.scX;
        //添加第二个背景
        // this.scene.addChild(this.getImage('xinzhuye/mainBox.png', 691 * scX, 728 * Laya.Browser.window.scY,(Laya.stage.width-691*scX)/2, 425 * Laya.Browser.window.scY));
        // this.scene.addChild(this.getImage('xinzhuye/mainRole.png', 691 * scX, 379 * scX,(Laya.stage.width-691*scX)/2, 425 * Laya.Browser.window.scY+702 * scX-379 * scX));
        //添加左上角开放域
        this.leftTop = this.getImage('xinzhuye/topBox.png', 230 * scX, 131 * scX, 10 * scX, 10 * scX);
        this.leftTop.addChild(this.leftTopImg(config.nowLevel + 1));
        //添加即将超越文字
        let nowText: Laya.Sprite = this.getImage('xinzhuye/cy.png', 93 * scX, 23 * scX, (this.leftTop.width - 93 * scX) / 2, 5 * scX);
        this.leftTop.addChild(nowText);
        this.scene.addChild(this.leftTop);

        let rightBtn: Laya.Sprite = new Laya.Sprite();
        rightBtn.pos(Laya.stage.width - 226 * scX, 200 * Laya.Browser.window.scY);
        //添加钻石
        let getZS: Laya.Sprite = this.getImage('xinzhuye/zsBg.png', 211 * scX, 60 * scX, 0, 0);
        // let icon: Laya.Sprite = this.getImage('zhuye/zs.png', 40 * scX, 34 * scX, 5 * scX, (getZS.height - 34 * scX) / 2);
        // let addIcon: Laya.Sprite = this.getImage('zhuye/add.png', 39 * scX, 30 * scX, getZS.width - 41 * scX, (getZS.height - 30 * scX) / 2);
        this.zsNum = new Laya.Text();
        this.zsNum.text = `${new FormatNumber(config.zsNum).formatPointNumber()}`;
        this.zsNum.width = getZS.width - 60 * scX;
        this.zsNum.fontSize = 32 * scX;
        this.zsNum.color = '#fff';
        this.zsNum.stroke = 2;
        this.zsNum.strokeColor = '#000';
        this.zsNum.align = 'center';
        this.zsNum.pos(25 * scX + (getZS.width - this.zsNum.width) / 2, (getZS.height - this.zsNum.height) / 2);
        // getZS.addChild(icon);
        // getZS.addChild(addIcon);
        getZS.addChild(this.zsNum);
        getZS.on(Laya.Event.CLICK, this, this.getDiamonds)
        let goHome: Laya.Sprite = this.getImage('xinzhuye/goHome.png', 197 * scX, 88 * scX, (getZS.width - 197 * scX), getZS.y + getZS.height + 20 * scX);
        goHome.on(Laya.Event.CLICK, this, this.goHome)

        //添加关卡
        rightBtn.addChild(getZS);
        rightBtn.addChild(goHome);
        this.scene.addChild(rightBtn);

        this.roleBox = new Laya.Sprite();
        this.roleBox.width = 480 * scX;
        this.roleBox.height = 269 * scX;
        this.roleBox.pos((this.scene.width - 480 * scX) / 2, Laya.stage.height - 1150 * scX);
        //添加胎盘
        this.role = this.getImage(`xinzhuye/role${config.nowLevel % 3}.png`, 178 * scX, 239 * scX, (this.roleBox.width - 178 * scX) / 2, 0);
        // Object.defineProperty(this.role,'roleFrame',{
        //     value:0
        // });
        this.role.pivot(this.role.width / 2, this.role.height);
        this.role.pos((this.roleBox.width - 178 * scX) / 2 + this.role.width / 2,this.role.height);
        this.role.roleFrame = 0;
        // this.role.pivot(0,-this.role.height);
        this.role.zOrder = 3;
        // let placenta: Laya.Sprite = this.getImage('zhuye/roleBtm.png', 319 * scX, 58 * scX, 0, this.role.y + this.role.height - 58 * scX / 1.2);
        this.roleBox.addChild(this.role);
        // this.roleBox.addChild(placenta);
        //添加进度条
        this.prosBox = this.getImage('xinzhuye/hpBg.png', 238 * scX, 41 * scX, (this.roleBox.width - 238 * scX) / 2 + 75 * scX / 2, -41 * scX);
        this.prosBox.pivot(this.prosBox.width / 2, this.prosBox.height / 2);
        this.prosBox.pos(this.roleBox.width / 2, -41 * scX / 1.1);
        //添加HP文字
        let hp: Laya.Sprite = this.getImage('xinzhuye/hp.png', 63 * scX, 63 * scX, this.prosBox.x - this.prosBox.width - this.prosBox.width / 4 + 63 * scX / 2, (this.prosBox.height - 63 * scX) / 2);
        hp.zOrder = 2;
        //添加正常进度
        let prosActiveBox: Laya.Sprite = new Laya.Sprite();
        let sd: Laya.Sprite = this.getImage('xinzhuye/hpOpacity.png', 220 * scX, 22 * scX, 5 * scX, (41 * scX - 22 * scX) / 2);
        this.sa = this.getImage('xinzhuye/hpActive.png', 220 * scX, 22 * scX, 5 * scX, (41 * scX - 22 * scX) / 2);
        if (!config.useUpLevel) {
            if (config.nowLevel > 4) {
                config.userHp = config.bossHpArr[config.bossHpArr.length - 1] + 100 * (config.nowLevel - 1);
                config.userNowHp = config.bossHpArr[config.bossHpArr.length - 1] + 100 * (config.nowLevel - 1);
            } else {
                config.userHp = config.bossHpArr[config.nowLevel];
                config.userNowHp = config.bossHpArr[config.nowLevel];
            }
        }
        this.sa.x = -(1 - config.userNowHp / config.userHp) * this.sa.width + (21 * scX) / 2;  //设置中间位置
        prosActiveBox.pos(0, 0);
        prosActiveBox.addChild(sd);
        prosActiveBox.addChild(this.sa);
        prosActiveBox.mask = sd;
        //撰写进度条提示
        this.tipText = new Laya.Text();
        this.tipText.text = `${config.userNowHp}/${config.userHp}`;
        this.tipText.fontSize = 28 * scX;
        this.tipText.color = '#fff';
        this.tipText.align = 'center';
        this.tipText.stroke = 2;
        this.tipText.strokeColor = '#000';
        this.tipText.width = this.prosBox.width;
        this.tipText.pos(0, -this.tipText.height / 4);
        this.prosBox.addChild(hp);
        this.prosBox.addChild(prosActiveBox);
        this.prosBox.addChild(this.tipText);
        this.prosBox.zOrder = 6;
        this.roleBox.addChild(this.prosBox);
        this.roleBox.zOrder = 2;
        this.scene.addChild(this.roleBox);
        //添加道具
        this.centerBox = this.getImage(`xinzhuye/center.png`, 750 * scX, 190 * scX, 0, Laya.stage.height - 940 * scX); //中部道具盒子
        this.centerBox.zOrder = 4;
        this.scene.addChild(this.centerBox);
        //添加右侧按钮
        this.btnGroup = this.getImage(`xinzhuye/btmk.png`, 750 * scX, 107 * scX, 0, Laya.stage.height - 107 * scX);
        this.addFourProp();
        this.scene.addChild(this.btnGroup);
        // Laya.timer.loop(5000, this, this.loop);
        this.addLeftGole();
        
        this.gameCode = new GameCode(Laya.stage.height - 770 * scX, this.role, this);//初始化游戏
        
        this.setArms();
    }
    //设置五个道具以及级别
    public setArms(): void {
        let scX: number = Laya.Browser.window.scX;
        let _w: number = 655 * scX / 5;
        for (let i: number = 0; i < 5; ++i) {
            let armsBox: any = new Laya.Sprite();
            armsBox.width = _w;
            armsBox.height = 190 * scX;
            armsBox.index = i;
            let gone: any = this.getImage(`xinzhuye/${config.gone[i].name}${config.gone[i].weapon.grade}.png`, 0, 0, 0, 0);
            gone.width = gone.getBounds().width * scX;
            gone.height = gone.getBounds().height * scX;
            gone.pivot(gone.width / 2, gone.height / 2);
            gone.pos(armsBox.width / 2, armsBox.height / 3)
            gone.name = 'gone';
            gone.scaleX = .8;
            gone.scaleY = .8;
            gone.sh = config.gone[i].weapon.attack;//基础伤害
            gone.zdNum = config.gone[i].zdNum; //子弹数量
            let txt: any = new Laya.Text();
            txt.text = `0/${config.gone[i].zdNum}`;
            txt.color = '#fff';
            txt.width = armsBox.width;
            txt.align = 'center';
            txt.stroke = 2;
            txt.zidan = 0;  //最大子弹数量
            txt.sjzd = 0; //实际的子弹
            txt.strokeColor = '#000';
            txt.name = 'zdTxt';
            txt.fontSize = 24;
            txt.pos(0, (armsBox.height - txt.height) / 2);
            let upBtn: Laya.Sprite = this.getImage(`xinzhuye/upbtn.png`, 110 * scX, 49 * scX, (armsBox.width - 110 * scX) / 2, armsBox.height - 49 * scX * 1.5);
            upBtn.name = 'upBtn';
            let txt1: Laya.Text = new Laya.Text();
            txt1.text = `${new FormatNumber(config.gone[i].weapon.money).formatThreeNumber()}`;
            txt1.color = '#fff';
            txt1.width = 40 * scX;
            txt1.align = 'center';
            txt1.fontSize = 20;
            txt1.pos((upBtn.width - 40 * scX) / 2, (upBtn.height - txt1.height) / 2);
            upBtn.addChild(txt1);
            upBtn.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
                if(this.gameCode.account)return;
                new SoundManager('shengyin/btn.mp3', false, 1);
                let target: any = e.target;
                let parent: any = target.parent;
                let child: any = target.getChildAt(0);
                if (config.zsNum < config.gone[parent.index].weapon.money) {
                    new AllTip('钻石不足');
                    let getDayGift: any = new PopupManager();
                    Laya.stage.addChild(getDayGift);
                    getDayGift.noZs(500, data => {
                        config.zsNum += data;
                        this.zsNum.text = `${new FormatNumber(config.zsNum).formatPointNumber()}`;
                    });
                    return;
                }
                config.gone[parent.index].weapon.grade += 1;
                if (config.gone[parent.index].weapon.grade > 5) {
                    config.gone[parent.index].weapon.grade = 5;
                    new AllTip('已达到满级');
                    return;
                }
                //升级武器
                let nextName:string='';
                if(config.gone[i].name=='sgone'){
                    nextName='one';
                }else if(config.gone[i].name=='cgone'){
                    nextName='two';
                }else if(config.gone[i].name=='bgone'){
                    nextName='three';
                }else if(config.gone[i].name=='jgone'){
                    nextName='four';
                }else{
                    nextName='five';
                }
                let nextRole:any=null;
                //找到下一级的东西
                for(let i:number=0;i<config.wqPZ.length;++i){
                    if(nextName==config.wqPZ[i].type && config.gone[parent.index].weapon.grade==config.wqPZ[i].grade){nextRole=config.wqPZ[i];break;}
                }
                //也得请求减钻石
                config.zsNum -= config.gone[parent.index].weapon.money;
                this.zsNum.text = `${new FormatNumber(config.zsNum).formatPointNumber()}`;
                config.gone[parent.index].weapon=nextRole;
                //获得新的钻石
                child.text = `${new FormatNumber(config.gone[parent.index].weapon.money).formatThreeNumber()}`;
                //设置图
                let goneImg: any = parent.getChildByName('gone');
                goneImg.graphics.clear();
                var texture = Laya.loader.getRes(`xinzhuye/${config.gone[parent.index].name}${config.gone[parent.index].weapon.grade}.png`); //获取已加载的新的纹理
                goneImg.graphics.drawTexture(texture); //开始绘制
                goneImg.size(texture.width, texture.height);
                goneImg.sh = config.gone[parent.index].weapon.attack;  //计算升级后的伤害
                goneImg.scaleX = .8;
                goneImg.scaleY = .8;
                new GetData(`/EatChicken/user/updateWeapon.action?weaponId=${config.gone[parent.index].id}`, 'get', {}, config.cookie, (data) => {
                    new AllTip('升级成功!');
                    new SoundManager('shengyin/shengli.mp3', false, 1);
		        });
            });
            armsBox.addChild(gone);
            armsBox.addChild(txt);
            armsBox.addChild(upBtn);
            armsBox.pos(47.5 * scX + _w * i, 0);
            this.centerBox.addChild(armsBox);
        }
    }
    //添加血色图
    public bloodImg(): void {
        let scX: number = Laya.Browser.window.scX;
        if (this.role.getChildByName('bloodBox') != null) return;
        let bloodBox: Laya.Sprite = new Laya.Sprite();
        bloodBox.name = 'bloodBox';
        let blood: Laya.Sprite = this.getImage(`xinzhuye/xue.png`, 136 * scX, 153 * scX, this.role.width, this.role.height / 2);
        let blood1: Laya.Sprite = this.getImage(`xinzhuye/xue.png`, 136 * scX, 153 * scX, 0, 0);
        let blood2: Laya.Sprite = this.getImage(`xinzhuye/xue.png`, 136 * scX, 153 * scX, -this.role.width, -this.role.height / 2);
        let blood3: Laya.Sprite = this.getImage(`xinzhuye/xue.png`, 136 * scX, 153 * scX, -this.role.width / 2, this.role.height / 2);
        let blood4: Laya.Sprite = this.getImage(`xinzhuye/xue.png`, 136 * scX, 153 * scX, this.role.width, -this.role.height);
        bloodBox.addChild(blood);
        bloodBox.addChild(blood1);
        bloodBox.addChild(blood2);
        bloodBox.addChild(blood3);
        bloodBox.addChild(blood4);
        let timerLine: Laya.TimeLine = new Laya.TimeLine();
        timerLine.to(bloodBox, {
            alpha: 0
        }, 1000, Laya.Ease.linearInOut, 500);
        timerLine.on(Laya.Event.COMPLETE, this, (e: Laya.Event) => {
            bloodBox.removeSelf();
        });
        timerLine.play(0, false);
        this.role.addChild(bloodBox);
    }
    //设置角色提图片
    public setRoleImg(level: number): void {
        this.role.graphics.clear();
        var texture = Laya.loader.getRes(`xinzhuye/role${level % 3}.png`); //获取已加载的新的纹理
        this.role.graphics.drawTexture(texture, 0, 0, 178 * Laya.Browser.window.scX, 239 * Laya.Browser.window.scX); //开始绘制
        // 设置交互区域
        this.role.size(texture.width, texture.height);
    }
    //添加左侧的目标和当前
    public addLeftGole(): void {
        let scX: number = Laya.Browser.window.scX;
        this.leftBg = this.getImage(`xinzhuye/cir1.png`, 215 * scX, 227 * scX,15*scX, 150 * scX);

        let txt1: Laya.Text = new Laya.Text();
        txt1.text = '本局目标关卡：';
        txt1.color = '#ffc808';
        txt1.width = this.leftBg.width;
        txt1.align = 'center';
        txt1.pos(0, 25 * scX);
        txt1.fontSize = 24;

        let endLevel: Laya.Text = new Laya.Text();
        endLevel.text = `需要完成第${config.passLevel + 1}关`;
        endLevel.color = '#fff';
        endLevel.width = this.leftBg.width;
        endLevel.align = 'center';
        endLevel.stroke = 2;
        endLevel.strokeColor = '#000';
        endLevel.name = 'endLevel';
        endLevel.fontSize = 24;
        endLevel.pos(0, txt1.y + txt1.height + 15 * scX);

        let passTxt: Laya.Text = new Laya.Text();
        passTxt.text = '恭喜本局目标已达成';
        passTxt.color = '#ff083c';
        passTxt.width = this.leftBg.width;
        passTxt.align = 'center';
        passTxt.name = 'passTxt';
        passTxt.visible = false;
        passTxt.fontSize = 22;
        passTxt.pos(0, endLevel.y + endLevel.height + 25 * scX);

        let txt2: Laya.Text = new Laya.Text();
        txt2.text = '本局目标关卡：';
        txt2.color = '#ffc808';
        txt2.width = this.leftBg.width;
        txt2.align = 'center';
        txt2.fontSize = 24;
        txt2.pos(0, passTxt.y + passTxt.height + 20 * scX);

        let nowLevel: Laya.Text = new Laya.Text();
        nowLevel.text = `正在进行第${config.nowLevel + 1}关`;
        nowLevel.color = '#fff';
        nowLevel.width = this.leftBg.width;
        nowLevel.align = 'center';
        nowLevel.stroke = 2;
        nowLevel.strokeColor = '#000';
        nowLevel.name = 'nowLevel';
        nowLevel.fontSize = 24;
        nowLevel.pos(0, txt2.y + txt2.height + 10 * scX);

        this.leftBg.addChild(txt1);
        this.leftBg.addChild(endLevel);
        this.leftBg.addChild(txt2);
        this.leftBg.addChild(nowLevel);
        this.leftBg.addChild(passTxt);
        this.scene.addChild(this.leftBg);
    }
    public goHome(): void {
        if(this.gameCode.account || this.gameCode.gameEnd)return;
        new SoundManager('shengyin/btn.mp3', false, 1);
        if (Laya.stage.getChildByName(`pass`) != null) Laya.stage.removeChild(Laya.stage.getChildByName(`pass`));
        let scene: Laya.Scene = new Laya.Scene();
        //创建这个场景,分离模式这样使用
        scene.loadScene('MyScene/Home.scene');
        //分离模式
        Laya.stage.addChild(scene);
        this.scene.removeSelf();
    }
    //添加四个道具
    public addFourProp(): void {
        let scX: number = Laya.Browser.window.scX;
        this.btnGroup.removeChildren();
        let propArr: Array<any> = ['cz', 'pen', 'resetImg', 'bomb'];
        let _w: number = (Laya.stage.width - 163 * scX) / 4;
        let leftBg: Laya.Sprite = this.getImage(`xinzhuye/ltxt.png`, 158 * scX, 55 * scX, 5 * scX, (this.btnGroup.height - 55 * scX) / 2);
        this.btnGroup.addChild(leftBg);
        //添加背景
        for (let i: number = 0; i < propArr.length; ++i) {
            //添加第一个按钮    
            let oneBtnGroup: any = this.getImage(`xinzhuye/djbg.png`, 124 * scX, 82 * scX, 163 * scX + (_w - 124 * scX) / 2 + _w * i, (this.btnGroup.height - 82 * scX) / 2);
            oneBtnGroup.name = `${propArr[i]}`;
            oneBtnGroup.nums = config.prop[propArr[i]];
            let oIcon: Laya.Sprite = this.getImage(`xinzhuye/${propArr[i]}.png`, 95 * scX, 94 * scX, -5 * scX, 0);
            //需要判断是否有数量，没有则显示兑换
            let haveBox: Laya.Sprite = new Laya.Sprite();
            haveBox.name = 'oText';
            // let oTextImg: Laya.Sprite = this.getImage(`xinzhuye/${propArr[i]}1.png`, 116 * scX, 81 * scX, 0, 0);
            let oText: Laya.Text = new Laya.Text();
            oText.text = `拥有:${config.prop[propArr[i]]}`;
            oText.fontSize = 24 * scX;
            oText.color = '#ffc808';
            // haveBox.addChild(oTextImg);
            haveBox.addChild(oText);
            haveBox.width = 116 * scX;
            haveBox.pos(oneBtnGroup.width - oText.width, oneBtnGroup.height - oText.height * 1.1);
            //如果没有数量
            let oHaveImg: Laya.Sprite = this.getImage(`xinzhuye/No.png`, 47 * scX, 41 * scX, oneBtnGroup.width - 47 * scX, oneBtnGroup.height - 41 * scX);
            oHaveImg.name = 'oHaveImg';
            oHaveImg.visible = false;
            haveBox.visible = false;
            if (config.prop[propArr[i]] <= 0) {
                oHaveImg.visible = true;
                haveBox.visible = false;
            } else {
                oHaveImg.visible = false;
                haveBox.visible = true;
            }
            oneBtnGroup.addChild(oIcon);
            oneBtnGroup.addChild(haveBox);
            oneBtnGroup.addChild(oHaveImg);
            this.btnGroup.addChild(oneBtnGroup);
            // oneBtnGroup.height = oIcon.height+oTextImg.height;
            // oneBtnGroup.width = 116 * scX;
            // Object.defineProperty(oneBtnGroup,'nums',{
            //     value:1
            // })
            let toDown: any = new Laya.TimeLine();
            let oIconY: number = oIcon.y;
            if (i % 2 == 0) {
                toDown.to(oIcon, {
                    y: oIconY + 10 * scX
                }, 3000, Laya.Ease.linearInOut, i * 30);
                toDown.to(oIcon, {
                    y: oIconY - 10 * scX
                }, 3000, Laya.Ease.linearInOut, 0);
                toDown.to(oIcon, {
                    y: oIconY
                }, 3000, Laya.Ease.linearInOut, 0);
            }
            else {
                toDown.to(oIcon, {
                    y: oIconY - 10 * scX
                }, 3000, Laya.Ease.linearInOut, i * 30);
                toDown.to(oIcon, {
                    y: oIconY + 10 * scX
                }, 3000, Laya.Ease.linearInOut, 0);
                toDown.to(oIcon, {
                    y: oIconY
                }, 3000, Laya.Ease.linearInOut, 0);
            }
            toDown.play(0, true);
            oneBtnGroup.on(Laya.Event.MOUSE_DOWN, this, this.propDown);
            oneBtnGroup.on(Laya.Event.MOUSE_UP, this, this.propUp);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, function () {
                if (this.longDown) {
                    this.longDown = false;
                    let tipArr: Array<any> = ['pen', 'cz', 'resetImg', 'bomb'];
                    for (let i: number = 0; i < tipArr.length; ++i) {
                        if (Laya.stage.getChildByName(tipArr[i] + "Tip") != null)
                            Laya.stage.removeChild(Laya.stage.getChildByName(tipArr[i] + "Tip"));
                    }
                }
            })
        }
    }
    //设置进度条位置
    private setProsPos(reset: boolean = false): void {
        if (reset) { this.sa.x = 0; this.tipText.text = `${config.userNowHp}/${config.userHp}`; return; }
        //换算num,算出百分比
        if (this.sa.x <= -this.sa.width) { this.sa.x = this.sa.width + (21 * Laya.Browser.window.scX) / 2; this.tipText.text = `${config.userNowHp}/${config.userHp}`; return; }
        this.sa.x = -(1 - config.userNowHp / config.userHp) * this.sa.width + (21 * Laya.Browser.window.scX) / 2;  //设置中间位置
        this.tipText.text = `${config.userNowHp}/${config.userHp}`;
    }
    private downLoop(name: string = '', target: any = null, parent: any = null): void {
        this.longDown = true;
        let scX: number = Laya.Browser.window.scX;
        if (name == 'pen') {
            this.onLongTip(name, parent._x + target.x - 141 * scX / 4, parent._y + target.y - 96 * scX);
        } else if (name == 'resetImg') {
            this.onLongTip(name, parent._x + target.x + 141 * scX / 2, parent._y + target.y - 96 * scX);
        } else if (name == 'cz') {
            this.onLongTip(name, parent._x + target.x + 141 * scX / 2, parent._y + target.y - 96 * scX);
        } else {
            this.onLongTip(name, parent._x + target.x - 141 * scX / 4, parent._y + target.y - 96 * scX);
        }
        Laya.timer.clear(this, this.downLoop);
    }
    private propDown(e: Laya.Event): void {
        if (this.gameCode.account) return; //如果在进行结算
        Laya.timer.loop(500, this, this.downLoop, [e.target.name, e.target, e.target._parent]); //长按开始计时
    }
    public setLevel(level: number): void {
        // this.levelNum.text = `${level + 1}`;
        let nowLevel: any = this.leftBg.getChildByName('nowLevel');
        nowLevel.text = `正在进行第${level + 1}关`;
    }
    public setNextLevel(passLevel: number): void {
        let endLevel: any = this.leftBg.getChildByName('endLevel');
        endLevel.text = `需要完成第${passLevel + 1}关`;
    }
    public setPassOk(show: boolean): void {
        let passTxt: any = this.leftBg.getChildByName('passTxt');
        passTxt.visible = show;
    }
    private propUp(e: Laya.Event): void {
        new SoundManager('shengyin/btn.mp3', false, 1);
        if (this.gameCode.account!=undefined && this.gameCode.account) return;
        let target: any = e.target;
        Laya.timer.clear(this, this.downLoop);
        if (this.longDown) {
            this.longDown = false;
            if (Laya.stage.getChildByName(`${target.name}Tip`) != null) Laya.stage.removeChild(Laya.stage.getChildByName(`${target.name}Tip`));
            return;
        }//如果是长按，什么都不做
        if (this.gameCode.useCZ)
            if (!this.gameCode.useCZOk) return;
        if (this.gameCode.useCZ || this.gameCode.gameEnd || this.gameCode.useBS || this.gameCode.useStar) return;
        if (target.nums == 0) {  //代表没有数量，购买道具
            if (config.zsNum < 100) {
                new AllTip('钻石不足');
                let getDayGift: any = new PopupManager();
                Laya.stage.addChild(getDayGift);
                getDayGift.noZs(500, data => {
                    config.zsNum += data;
                    this.zsNum.text = `${new FormatNumber(config.zsNum).formatPointNumber()}`;
                });
            } else {
                new GetData("/EatChicken/user/shop.action?type=100", 'get', {}, config.cookie, (data) => {
                    config.zsNum -= 100;
                    this.setZsNum(config.zsNum);
                    this.usePropEx(target.name);
                });
            }
            return;
        }
        //有数量，走这里
        if (target.name != 'pen') {
            target.nums -= 1;
            config.prop[target.name] -= 1;
            if (target.nums <= 0) {
                target.nums = 0;
                config.prop[target.name] = 0;
                let txt: any = target.getChildByName('oText').getChildAt(1);
                if (txt != null) txt.text = '拥有:0';
                let showPay: any = target.getChildByName('oHaveImg');
                target.getChildByName('oText').visible = false;
                if (showPay != null) showPay.visible = true;
            } else {
                let txt: any = target.getChildByName('oText').getChildAt(1);
                if (txt != null) { txt.text = '拥有:' + target.nums; }
                let showPay: any = target.getChildByName('oHaveImg');
                target.getChildByName('oText').visible = true;
                if (showPay != null) showPay.visible = false;
            }
        } else {
            Laya.timer.loop(10, this, this.update, [target]);
        }
        this.usePropEx(target.name);
    }
    //循环
    private update(target: any = null): void {
        if (config.confirmBS == 1) {
            config.confirmBS = 0;
            target.nums -= 1;
            config.prop[target.name] -= 1;
            if (target.nums <= 0) {
                target.nums = 0;
                config.prop[target.name] = 0;
                let txt: any = target.getChildByName('oText').getChildAt(1);
                if (txt != null) txt.text = '拥有:0';
                let showPay: any = target.getChildByName('oHaveImg');
                target.getChildByName('oText').visible = false;
                if (showPay != null) showPay.visible = true;
            } else {
                let txt: any = target.getChildByName('oText').getChildAt(1);
                if (txt != null) { txt.text = '拥有:' + target.nums; }
                let showPay: any = target.getChildByName('oHaveImg');
                target.getChildByName('oText').visible = true;
                if (showPay != null) showPay.visible = false;
            }
            Laya.timer.clear(this, this.update);
        } else if (config.confirmBS == 2) {
            config.confirmBS = 0;
            Laya.timer.clear(this, this.update);
        }
    }
    //使用道具
    private usePropEx(name: string): void {
        if (name == 'pen') {
            if (this.gameCode.useCZ || this.gameCode.gameEnd || this.gameCode.useBS || this.gameCode.useStar) return;
            this.gameCode.useBS = true;
            //循环随机拿个值
            while (true) {
                let rnd: number = this.gameCode.randomNum(0, 99);
                let roles: any = this.gameCode.roleBox.getChildAt(rnd);
                if (roles != null && roles != undefined) { this.gameCode.userHammer(roles.index); break; }
            }
        } else if (name == 'resetImg') {
            if (this.gameCode.useBS || this.gameCode.useCZ || this.gameCode.gameEnd || this.gameCode.useStar) return;
            let czImg: Laya.Sprite = new Laya.Sprite();
            czImg.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, '#fff');
            czImg.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
                return;
            })
            this.gameCode.gameEnd = true;
            czImg.zOrder = 99;
            let czHide: any = new Laya.TimeLine();
            czHide.to(czImg, {
                alpha: 0
            }, 500, Laya.Ease.linearInOut, 500);
            czHide.play(0,false);
            czHide.on(Laya.Event.COMPLETE,this,(e:Laya.Event)=>{
                czImg.removeSelf();
            });
            Laya.stage.addChild(czImg);
            new SoundManager('shengyin/shanguangdan.mp3', false, 1);
            this.gameCode.refresh();
        } else if (name == 'cz') {
            if (this.gameCode.useBS || this.gameCode.gameEnd || this.gameCode.useCZ || this.gameCode.useStar) return;
            if (this.gameCode.useCZ) {
                if (!this.gameCode.useCZOk) return;
            }
            this.gameCode.useCZ = true;
            let noRepeat: Array<any> = this.gameCode.noClear();
            this.gameCode.usePercussion(noRepeat[this.gameCode.randomNum(0, noRepeat.length - 1)]);
        } else {
            console.log('使用流星');
            if (this.gameCode.useBS || this.gameCode.gameEnd || this.gameCode.useCZ || this.gameCode.useStar) return;
            this.gameCode.useStar = true; //使用流星
            this.gameCode.clearAnimationAll(); //清除所有动画
            let clearArr: Array<any> = this.gameCode.delRandom(5);
            // for (let i: number = 0; i < clearArr.length; ++i) {
            //     setTimeout(() => {
            this.gameCode.clearStar(clearArr, clearArr[0], false, true);
            // }, i * 300);
            // }
        }
    }
    private addDialogue(txt: string, type: number, scX: number = Laya.Browser.window.scX): Laya.Sprite {
        //判断是哪个对话框
        // if (type == 1) {
        var dialogue: Laya.Sprite = this.getImage('xinzhuye/tipBg.png', 308 * scX, 103 * scX, this.roleBox.x + this.role.x - 308 * scX / 1.2, this.roleBox.y + this.roleBox.height - 103 * scX * 1.5);
        var digText: Laya.Text = new Laya.Text();
        digText.text = `${txt}`;
        digText.fontSize = 28 * scX;
        // digText.color = '#696969';
        digText.align = 'center';
        digText.width = 280 * scX;
        digText.font = 'blankFont';
        digText.wordWrap = true;
        digText.pos(10 * scX, (100 * scX - digText.getBounds().height) / 2);
        // } else {
        //     var dialogue: Laya.Sprite = this.getImage('zhuye/tipBox1.png', 178 * scX, 69 * scX, this.role.x + this.role.width / 2 - 206 * scX, this.role.y + this.role.height / 1.5);
        //     var digText: Laya.Text = new Laya.Text();
        //     digText.text = `${txt}`;
        //     digText.fontSize = 24 * scX;
        //     digText.color = '#696969';
        //     digText.align = 'center';
        //     digText.width = 170 * scX;
        //     digText.wordWrap = true;
        //     digText.pos((dialogue.width - digText.width) / 2, (80 * scX - digText.height) / 2);
        // }
        dialogue.zOrder = 4;
        dialogue.addChild(digText);
        let timeHide: any = new Laya.TimeLine();
        timeHide.to(dialogue, {
        }, 4000, Laya.Ease.elasticInOut, 0);
        timeHide.to(dialogue, {
            alpha: .8
        }, 100, Laya.Ease.elasticInOut, 0);
        timeHide.to(dialogue, {
            alpha: 1
        }, 100, Laya.Ease.elasticInOut, 0);
        timeHide.to(dialogue, {
            alpha: .5
        }, 100, Laya.Ease.elasticInOut, 0);
        timeHide.to(dialogue, {
            alpha: 1
        }, 100, Laya.Ease.elasticInOut, 0);
        timeHide.to(dialogue, {
            alpha: 0
        }, 100, Laya.Ease.elasticInOut, 0);
        timeHide.to(dialogue, {
            alpha: 0
        }, 100, Laya.Ease.elasticInOut, 0);
        timeHide.on(Laya.Event.COMPLETE, this, e => {
            dialogue.removeSelf();
            this.randomUserText(config.userSide[this.gameCode.randomNum(0, config.userSide.length - 1)]);
        });
        timeHide.play(0, false);
        return dialogue;
    }
    private getDiamonds(): void {
        console.log('获取钻石方法');
        new SoundManager('shengyin/btn.mp3', false, 1);
        let maxResult: any = new PopupManager((data: any) => {
        });
        maxResult.zOrder = 10;
        Laya.stage.addChild(maxResult);
        maxResult.invGift(data => {
            config.zsNum += parseInt(data);
            this.setZsNum(config.zsNum);
        });
    }
    //设置钻石的数量
    public setZsNum(num: number): void {
        this.zsNum.text = num.toString();
    }
    private leftTopImg(score: number): any {
        let scX: number = Laya.Browser.window.scX;
        let scY: number = Laya.Browser.window.scY;
        let overstep: any = this.leftTop.getChildByName('overstep');
        if (overstep != null) {
            if (Laya.Browser.onMiniGame) {
                let wx: any = Laya.Browser.window.wx;
                let openDataContext: any = wx.getOpenDataContext();
                let openData: any = new Laya.WXOpenDataViewer();
                openDataContext.postMessage({ action: 'overstep', scX: scX, score: score });//第一个参数缩放比，第二个参数openid
            }
            return;
        }
        //返回一个开放域
        if (Laya.Browser.onMiniGame) {
            let wx: any = Laya.Browser.window.wx;
            let openDataContext: any = wx.getOpenDataContext();
            openDataContext.postMessage({ action: 'clear' });//第一个参数缩放比，第二个参数openid
            // openDataContext.postMessage({ action: 'set', score: score});//存储关卡以及分数
            let openData: any = new Laya.WXOpenDataViewer();
            openData.name = 'overstep';
            openData.width = 220 * scX;
            openData.height = 118 * scX;
            openData.pos(0, 0);
            openDataContext.postMessage({ action: 'overstep', scX: scX, score: score });//第一个参数缩放比，第二个参数openid
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
    //随机显示语录
    private randomUserText(txt: string): void {
        if (txt == undefined) return;
        // if (txt.length > 12) {
        // this.scene.addChild(this.addDialogue(txt, 1));
        // } else {
        //     this.roleBox.addChild(this.addDialogue(txt, 1, Laya.Browser.window.scX));
        // }
    }
    private loop(): void {
        this.randomUserText(config.userSide[this.gameCode.randomNum(0, config.userSide.length - 1)]);
    }
    //长按添加提示
    private onLongTip(name: string, x: number, y: number): void {
        let scX: number = Laya.Browser.window.scX;
        let tip: Laya.Sprite = this.getImage(`xinzhuye/tips.png`, 147 * scX, 96 * scX, x, y);
        tip.name = `${name}Tip`;
        tip.alpha = 0;
        let txt: Laya.Text = new Laya.Text();
        if (name == 'cz')
            txt.text = '炸弹：使用后可以立即获得指定的一个配件！';
        else if (name == 'pen')
            txt.text = '烟雾弹:使用后可以改变指定的一个配件颜色！';
        else if (name == 'resetImg')
            txt.text = '闪光弹：使用后可以重新排列当前剩余的配件！';
        else
            txt.text = '信号枪：使用后可以立即随机获得五个配件！';
        txt.color = '#fff6cd';
        txt.wordWrap = true;
        txt.width = tip.width;
        txt.align = 'center';
        txt.y = 5 * scX;
        txt.fontSize = 22 * scX;
        tip.addChild(txt);

        let timeShow: any = new Laya.TimeLine();
        Laya.Tween.to(tip, {
            alpha: 1
        }, 500, Laya.Ease.linearInOut, null);
        Laya.stage.addChild(tip);
    }
}
