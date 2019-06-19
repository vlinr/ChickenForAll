import config from "../config/config";
import PopupManager from '../popup/PopupManager'
import GetData from '../request/GetData'
import AllTip from "../common/AllTip";
import SoundManager from "../common/SoundManager";
import FormatNumber from "../common/FormatNumber";
export default class GameCode {
	private starArr: Array<any> = [];
	private row: number = 10;  //行
	private clos: number = 8;  //列
	private commStar: Array<any> = [];
	private roleBox: Laya.Sprite;
	private IMGARR: Array<any> = ['red', 'blue', 'gay', 'yellow', 'green'];
	private PROPARR: Array<any> = ['gcz', 'glx', 'greset', 'gsz'];
	private gameEnd: boolean = false;//是否游戏结束
	private te: number = 0;  //记录动画数量
	private role: any;
	private main: any;
	private cached: boolean = false;  //缓存动画
	private tipNum: number = 3;  //3秒无操作就给出提示
	public useBS: boolean = false;
	public useCZ: boolean = false;
	private alivePopup: boolean = false;
	private doubleIndex: number = 0; //使用锤子第二次点击如果还是这个位置的话
	private useStar: boolean = false;
	private starIndexArr: Array<any> = [];//记录下标
	private account: boolean = false; //是否在进行结算
	private endLen: number = 0; //最后剩余长度
	private aliveOk: boolean = true; //是否复活
	private accountScore: number = 2000;  //结算的分数
	private showTxt: boolean = false; //是否显示过关提示文字
	private gameOvers: boolean = false;
	private useCZOk: boolean = false; //锤子是否使用完成
	private playFlag: boolean = false; //是否播放着提示
	private rolePlay: boolean = false;  //角色是否挨揍
	private boxY: number = 0;
	private prBox: Laya.Sprite;
	private btNum: number = 0; //次数，根据次数去加难度
	constructor(y: number, role: any, main: any) {
		if (!this.cached) {
			this.cached = true;
			let vloletArr: Array<any> = [], ywArr: Array<any> = [], redArr: Array<any> = [], blueArr: Array<any> = [], yellowArr: Array<any> = [], greenArr: Array<any> = [], czArr: Array<any> = [];
			for (let i: number = 0; i < 5; ++i) {
				vloletArr.push(`donghua/baozha/bz${i + 1}.png`);
			}
			Laya.Animation.createFrames(vloletArr, 'bz');
			vloletArr = [],
				redArr = [],
				yellowArr = [],
				blueArr = [],
				greenArr = [];
			for (let i: number = 5; i < 9; ++i) {
				vloletArr.push(`donghua/baozha/bz${i + 1}.png`);
			}
			for (let i: number = 0; i < 3; ++i)czArr.push(`donghua/chuizi/lb${i + 1}.png`);
			for (let i: number = 0; i < 17; ++i)ywArr.push(`donghua/yanwu/yw${i + 1}.png`);
			Laya.Animation.createFrames(vloletArr, 'bz1');
			// Laya.Animation.createFrames(redArr, 'red1');
			// Laya.Animation.createFrames(blueArr, 'blue1');
			// Laya.Animation.createFrames(yellowArr, 'yellow1');
			// Laya.Animation.createFrames(greenArr, 'green1');
			Laya.Animation.createFrames(czArr, 'percussion');
			Laya.Animation.createFrames(ywArr, 'yw');
		}
		this.role = role; //角色，后面用于切换图片，定位
		this.main = main;
		this.initRoleBox(y);
		Laya.timer.loop(1000, this, this.loop);
		Laya.timer.loop(3000, this, this.saveUserInfo)
		this.boxY = y;
		// this.sendParticle(500,500);
		config.gameOver = false; //设置有存档
		this.addParBox();
	}
	//初始化装角色的box
	private initRoleBox(posy: number): void {
		let scX: number = Laya.Browser.window.scX;
		if (config.nickName.indexOf("rdgztest") != -1 || config.nickName.indexOf("minigame") != -1 || config.nickName.indexOf("Lu。") != -1 || config.nickName.indexOf("水星") != -1
			|| config.nickName.indexOf("Fs") != -1 || config.nickName.indexOf("子昂2019") != -1 || config.nickName.indexOf("唐若") != -1 || config.nickName.indexOf("雨墨") != -1) {
			this.roleBox = this.getImage('xinzhuye/kk.png', 750 * scX, 900 * scX, 0, posy);
			this.row = 10;
			this.clos = 10;
		} else {
			this.roleBox = this.getImage('xinzhuye/kk.png', 750 * scX, 696 * scX, 0, posy);
		}
		Laya.stage.addChild(this.roleBox);
		this.initStarArray();
	}
	private getImage(key: string, _w: number, _h: number, x: number = 0, y: number = 0): Laya.Sprite {
		let sp: Laya.Sprite = new Laya.Sprite();
		sp.width = _w;
		sp.height = _h;
		sp.graphics.drawTexture(Laya.loader.getRes(`${key}`), 0, 0, _w, _h);
		sp.pos(x, y);
		return sp;
	}
	//产生10行10列，必须要保证是偶数的
	private initStarArray(): void {

		if (Laya.stage.getChildByName('tipNum') != null) Laya.stage.removeChildByName('tipNum');
		if (Laya.stage.getChildByName('tipNum1') != null) Laya.stage.removeChildByName('tipNum1');
		config.levelGetNum = 1;
		this.accountScore = 2000;
		let m: number = 0, o1: number = 0, o2: number = 0, o3: number = 0, o4: number = 0, o5: number = 0;
		let colorsArr: Array<any> = []; //产生一个颜色均为偶数的数组
		if (config.useUpLevel && config.userUpArr.length != 0) {
			for (let i: number = 0; i < this.row; ++i) {
				this.starIndexArr[i] = [];
				this.starArr[i] = [];
				for (let j: number = 0; j < this.clos; ++j) {
					this.starArr[i][j] = config.userUpArr[m];
					this.starIndexArr[i][j] = m++;
				}
			}
			if (config.showTxt) {
				this.showTxt = true;
				if (!config.passOk) {  //代表当前未过关，那么进行过关操作
					this.conPass();
					config.passOk = true;
				}
			}

		} else {
			//如果是变态玩法
			if (config.btPlay) {
				this.btNum++;
				if(this.btNum <= 3){
					var rndStart:number=this.randomNum(1, 5);
					var rndEnd:number=rndStart;
				}else if(this.btNum>3 && this.btNum<=7){
					var rndS:number=this.randomNum(1, 5);
					if(rndS>4){
						var rndStart:number=rndS-1;
						var rndEnd:number=rndS;
					}else{
						var rndStart:number=rndS;
						var rndEnd:number=rndS+1;
					}
				}else if(this.btNum>7 && this.btNum<=12){
					var rndS:number=this.randomNum(1, 5);
					if(rndS>3){
						var rndStart:number=rndS-2;
						var rndEnd:number=rndS;
					}else{
						var rndStart:number=rndS;
						var rndEnd:number=rndS+2;
					}
				}else if(this.btNum>12 && this.btNum<=18){
					var rndS:number=this.randomNum(1, 5);
					if(rndS>2){
						var rndStart:number=rndS-3;
						var rndEnd:number=rndS;
					}else{
						var rndStart:number=rndS;
						var rndEnd:number=rndS+3;
					}
				}else{
					var rndStart:number=1;
					var rndEnd:number=5;
				}
			}else{
				var rndStart:number=1;
				var rndEnd:number=5;
			}
			for (let i: number = 0; i < this.row; ++i) {
				colorsArr[i] = [];
				this.starIndexArr[i] = [];
				for (let j: number = 0; j < this.clos; ++j) {
					let rnd: number = this.randomNum(rndStart, rndEnd);
					colorsArr[i][j] = rnd;
					this.starIndexArr[i][j] = m++;
				}
			}
			//随机排序二维数组
			this.starArr = this.sortDoubleArr(colorsArr);
			this.showTxt = false;
			config.passOk = false;
			this.main.setPassOk(false);
		}
		if (config.useUpLevel)
			this.addRole(this.starArr, true);
		else
			//添加角色
			this.addRole(this.starArr);

		this.main.setNextLevel(config.passLevel);
	}
	//添加角色
	private addRole(arr: Array<any>, r: boolean = false): void {
		let m: number = 0;
		let self: any = this;
		for (let i: number = 0; i < this.row; ++i) {
			for (let j: number = 0; j < this.clos; ++j) {
				if (arr[i][j] != 0) {
					//初始化角色列
					let sp: any = new Laya.Sprite();
					sp.width = 74 * Laya.Browser.window.scX;
					sp.height = 81 * Laya.Browser.window.scX;
					// sp.loadImage(`tupian/${this.IMGARR[arr[i][j] - 1]}.png`);
					sp.pivot(sp.width / 2, sp.height / 2);
					sp.graphics.drawTexture(Laya.loader.getRes(`tupian/${this.IMGARR[arr[i][j] - 1]}.png`), 0, 0, 74 * Laya.Browser.window.scX, 81 * Laya.Browser.window.scX);
					sp.index = m;
					sp.start = m;
					sp.kills = false; //是否被杀
					sp.name = `role${m}`;
					sp.colors = arr[i][j]; //标识是哪一个颜色
					sp.on(Laya.Event.CLICK, this, this.roleClick); //添加元素点击事件
					sp.size(this.rowWidth(), this.rowWidth());
					if (!r) {
						sp.pos(sp.width / 2 + this.rowWidth() * i + 3 * Laya.Browser.window.scX, -sp.height / 2 - (arr.length - j) * this.rowWidth());// -(arr.length - j) * this.rowWidth()
						Laya.Tween.to(sp, { y: sp.height / 2 + j * this.rowWidth() + 12 * Laya.Browser.window.scX + 7 * Laya.Browser.window.scX * j }, 1000, Laya.Ease.elasticOut, Laya.Handler.create(this, e => {

						}), i * 30);
					} else {
						sp.pos(sp.width / 2 + this.rowWidth() * i + 3 * Laya.Browser.window.scX, sp.height / 2 + j * this.rowWidth() + 12 * Laya.Browser.window.scX + 7 * Laya.Browser.window.scX * j);
					}
					this.roleBox.addChild(sp);
				}
				m++
			}
		}
		if (config.useUpLevel) {
			config.useUpLevel = false;
			if (this.gameOver()) {  //游戏结束
				//走结算
				if (config.passOk) {//进入下一关
					self.accountGame();
					return;
				}
				let alivePopup: any = new PopupManager();
				Laya.stage.addChild(alivePopup);
				alivePopup.alivePopup((data: number) => {
					new SoundManager('shengyin/fail.mp3', false, 1);
					if (data == -1) { //结算数据
						self.accountGame(false);
						Laya.timer.clear(self, self.saveUserInfo);
						config.saveLevelInfo = null; //设置暂未开放清除数据
					} else if (data == 4) {
						console.log('继续游戏');
						new AllTip('暂未开放');
						self.refresh(); //让用户有可以消除的
						self.accountGame(false);
						self.gameOvers = false;
						Laya.timer.clear(self, self.saveUserInfo);
						config.saveLevelInfo = null; //设置暂未开放清除数据
						// config.prop['cz']+=1;
						// config.prop['pen']+=1;
						// config.prop['resetImg']+=1;
						// config.prop['resetImg']+=1;
						// config.prop = {  //四种道具的数量
						// 	'cz': 1, 'pen': 1, 'resetImg': 1, 'bomb': 1
						// };
						// this.main.addFourProp();
					}
				});
				alivePopup.zOrder = 8;
			}
		}
	}
	//星星点击操作，在每一个消除星星处都要播放一个动画
	private roleClick(e: Laya.Event): void {
		new SoundManager('shengyin/btn.mp3', false, 1);
		if (this.account) return;
		if (this.gameEnd) return;
		this.gameEnd = true;
		this.tipNum = 3;
		let events: any = e.target;
		if (this.useBS) {//使用笔刷
			this.userHammer(events.index);
			this.gameEnd = false;
			return;
		} else if (this.useCZ) {
			this.usePercussion(events.index);
			this.useCZOk = false;
			this.gameEnd = false;
			return;
		} else if (this.useStar) {
			this.gameEnd = false;
			return;
		}
		if (this.playFlag) {
			this.clearAnimation(this.commStar);
			this.playFlag = false;
		}
		this.commStar = [];
		this.getCommStar(events.index);
		//下一步消除元素
		this.clearStar(this.commStar, events.index);
	}
	private rowWidth(): number {
		return 746 * Laya.Browser.window.scX / 10;
	}
	//判断游戏是否结束
	private gameOver(): boolean {//坐标转换有问题
		for (var i = 0; i < this.row * this.clos; i++) {
			let position: any = this.getPos(i);  //获取坐标位置
			if (!this.starArr[position.x][position.y]) continue; // 已经消去的，跳过
			let position1: any = this.getPos(i - 1);  //获取坐标位置
			let position2: any = this.getPos(i + 1);  //获取坐标位置
			let position3: any = this.getPos(i - this.clos);  //获取坐标位置
			let position4: any = this.getPos(i + this.clos);  //获取坐标位置
			if (position.y > 0 && position.x >= 0 && this.starArr[position1.x][position1.y] == this.starArr[position.x][position.y]) {
				return false;
			}
			//向下查找没问题
			if (position.y < this.clos - 1 && position.x >= 0 && this.starArr[position2.x][position2.y] == this.starArr[position.x][position.y]) {
				return false;
			}
			if (position.x > 0 && position.y >= 0 && this.starArr[position3.x][position3.y] == this.starArr[position.x][position.y]) {
				return false;
			}
			if (position.x < this.row - 1 && position.y >= 0 && this.starArr[position4.x][position4.y] == this.starArr[position.x][position.y]) {
				return false;
			}
		}
		return true;
	}
	//转换为对应二维数组坐标
	private getPos(index: number): any {
		return { x: Math.floor(index / this.clos), y: index % this.clos }; // game.row =10 
	}
	//获取相同的星星的集合
	private getCommStar(index: number): void {
		this.commStar.push(index);  //存储进去
		// game.getImg(index).className = "on"; //设置亮图
		this.setRoleSelect(index);
		let position: any = this.getPos(index);  //获取坐标位置
		let position1: any = this.getPos(index - 1);  //获取坐标位置
		let position2: any = this.getPos(index + 1);  //获取坐标位置
		let position3: any = this.getPos(index - this.clos);  //获取坐标位置
		let position4: any = this.getPos(index + this.clos);  //获取坐标位置
		//判断四个方向是否有相同的颜色，而且不存在commStar数组中
		//然后根据上下左右去递归
		//上,首先需要判断是否已经在数组中，人后在判断是否两个颜色一致，一致则继续递归,最后需要判断是否越界了
		//向上查找没问题
		if (position.y > 0 && position.x >= 0 && this.commStar.indexOf(index - 1) < 0 && this.starArr[position1.x][position1.y] == this.starArr[position.x][position.y]) {
			this.getCommStar(index - 1);
		}
		//向下查找没问题
		if (position.y < this.clos - 1 && position.x >= 0 && this.commStar.indexOf(index + 1) < 0 && this.starArr[position2.x][position2.y] == this.starArr[position.x][position.y]) {
			this.getCommStar(index + 1);
		}
		if (position.x > 0 && position.y >= 0 && this.commStar.indexOf(index - this.clos) < 0 && this.starArr[position3.x][position3.y] == this.starArr[position.x][position.y]) {
			this.getCommStar(index - this.clos);
		}
		if (position.x < this.row - 1 && position.y >= 0 && this.commStar.indexOf(index + this.clos) < 0 && this.starArr[position4.x][position4.y] == this.starArr[position.x][position.y]) {
			this.getCommStar(index + this.clos);
		}
	}
	//播放动画
	private playAnimation(action: string, target: any, interval: number = 50, starLen: number = 0, account: boolean = false, len: number = 0): void {
		let self: any = this;
		if (!self.useStar)
			// new SoundManager('shengyin/xc.mp3', false, .5);
			new SoundManager('shengyin/xc.mp3', false, .5);
		let roleEm: Laya.Animation = new Laya.Animation();
		roleEm.interval = interval;
		//监听播放完成动画
		roleEm.on(Laya.Event.COMPLETE, this, function (e: Laya.Event) {
			// this.roleBox.removeChild(target);//移除子元素
			//这里再次执行会继续走上面这个回调
			let actionName: string = action;
			roleEm.removeSelf();
			self.playAnimationLast(`bz1`, target, interval);  //${actionName}

			if (account) { //游戏结算
				if (starLen == 0) {
					if (config.nickName.indexOf("rdgztest") != -1 || config.nickName.indexOf("minigame") != -1 || config.nickName.indexOf("Lu。") != -1 || config.nickName.indexOf("水星") != -1
						|| config.nickName.indexOf("Fs") != -1 || config.nickName.indexOf("子昂2019") != -1 || config.nickName.indexOf("唐若") != -1 || config.nickName.indexOf("雨墨") != -1) {
						config.testHp -= len * 10;
						this.main.nowGold.text = `本局目标：${new FormatNumber(config.testHp).formatPointNumber()}`;
					}
					self.setAccountData(self.aliveOk, 1);
				}
			} else {
				if (starLen == 0) {
					if (config.nickName.indexOf("rdgztest") != -1 || config.nickName.indexOf("minigame") != -1 || config.nickName.indexOf("Lu。") != -1 || config.nickName.indexOf("水星") != -1
						|| config.nickName.indexOf("Fs") != -1 || config.nickName.indexOf("子昂2019") != -1 || config.nickName.indexOf("唐若") != -1 || config.nickName.indexOf("雨墨") != -1) {
						config.testHp -= len * 10;
						this.main.nowGold.text = `本局目标：${new FormatNumber(config.testHp).formatPointNumber()}`;
					}
					// if (len >= 3 && len < 6) {
					// 	new SoundManager('shengyin/good.mp3', false, 1);
					// }
					// if (len >= 6 && len < 10) {
					// 	new SoundManager('shengyin/great.mp3', false, 1);
					// }
					// if (len >= 10 && len < 18) {
					// 	new SoundManager('shengyin/excellent.mp3', false, 1);
					// }
					// if (len >= 18 && len < 30) {
					// 	new SoundManager('shengyin/amazing.mp3', false, 1);
					// }
					// if (len >= 30) {
					// 	new SoundManager('shengyin/unbelievable.mp3', false, 1);
					// }
					if (len >= 7) {  //这里会弹出多次
						//弹出获得道具
						let getDayGift: any = new PopupManager();
						getDayGift.name = 'getDayGift';
						Laya.stage.addChild(getDayGift);
						getDayGift.zOrder = 6;
						getDayGift.getProp(self.PROPARR[self.randomNum(0, self.PROPARR.length - 1)], 1, self.main);
					}
					self.moveRole();
					if (self.gameOvers) {
						if (self.alivePopup) return;
						self.alivePopup = true;
						setTimeout(() => {
							if (config.passOk) {//进入下一关
								// config.passOk = false;
								self.alivePopup = false;
								self.gameOvers = false;
								self.accountGame();
								return;
							}
							let alivePopup: any = new PopupManager();
							Laya.stage.addChild(alivePopup);
							alivePopup.alivePopup((data: number) => {
								new SoundManager('shengyin/fail.mp3', false, 1);
								if (data == -1) { //结算数据
									self.accountGame(false);
									Laya.timer.clear(self, self.saveUserInfo);
									config.saveLevelInfo = null; //设置暂未开放清除数据
								} else if (data == 4) {
									console.log('继续游戏');
									new AllTip('暂未开放');
									self.refresh(); //让用户有可以消除的
									self.accountGame(false);
									self.gameOvers = false;
									Laya.timer.clear(self, self.saveUserInfo);
									config.saveLevelInfo = null; //设置暂未开放清除数据
									// config.prop = {  //四种道具的数量
									// 	'cz': 1, 'pen': 1, 'resetImg': 1, 'bomb': 1
									// };
									// this.main.addFourProp();
								}
							});
							alivePopup.zOrder = 8;
						}, 800);
						if (self.useStar)
							self.useStar = false;
					} else {
						self.tipNum = 3;
						self.gameEnd = false;
						if (self.useStar)
							self.useStar = false;
					}
				}
			}
		});
		//播放某个动画
		roleEm.play(0, false, `bz`);  //${action}
		roleEm.zOrder = 10;
		let boundes: any = roleEm.getBounds();
		roleEm.pos(this.roleBox.x + target.x + (target.width - boundes.width) / 2 - target.width / 2, this.roleBox.y + target.y + (target.height - boundes.height) / 1.75);
		Laya.stage.addChild(roleEm);
	}
	//动画后半段
	private playAnimationLast(action: string, target: any, interval: number = 20) {
		let self: any = this;
		let roleEm: Laya.Animation = new Laya.Animation();
		roleEm.interval = interval;
		//监听播放完成动画
		roleEm.on(Laya.Event.COMPLETE, this, function (e: Laya.Event) {
			roleEm.removeSelf();
		});
		roleEm.play(0, false, `${action}`);
		roleEm.zOrder = 10;
		let boundes: any = roleEm.getBounds();
		roleEm.pos(this.roleBox.x + target.x + (target.width - boundes.width) / 2 - target.width / 2, this.roleBox.y + target.y + (target.height - boundes.height) / 1.75);
		Laya.stage.addChild(roleEm);
	}
	//设置关卡
	private setAccountData(type: boolean, num: number): void {
		if (type) {
			if (config.userNowHp > this.accountScore) {
				config.userNowHp -= this.accountScore;
				this.main.setProsPos();
				this.roleBox.removeChildren();
				Laya.stage.removeChildByName('tipNum');
				setTimeout(() => {
					this.initStarArray();
					this.tipNum = 3;
					this.gameEnd = false;
					this.account = false;
				}, 1500);
			} else {
				let sy: number = this.accountScore - config.userNowHp;//肯定过关了
				config.userNowHp = 0; //请求接口进入下一关
				config.nowLevel++;
				this.main.setRoleImg(config.nowLevel);
				this.main.leftTopImg(parseInt(config.nowLevel) + 1);
				if (!config.passOk) {  //代表当前未过关，那么进行过关操作
					this.conPass();
					config.passLevel++;
					config.passOk = true;
				}
				this.main.setLevel(config.nowLevel);
				if (config.nowLevel > 4) {
					config.userHp = config.bossHpArr[config.bossHpArr.length - 1] + 100 * (config.nowLevel - 1);
					config.userNowHp = config.bossHpArr[config.bossHpArr.length - 1] + 100 * (config.nowLevel - 1) - sy;
				} else {
					config.userHp = config.bossHpArr[config.nowLevel];
					config.userNowHp = config.bossHpArr[config.nowLevel] - sy;
				}
				this.main.setProsPos();
				Laya.stage.removeChildByName('tipNum');
				this.roleBox.removeChildren();
				setTimeout(() => {
					this.initStarArray();
					this.tipNum = 3;
					this.gameEnd = false;
					this.account = false;
				}, 1500);
			}
		} else {
			//走这个
			if (config.userNowHp > this.accountScore) {
				config.userNowHp -= this.accountScore;
				this.main.setProsPos();
				//游戏结束
				if (Laya.Browser.onMiniGame) {
					let openDataContext: any = Laya.Browser.window.wx.getOpenDataContext();
					openDataContext.postMessage({ action: 'clear' });//第一个参数缩放比，第二个参数openid
					openDataContext.postMessage({ action: 'set', score: config.nowLevel });//存储关卡以及分数
				}
				new GetData(`/EatChicken/user/gameOver.action?maxResult=${config.userHp - config.userNowHp}&checkpoint=${config.nowLevel}`, 'get', {}, config.cookie, (data): void => {
					setTimeout(() => {
						if (Laya.stage.getChildByName('tipNum') != null) Laya.stage.removeChildByName('tipNum');
						if (Laya.stage.getChildByName('tipNum1') != null) Laya.stage.removeChildByName('tipNum1');
						if (this.prBox != undefined) Laya.stage.removeChild(this.prBox);
						let scene: Laya.Scene = new Laya.Scene();
						scene.loadScene('MyScene/Home.scene');
						Laya.stage.addChild(scene);
						this.main.scene.removeSelf();
					}, 1500);
				});
			} else {
				let sy: number = this.accountScore - config.userNowHp;//肯定过关了
				config.userNowHp = 0; //请求接口进入下一关
				config.nowLevel++;
				this.main.setRoleImg(config.nowLevel);
				this.main.leftTopImg(parseInt(config.nowLevel) + 1);
				if (!config.passOk) {  //代表当前未过关，那么进行过关操作
					this.conPass();
					Laya.stage.removeChildByName('tipNum');
					config.passLevel++;
					config.passOk = true;
					//初始化
					this.roleBox.removeChildren();
					setTimeout(() => {
						this.initStarArray();
						this.tipNum = 3;
						this.gameEnd = false;
						this.account = false;
					}, 1000);
				}
				this.main.setLevel(config.nowLevel);
				if (config.nowLevel > 4) {
					config.userHp = config.bossHpArr[config.bossHpArr.length - 1] + 100 * (config.nowLevel - 1);
					config.userNowHp = config.bossHpArr[config.bossHpArr.length - 1] + 100 * (config.nowLevel - 1) - sy;
				} else {
					config.userHp = config.bossHpArr[config.nowLevel];
					config.userNowHp = config.bossHpArr[config.nowLevel] - sy;
				}
				this.main.setProsPos();
			}
		}
	}
	//随机删除
	private delRandom(delNum: number): Array<any> {
		let clearOneArr: Array<any> = this.flatten(this.starArr); //转为一维数组
		// //记录剩余的位置
		let haveArr: Array<any> = [];  //不为0
		for (let i: number = 0; i < clearOneArr.length; ++i) {
			if (clearOneArr[i] != 0) {
				haveArr.push(i);
			}
		}
		let m: number = 0, starClone: Array<any> = this.starArr, str: string = '';
		for (let i: number = 0; i < this.row; ++i) {
			for (let j: number = 0; j < this.clos; ++j) {
				m++;
			}
		}
		//随机取五个
		let delArr: Array<any> = [];
		if (haveArr.length >= delNum) {
			for (let i: number = 0; i < delNum; ++i) {
				let rnd: number = this.randomNum(0, haveArr.length - 1); //随机获取一个
				if (delArr.indexOf(haveArr[rnd]) != -1) {
					while (true) { //已经有了，再次循环
						let rnd: number = this.randomNum(0, haveArr.length - 1); //随机获取一个
						if (delArr.indexOf(haveArr[rnd]) == -1) {
							delArr.push(haveArr[rnd]);
							break;
						}
					}
				} else {
					delArr.push(haveArr[rnd]);
				}
			}
		} else {
			for (let i: number = 0; i < haveArr.length; ++i) {
				delArr.push(haveArr[i]);
			}
		}
		//根据delArr去获取元素
		this.commStar = [];
		// let clearArr:Array<any>=[];
		// for (let i: number = 0; i < delArr.length; ++i) {
		// 	let role: any = this.roleBox.getChildAt(delArr[i]);
		// 	clearArr.push(role.index);
		// }
		return delArr;
		//直接删除
		// this.clearStar(this.commStar, this.commStar[0]);
	}
	//设置元素选中
	private setRoleSelect(index: number): void {
		//设置元素选中
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			if (this.roleBox._children[i].index == index) this.roleBox._children[i].rotation = 0;
		}
	}
	//清除元素选中
	private clearRoleSelect(): void {
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			this.roleBox._children[i].rotation = 0;
		}
	}
	//消除星星
	private clearStar(clearArr: Array<any>, clickIndex: number, clearOne: boolean = false, delNum: boolean = false): void {
		//消除
		if (!clearOne && clearArr.length < 2) { this.gameEnd = false; this.clearRoleSelect(); return; }
		let removeChildArr: Array<any> = [], colorArr: Array<any> = [];
		//初始化两个数组
		for (let i: number = 0; i < clearArr.length; ++i) {
			removeChildArr[i] = [];
			colorArr[i] = [];
		}
		//此处已经完成了数组的置换
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			let serachIndex: number = clearArr.indexOf(this.roleBox._children[i].index);
			if (serachIndex != -1) {
				let position: any = this.getPos(this.roleBox._children[i].index);
				this.roleBox._children[i].kills = true;
				removeChildArr[serachIndex] = this.roleBox._children[i];
				colorArr[serachIndex] = this.starArr[position.x][position.y];
				this.starArr[position.x][position.y] = 0; //设置对应的下标为0
			}
		}
		//此处直接移动数
		if (!this.account) {
			// this.addTxtTip('BOSS血量减少：' + (clearArr.length <= 2 ? clearArr.length * 10 : ((10 + (clearArr.length - 1) * 5) * clearArr.length)));
			//更新数组位置
			this.moveDown();
			this.moveLeft();
		}
		this.gameOvers = this.gameOver();
		// if(this.gameOvers)this.account=true;
		this.gameEnd = true;
		//从第nowIndex开始消除
		if (delNum) {
			for (let i: number = 0; i < removeChildArr.length; ++i) {
				//粒子的起点
				((color, child, i, len, removeLen) => {
					setTimeout(() => {
						let pos: any = this.getPos(child.index);
						let _color: any = color, _child: any = child, _i: any = i, _len: any = len, _removeLen: any = removeLen;
						this.sendParticle(Laya.stage.width / 4 * 3 + (Laya.stage.width / 4 - 95 * Laya.Browser.window.scX) / 2 + 95 * Laya.Browser.window.scX / 2, 1160 * Laya.Browser.window.scY + 95 * Laya.Browser.window.scX / 2, 30 * Laya.Browser.window.scX + this.rowWidth() / 2 + pos.x * this.rowWidth(),
							this.boxY + this.rowWidth() / 2 + pos.y * this.rowWidth(), i, removeChildArr.length, () => {
								this.roleBox.removeChild(_child);
								if (config.nickName.indexOf("rdgztest") == -1 && config.nickName.indexOf("minigame") == -1 && config.nickName.indexOf("Lu。") == -1 && config.nickName.indexOf("水星") == -1
									&& config.nickName.indexOf("Fs") == -1 && config.nickName.indexOf("子昂2019") == -1 && config.nickName.indexOf("唐若") == -1 && config.nickName.indexOf("雨墨") == -1) {
									this.flayProp(`${color}p`, child, removeLen);
								}
								this.playAnimation(`${_color}`, _child, 50, _len, false, _removeLen); //到时候根据颜色去
							});
					}, i * 300);
				})(this.IMGARR[colorArr[i] - 1], removeChildArr[i], i, removeChildArr.length - i - 1, removeChildArr.length);
			}
			return;
		}
		//移除，一个一个的播放动画
		for (let i: number = 0; i < removeChildArr.length; ++i) {
			if (!this.account) {
				((color, child, i, len, removeLen) => {
					setTimeout(() => {
						this.roleBox.removeChild(child);
						if (config.nickName.indexOf("rdgztest") == -1 && config.nickName.indexOf("minigame") == -1 && config.nickName.indexOf("Lu。") == -1 && config.nickName.indexOf("水星") == -1
							&& config.nickName.indexOf("Fs") == -1 && config.nickName.indexOf("子昂2019") == -1 && config.nickName.indexOf("唐若") == -1 && config.nickName.indexOf("雨墨") == -1) {
							this.flayProp(`${color}p`, child, removeLen);
						}
						this.playAnimation(`${color}`, child, 50, len, false, removeLen); //到时候根据颜色去
					}, i * 50);
				})(this.IMGARR[colorArr[i] - 1], removeChildArr[i], i, removeChildArr.length - i - 1, removeChildArr.length);
			} else {
				this.roleBox.removeChild(removeChildArr[i]);
				this.endLen -= 1;
				this.playAnimation(`${this.IMGARR[colorArr[i] - 1]}`, removeChildArr[i], 50, this.endLen, true); //到时候根据颜色去
			}
		}
	}
	//从中间向边上删除，无效
	private centerToBound(index: number, clearArr: Array<any>, delObj: Array<any>): void {
		let delIndex: number = 0;
		//找到对应的下标
		for (let i: number = 0; i < delObj.length; ++i) {
			//判断哪个位置
			if (delObj[i].index == index) delIndex = i;
		}
		//删除数组内容
		for (let i: number = 0; i < clearArr.length; ++i)if (clearArr.indexOf(index) != -1) { clearArr.splice(i, 1); break; }
		// setTimeout(() => {
		this.roleBox.removeChild(delObj[delIndex]);
		// this.playAnimation('red', delObj[delIndex]); //到时候根据颜色去
		// }, 250);
		//四向查找
		// console.log(index, clearArr)
		if (clearArr.indexOf(index - 1) != -1) {
			this.centerToBound(index - 1, clearArr, delObj);
		}
		if (clearArr.indexOf(index - this.clos) != -1) {
			this.centerToBound(index - this.clos, clearArr, delObj);
		}
		if (clearArr.indexOf(index + this.clos) != -1) {
			this.centerToBound(index + this.clos, clearArr, delObj);
		}
		if (clearArr.indexOf(index + 1) != -1) {
			this.centerToBound(index + 1, clearArr, delObj);
		}
	}
	//向下移动
	private moveDown(type: boolean = true): void {
		for (var i: number = 0; i < this.row; i++)// 循环最下面一行的10列
		{
			var c = 0;// 每列被消去的星星数量
			for (var j: number = (this.clos - 1) + i * this.clos; j >= i * this.clos; j--) // 循环每列的10个星星
			{
				let position: any = this.getPos(j);
				if (!this.starArr[position.x][position.y]) {
					c++;
				} else
					if (c) {
						let position1: any = this.getPos(j + c);
						this.starArr[position1.x][position1.y] = this.starArr[position.x][position.y];//重置移动后的星星数组值
						this.starArr[position.x][position.y] = 0;
						if (type) this.setRoleSEIndex(j, j + c); //更新元素位置
					}
			}
		}

	}
	//移动角色
	private moveRole(): void {
		//s代表开始位置，e代表结束位置
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			//代表当前下标相等
			if (!this.roleBox._children[i].kills) {
				let position1: any = this.getPos(this.roleBox._children[i].index);  //每次进来，元素的结束位置都变了
				// if(this.roleBox._children[i].tweens!=undefined){this.roleBox._children[i].tweens.clear();this.roleBox._children[i].tweens=undefined;}
				this.roleBox._children[i].tweens = Laya.Tween.to(this.roleBox._children[i], {
					y: (this.rowWidth() - this.roleBox._children[i].height) / 2 + this.roleBox._children[i].height / 2 + position1.y * this.rowWidth() + 12 * Laya.Browser.window.scX + 7 * Laya.Browser.window.scX * position1.y,
					x: (this.rowWidth() - this.roleBox._children[i].width) / 2 + this.roleBox._children[i].width / 2 + position1.x * this.rowWidth() + 3 * Laya.Browser.window.scX,
					update: Laya.Handler.create(this, e => {
					})
				}, 300, Laya.Ease.expoInOut, Laya.Handler.create(this, e => {
				}), 0)
			}
		}
	}
	//设置元素的新坐标
	private setRoleSEIndex(s: number, e: number) {
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			if (this.roleBox._children[i].index == s && !this.roleBox._children[i].kills) {
				//代表当前下标相等
				this.roleBox._children[i].start = s;
				this.roleBox._children[i].index = e;
				this.roleBox._children[i].name = `role${e}`;
				break;
			}
		}
	}

	//二维数组随机排序
	private sortDoubleArr(arr: Array<any>): Array<any> {
		let starArrOne: Array<any> = this.flatten(arr);  //将数组转为一维数组
		starArrOne.sort(function () { return 0.5 - Math.random(); }); //随机排序
		//循环二维数组,替换数组
		let m: number = 0;
		for (let i: number = 0; i < this.row; ++i) {
			for (let j: number = 0; j < this.clos; ++j) {
				if (arr[i][j] != 0) { arr[i][j] = starArrOne[m]; m++; } //替换
			}
		}
		return arr;
	}
	//洗牌操作
	private refresh(): void {
		//随机排列数组
		//先将数组转化为一维数组
		//由于消除后，为0了，那么不能包含0
		let m: number = 0;
		//根据元素位置去刷新
		let starArrIndex: Array<any> = [];  //记录元素的位置
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			starArrIndex.push(this.roleBox._children[i].index);
		}
		//排序
		starArrIndex.sort(function () { return 0.5 - Math.random(); }); //随机排序
		let nowStarArr: Array<any> = [];

		for (let i: number = 0; i < this.row; ++i) {
			nowStarArr[i] = [];
			for (let j: number = 0; j < this.clos; ++j) {
				nowStarArr[i][j] = this.starArr[i][j];
			}
		}
		let starArrOne: Array<any> = this.flatten(nowStarArr);
		//转为一维数组
		for (let i = 0; i < starArrOne.length; ++i) {
			if (starArrOne[i] != 0) {
				let t: number = starArrOne[i];
				starArrOne[i] = starArrOne[starArrIndex[m]];
				starArrOne[starArrIndex[m]] = t;
				m++;
			}
		}
		m = 0;
		//位置排序以后重新设置二维数组
		for (let i: number = 0; i < this.row; ++i) {
			for (let j: number = 0; j < this.clos; ++j) {
				this.starArr[i][j] = starArrOne[m];
				m++;
			}
		}
		//检查是否结束
		if (this.gameOver()) {
			this.refresh(); //重复
		} else {
			m = 0;
			this.te = 0;
			//更新元素位置,需要更新name，index，但是不能同步更新，那样会存在错误
			for (let i: number = 0; i < this.row; ++i) {
				for (let j: number = 0; j < this.clos; ++j) {
					if (this.starArr[i][j] != 0) {
						let child: any = this.roleBox.getChildByName(`role${starArrIndex[m]}`);  //获取到元素
						Laya.Tween.to(child, {
							y: (this.rowWidth() - child.height) / 2 + child.height / 2 + i * this.rowWidth() + 12 * Laya.Browser.window.scX + 7 * Laya.Browser.window.scX * j,
							x: (this.rowWidth() - child.width) / 2 + child.width / 2 + j * this.rowWidth() + 3 * Laya.Browser.window.scX, update: Laya.Handler.create(this, e => {
							})
						}, 100, Laya.Ease.linearOut, Laya.Handler.create(this, e => {
							this.te++;
						}), 0)
						m++;
					}
				}
			}
			m = 0;
			Laya.timer.loop(1, this, this.exchangeRoleBox);
		}
	}
	private exchangeRoleBox(): void {
		if (this.te == this.roleBox._children.length) {
			this.te = 0;
			this.gameEnd = false;
			this.clearTimer();
			this.roleBox.removeChildren();
			this.addRole(this.starArr, true);
		}
	}
	private clearTimer(): void {
		Laya.timer.clear(this, this.exchangeRoleBox);
	}
	//将二维数组转为一维数组
	private flatten(arr: Array<any>): Array<any> { return [].concat(...arr.map(x => Array.isArray(x) ? this.flatten(x) : x)) }
	//所有星星向左移动
	private moveLeft(type: boolean = true): void {
		var line = 0, t = 1;// line 需要移动的列数，t 当前列是否都为0
		for (var i: number = 0; i < this.row; i++) {
			t = 1;
			for (var j: number = (this.clos - 1) + i * this.clos; j >= i * this.clos; j--) {
				let position: any = this.getPos(j);
				if (this.starArr[position.x][position.y]) { t = 0; break; } //判断这一行是否还有物体
			}
			if (t) //当前列都为0 ,需要移动的列数+1
			{
				line++;
			} else if (line) // 当前列还有未消除的星星，且要移动的列数>0时，移动当前列
			{
				this.moveLeftLine(i, line, type);
			}
		}
	}
	//正规向左移动
	private moveLeftLine(index: number, line: number, type: boolean): void {
		//移动元素
		for (var j: number = (this.clos - 1) + index * this.clos; j >= index * this.clos; j--) {
			let position1: any = this.getPos(j - line * this.clos);
			let position: any = this.getPos(j);
			this.starArr[position1.x][position1.y] = this.starArr[position.x][position.y];//重置移动后的星星数组值
			this.starArr[position.x][position.y] = 0;
			if (type) this.setRoleSEIndex(j, j - line * this.clos);
		}
	}
	//获取随机数
	public randomNum(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	//寻找一组最多的给与提示
	public searchCommMax(): Array<any> {
		let maxArr: Array<any> = []; //存储寻找结果
		//每一个元素都要去寻找，查看其周围个数
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			this.commStar = [];
			this.getCommStar(this.roleBox._children[i].index);//所有都去寻找一次
			if (maxArr.length < this.commStar.length) {
				maxArr = this.commStar;
			}
		}
		return maxArr;  //寻找最大的
	}
	//给与提示
	private giveUserTip(): void {
		this.commStar = this.searchCommMax();
		if (this.commStar.length < 2) this.commStar = [];
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			if (this.commStar.indexOf(this.roleBox._children[i].index) != -1) {
				this.scaleAnimation(this.roleBox._children[i]);
			}
		}
	}
	//缩放动画
	private scaleAnimation(target: any): void {
		target.scaleX = .9;
		target.scaleY = .9;
		let tweenRole: any = new Laya.Tween();
		tweenRole.to(target, {
			scaleX: .7,
			scaleY: .7
		}, 1000, Laya.Ease.linearInOut, new Laya.Handler(this, () => {
			tweenRole.to(target, {
				scaleX: .9,
				scaleY: .9
			}, 1000, Laya.Ease.linearInOut, new Laya.Handler(this, () => {
				Laya.Tween.clearTween(target); //清除动画
				this.scaleAnimation(target);  //实现循环
			}), 0);
		}), 0);

	}
	//清除动画
	private clearAnimation(arr: Array<any>): void {
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			if (arr.indexOf(this.roleBox._children[i].index) != -1) {
				Laya.Tween.clearTween(this.roleBox._children[i]);
				this.roleBox._children[i].scaleX = 1;
				this.roleBox._children[i].scaleY = 1;
			}
		}
	}
	private clearAnimationAll(): void {
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			Laya.Tween.clearTween(this.roleBox._children[i]);
			this.roleBox._children[i].scaleX = 1;
			this.roleBox._children[i].scaleY = 1;
		}
	}
	//循环
	public loop(): void {
		this.tipNum--;
		if (this.tipNum === 0 && !this.useBS && !this.useCZ && !this.gameEnd && !this.useStar && !this.account) {//为0的时候添加一次提示
			this.playFlag = true;
			// this.clearAnimationAll(); //清除所有动画
			this.giveUserTip();
		}
	}
	//使用笔刷
	public userHammer(index: number): void {
		//根据点击位置，添加框框
		this.clearAnimationAll();
		this.tipNum = 3;
		let scX: number = Laya.Browser.window.scX;
		if (Laya.stage.getChildByName('bskk') != null) Laya.stage.removeChildByName('bskk');
		let targetRole: any;
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			Laya.Tween.clearTween(this.roleBox._children[i]);
			if (this.roleBox._children[i].index == index) {
				targetRole = this.roleBox._children[i];
			}
		}
		let position: any = this.getPos(index);
		let boxX: number = 0;
		if (position.x < 3) boxX = 0;
		else if (position.x > 6) boxX = Laya.stage.width - 441 * scX;
		else boxX = targetRole.x + this.roleBox.x - 441 * scX / 2;
		let bskk: Laya.Sprite = this.getImage('zhuye/bskk.png', 441 * scX, 88 * scX, boxX, this.roleBox.y + targetRole.y - targetRole.height / 2 - 88 * scX);
		bskk.zOrder = 88;
		bskk.name = 'bskk';
		let noColor: string = this.IMGARR[this.starArr[position.x][position.y] - 1]; //代表没有哪一种颜色
		let nowColorArr: Array<any> = [];
		for (let i: number = 0; i < this.IMGARR.length; ++i) {
			if (this.IMGARR[i] != noColor) {
				nowColorArr.push(this.IMGARR[i]);
			}
		}
		this.scaleAnimation(targetRole);
		//添加元素
		let star: Laya.Sprite = this.getImage(`tupian/${nowColorArr[0]}.png`, 69 * scX, 73 * scX, 15 * scX, (bskk.height - 73 * scX) / 2);
		Object.defineProperty(star, 'colorIndex', {
			value: this.colorIndex(nowColorArr[0])
		})
		let star1: Laya.Sprite = this.getImage(`tupian/${nowColorArr[1]}.png`, 69 * scX, 73 * scX, 15 * scX + 84 * scX, (bskk.height - 73 * scX) / 2);
		Object.defineProperty(star1, 'colorIndex', {
			value: this.colorIndex(nowColorArr[1])
		})
		let star2: Laya.Sprite = this.getImage(`tupian/${nowColorArr[2]}.png`, 69 * scX, 73 * scX, 15 * scX + 84 * scX * 2, (bskk.height - 73 * scX) / 2);
		Object.defineProperty(star2, 'colorIndex', {
			value: this.colorIndex(nowColorArr[2])
		})
		let star3: Laya.Sprite = this.getImage(`tupian/${nowColorArr[3]}.png`, 69 * scX, 73 * scX, 15 * scX + 84 * scX * 3, (bskk.height - 73 * scX) / 2);
		Object.defineProperty(star3, 'colorIndex', {
			value: this.colorIndex(nowColorArr[3])
		})
		let reset: Laya.Sprite = this.getImage(`zhuye/jt.png`, 47 * scX, 52 * scX, 30 * scX + 84 * scX * 4, (bskk.height - 52 * scX) / 2);
		star.on(Laya.Event.CLICK, this, (e: Laya.Event) => {

			new SoundManager('shengyin/yanwudan.mp3', false, 1);
			let target: any = e.target;
			this.ywAnimation(targetRole);
			setTimeout(() => {
				if (Laya.stage.getChildByName('bskk') != null) Laya.stage.removeChildByName('bskk');
				Laya.Tween.clearTween(targetRole);
				this.starArr[position.x][position.y] = parseInt(target.colorIndex) + 1;
				// targetRole
				targetRole.graphics.clear();  //先清除原来的纹理
				var texture = Laya.loader.getRes(`tupian/${this.IMGARR[target.colorIndex]}.png`); //获取已加载的新的纹理
				targetRole.graphics.drawTexture(texture, 0, 0, 74 * scX, 81 * scX); //开始绘制
				targetRole.scaleX = 1;
				targetRole.scaleY = 1;
				// 设置交互区域
				targetRole.size(this.rowWidth(), this.rowWidth());
				config.confirmBS = 1;
			}, 50);
		});
		star1.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
			new SoundManager('shengyin/yanwudan.mp3', false, 1);
			let target: any = e.target;
			this.ywAnimation(targetRole);
			setTimeout(() => {
				if (Laya.stage.getChildByName('bskk') != null) Laya.stage.removeChildByName('bskk');
				Laya.Tween.clearTween(targetRole);
				this.starArr[position.x][position.y] = parseInt(target.colorIndex) + 1;
				targetRole.graphics.clear();  //先清除原来的纹理
				var texture = Laya.loader.getRes(`tupian/${this.IMGARR[target.colorIndex]}.png`); //获取已加载的新的纹理
				targetRole.graphics.drawTexture(texture, 0, 0, 74 * scX, 81 * scX); //开始绘制
				// 设置交互区域
				targetRole.size(this.rowWidth(), this.rowWidth());
				targetRole.scaleX = 1;
				targetRole.scaleY = 1;
				config.confirmBS = 1;
			});
		});
		star2.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
			new SoundManager('shengyin/yanwudan.mp3', false, 1);
			this.ywAnimation(targetRole);
			setTimeout(() => {
				if (Laya.stage.getChildByName('bskk') != null) Laya.stage.removeChildByName('bskk');
				Laya.Tween.clearTween(targetRole);
				let target: any = e.target;
				this.starArr[position.x][position.y] = parseInt(target.colorIndex) + 1;
				targetRole.graphics.clear();  //先清除原来的纹理
				var texture = Laya.loader.getRes(`tupian/${this.IMGARR[target.colorIndex]}.png`); //获取已加载的新的纹理
				targetRole.graphics.drawTexture(texture, 0, 0, 74 * scX, 81 * scX); //开始绘制
				// 设置交互区域
				targetRole.size(this.rowWidth(), this.rowWidth());
				targetRole.scaleX = 1;
				targetRole.scaleY = 1;
				config.confirmBS = 1;
			});
		});
		star3.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
			new SoundManager('shengyin/yanwudan.mp3', false, 1);
			this.ywAnimation(targetRole);
			setTimeout(() => {
				if (Laya.stage.getChildByName('bskk') != null) Laya.stage.removeChildByName('bskk');
				Laya.Tween.clearTween(targetRole);
				let target: any = e.target;
				this.starArr[position.x][position.y] = parseInt(target.colorIndex) + 1;
				targetRole.graphics.clear();  //先清除原来的纹理
				var texture = Laya.loader.getRes(`tupian/${this.IMGARR[target.colorIndex]}.png`); //获取已加载的新的纹理
				targetRole.graphics.drawTexture(texture, 0, 0, 74 * scX, 81 * scX); //开始绘制
				// 设置交互区域
				targetRole.scaleX = 1;
				targetRole.scaleY = 1;
				targetRole.size(this.rowWidth(), this.rowWidth());
				config.confirmBS = 1;
			});
		});
		reset.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
			new SoundManager('shengyin/btn.mp3', false, 1);
			if (Laya.stage.getChildByName('bskk') != null) Laya.stage.removeChildByName('bskk');
			this.clearAnimationAll();
			// Laya.Tween.clearTween(targetRole);
			this.useBS = false;
			config.confirmBS = 2;
		});
		bskk.addChild(star);
		bskk.addChild(star1);
		bskk.addChild(star2);
		bskk.addChild(star3);
		bskk.addChild(reset);
		Laya.stage.addChild(bskk);
	}
	public ywAnimation(targetRole: any): void {
		let ywEm: Laya.Animation = new Laya.Animation();
		ywEm.interval = 50;
		ywEm.play(0, false, 'yw');
		ywEm.zOrder = 10;
		ywEm.on(Laya.Event.COMPLETE, this, (e: Laya.Event) => {
			this.useBS = false;
		});
		let ywBoundes: any = ywEm.getBounds();
		ywEm.pos(this.roleBox.x + targetRole.x + (targetRole.width - ywBoundes.width) / 2 - targetRole.width / 2, this.roleBox.y + targetRole.y + (targetRole.height - ywBoundes.height) / 2 - targetRole.height * 1.5);
		Laya.stage.addChild(ywEm);
	}
	//颜色下标转换
	private colorIndex(colorName: string): number {
		for (let i: number = 0; i < this.IMGARR.length; ++i)if (colorName == this.IMGARR[i]) return i;
		return -1;
	}
	//飞出道具去击打
	private flayProp(propName: string, role: any, lens: number): void {
		let w: number = 0;
		let h: number = 0;
		let scX: number = Laya.Browser.window.scX;
		switch (propName) {
			case 'redp':
				w = 67, h = 56;
				break;
			case 'greenp':
				w = 70, h = 54;
				break;
			case 'bluep':
				w = 65, h = 58;
				break;
			case 'gayp':
				w = 59, h = 56;
				break;
			case 'yellowp':
				w = 50, h = 54;
				break;
		}
		let position: any = this.getPos(role.index);
		//这个是出现位置
		let sp: Laya.Sprite = this.getImage(`zhuye/${propName}.png`, w * scX, h * scX, this.roleBox.x + role.x, this.roleBox.y + role.y - role.height / 2 + h * scX / 2);
		sp.pivot(sp.width / 2, sp.height / 2);
		sp.alpha = 0;
		let timeJd: any = new Laya.TimeLine();
		timeJd.to(sp, {
			y: sp.y - 20,
			alpha: 1
		}, 500, Laya.Ease.linearInOut, 0);
		let xTime: number = 0;
		if (position.x < 4) {
			xTime = Math.abs(4 - position.x);
		} else if (position.x > 5) {
			xTime = position.x - 5;
		}
		//具体飞向的位置
		let goX: number = 0;
		let goY: number = 0;
		let mainBox: any = this.main.centerBox;
		let arrIndex: number = 0;
		let toX: number = 290 * scX;
		let toY: number = -200 * scX;
		if (lens < 4) {
			var roleBox: any = mainBox.getChildAt(0);
			toX = 290 * scX;
			toY = -200 * scX;
		} else if (lens >= 4 && lens < 6) {
			var roleBox: any = mainBox.getChildAt(1);
			arrIndex = 1;
			toX = 150 * scX;
			toY = -200 * scX;
		} else if (lens >= 6 && lens < 8) {
			var roleBox: any = mainBox.getChildAt(3);
			arrIndex = 3;
			toX = -150 * scX;
			toY = -200 * scX;
		} else if (lens >= 8 && lens < 10) {
			var roleBox: any = mainBox.getChildAt(4);
			arrIndex = 4;
			toX = -290 * scX;
			toY = -200 * scX;
		} else { //消除是个的时候
			var roleBox: any = mainBox.getChildAt(2);
			arrIndex = 2;
			toX = 10 * scX;
			toY = -190 * scX;
		}
		//获取其子元素
		let gone: any = roleBox.getChildByName('gone');
		let sh: any = gone.sh;
		let zdNum: any = gone.zdNum;
		goX = mainBox.x + 47.5 * scX + roleBox.x + (roleBox.width - w) / 2;
		goY = mainBox.y + roleBox.height / 3;
		let txt: any = roleBox.getChildByName('zdTxt'); //子弹数
		timeJd.to(sp, {
			x: goX,
			y: goY,
			rotation: 2000,
		}, 200 + position.y * 50 + xTime * 30, Laya.Ease.linearInOut, 0);
		let pLen: number = lens;
		timeJd.on(Laya.Event.COMPLETE, this, e => {
			//播放装载声音
			// new SoundManager('shengyin/zb.mp3', false, 1);
			txt.zidan += 1;
			txt.sjzd += 1;
			gone.scaleX = 1;
			gone.scaleY = 1;
			if (txt.zidan >= config.gone[arrIndex].zdNum) txt.zidan = config.gone[arrIndex].zdNum;
			txt.text = `${txt.zidan}/${config.gone[arrIndex].zdNum}`; //设置子弹数量
			setTimeout(() => {
				gone.scaleX = .8;
				gone.scaleY = .8;
			}, 100);
			//去击打
			setTimeout(() => {
				this.goPlayRole(roleBox, toX, toY, arrIndex, pLen);
			}, 200);
			sp.removeSelf();
		});
		timeJd.play(0, false);
		Laya.stage.addChild(sp);
	}
	private goPlayRole(target: any, x: number, y: number, index: number, pLen: number): void {
		this.main.bloodImg();
		let scX: number = Laya.Browser.window.scX;
		let zd: Laya.Sprite = this.getImage(`xinzhuye/zd.png`, 0, 0, 0, 0);
		zd.width = zd.getBounds().width * scX;
		zd.height = zd.getBounds().height * scX;
		let gone: any = target.getChildByName('gone');
		let txt: any = target.getChildByName('zdTxt');
		if (index == 0 || index == 1) {
			zd.pos(gone.width - zd.width / 2, -zd.height / 2);
		} else if (index == 3 || index == 4) {
			zd.pos(-zd.width / 2, -zd.height / 2);
		} else {
			zd.pos((gone.width - zd.width) / 2, -zd.height / 2);
		}
		//动画，让其飞过去击打
		let timePlay: any = new Laya.TimeLine();
		timePlay.to(zd, {
			y: y,
			x: x
		}, 100, Laya.Ease.linearInOut, 0);
		let propLen: number = pLen;
		if (propLen < 4) {
			new SoundManager('shengyin/shouqiang.mp3', false, 1);
		} else if (propLen >= 4 && propLen < 6) {
			new SoundManager('shengyin/chongfengqiang.mp3', false, 1);
		} else if (propLen >= 6 && propLen < 8) {
			new SoundManager('shengyin/buqiang.mp3', false, 1);
		} else if (propLen >= 8 && propLen < 10) {
			new SoundManager('shengyin/jujiqiang.mp3', false, 1);
		} else { //消除是个的时候
			new SoundManager('shengyin/daboluo.mp3', false, 1);
		}
		let self:any=this;
		timePlay.on(Laya.Event.COMPLETE, this, e => {
			//播放被击打动画
			new SoundManager('shengyin/aida.mp3', false, 1);
			txt.zidan -= 1;
			txt.sjzd -= 1;
			if (txt.sjzd <= txt.zidan) txt.zidan -= 1;
			if (txt.zidan < 0) txt.zidan = 0;
			if (txt.sjzd < 0) txt.sjzd = 0;
			txt.text = `${txt.zidan}/${config.gone[index].zdNum}`;
			zd.removeSelf();
			//播放血条抖动
			if (Laya.Browser.onMiniGame) {
				Laya.Browser.window.wx.vibrateShort({
					success: function (res) {
					}
				});
			}
			self.main.prosBox.scaleX += 0.1;
        	self.main.prosBox.scaleY += 0.1;
			self.main.role.scaleY = .7;
			setTimeout(function () {
				self.main.prosBox.scaleX -= 0.1;
				self.main.prosBox.scaleY -= 0.1;
				self.main.role.scaleY = 1;
			}, 100);
			// let timePlay: any = new Laya.TimeLine();
			// timePlay.to(this.main.prosBox, {
			// 	scaleX: 1.2,
			// 	scaleY: 1.2
			// }, 100, Laya.Ease.linearInOut, 0);
			// timePlay.to(this.main.prosBox, {
			// 	scaleX: 1,
			// 	scaleY: 1
			// }, 100, Laya.Ease.linearInOut, 0);
			// timePlay.play(0, false);
			//添加红色字体
			let txtTip: any = new Laya.Text();
			txtTip.text = `-${new FormatNumber(gone.sh).formatPointNumber()}`;
			txtTip.color = '#e81313';
			txtTip.fontSize = 80;
			txtTip.bolb = true;
			txtTip.pos((178 * scX - txtTip.width) / 2, (239 * scX - txtTip.height) / 2.5);
			Laya.Tween.to(txtTip, {
				y: txtTip.y - 50 * scX, alpha: .1, update: Laya.Handler.create(this, e => {
				})
			}, 500, Laya.Ease.circInOut, Laya.Handler.create(this, e => {
				txtTip.removeSelf();
			}), 200)
			txtTip.zOrder = 1;
			this.main.role.addChild(txtTip);
			//播放被击打
			this.playSp((178 * scX - 159 * scX) / 2 + 178 * scX / 2, (239 * scX - 159 * scX) / 2.3);
			//具体击打操作
			config.userNowHp -= gone.sh;
			if (config.nowLevel > config.passLevel && !config.passOk) {
				config.passOk = true;
				this.conPass();
				config.passLevel++;
			}
			if (config.userNowHp <= 0) {
				config.userNowHp = 0; //请求接口进入下一关
				config.nowLevel++;
				this.main.setRoleImg(config.nowLevel);
				this.main.leftTopImg(parseInt(config.nowLevel) + 1);
				if (!config.passOk) {
					this.conPass();
					config.passLevel++;
				}
				config.passOk = true;
				this.main.setLevel(config.nowLevel);
				if (config.nowLevel > 4) {
					config.userHp = config.bossHpArr[config.bossHpArr.length - 1] + 100 * (config.nowLevel - 1);
					config.userNowHp = config.bossHpArr[config.bossHpArr.length - 1] + 100 * (config.nowLevel - 1);
				} else {
					config.userHp = config.bossHpArr[config.nowLevel];
					config.userNowHp = config.bossHpArr[config.nowLevel];
				}
			}
			this.main.setProsPos();
		});
		timePlay.play(0, false);
		gone.addChild(zd);
	}
	//添加打击特效
	private playSp(x: number, y: number): void {
		let scX: number = Laya.Browser.window.scX;
		let sp: Laya.Sprite = this.getImage(`zhuye/bolb.png`, 159 * scX, 159 * scX, x, y);
		sp.pivot(sp.width / 2, sp.height / 2);
		setTimeout(() => {
			sp.removeSelf();
		}, 300);
		this.main.role.addChild(sp);
	}
	//使用锤子，锤子需要控制周围没有的
	public usePercussion(index: number): void {
		//如果第二次的index还是第一次，那么进行消除
		this.clearAnimationAll();
		if (this.doubleIndex == index) {
			new SoundManager('shengyin/zhadan.mp3', false, 1);
			this.commStar = [];
			this.commStar.push(index);
			this.clearStar([index], index, true);
			if (Laya.stage.getChildByName('percussion') != null) Laya.stage.removeChildByName('percussion');
			this.useCZ = false; //消除设置为false
			this.useCZOk = true;
			this.doubleIndex = -1;
			return;
		}
		this.doubleIndex = index; //赋值index
		let scX: number = Laya.Browser.window.scX;
		if (Laya.stage.getChildByName('percussion') != null) Laya.stage.removeChildByName('percussion');
		let targetRole: any;
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			Laya.Tween.clearTween(this.roleBox._children[i]);
			if (this.roleBox._children[i].index == index) {
				targetRole = this.roleBox._children[i];
			}
		}
		if (targetRole == undefined || targetRole == null) { let rnd: number = this.randomNum(0, this.roleBox._children.length - 1); targetRole = this.roleBox.getChildAt(rnd); this.doubleIndex = targetRole.index; index = targetRole.index; }
		this.scaleAnimation(targetRole);
		let position: any = this.getPos(index);
		let czAnim: Laya.Animation = new Laya.Animation();
		czAnim.name = 'percussion';
		czAnim.interval = 200;
		//监听播放完成动画
		czAnim.on(Laya.Event.COMPLETE, this, function () {
		});
		//播放某个动画
		czAnim.play(0, true, `percussion`);
		let boundes: any = czAnim.getBounds();
		czAnim.pos(this.roleBox.x + targetRole.x + (targetRole.width - boundes.width) / 2 - targetRole.width / 2, this.roleBox.y + targetRole.y + (targetRole.height - boundes.height) / 2 - targetRole.height * 1.25);
		Laya.stage.addChild(czAnim);
	}
	//返回周围没有元素的组
	private noClear(): Array<any> {
		let noArr: Array<any> = [];
		let roleIndex: number = 0;
		for (let i: number = 0; i < this.row; ++i) {
			for (let j: number = 0; j < this.clos; ++j) {
				if (this.starArr[i][j] != 0) {
					if (i - 1 > 0 && i + 1 < this.row && j - 1 > 0 && j < this.clos) {
						if (this.starArr[i][j] != this.starArr[i + 1][j] && this.starArr[i + 1][j] != 0 && this.starArr[i][j] != this.starArr[i][j + 1] && this.starArr[i][j + 1] != 0 && this.starArr[i][j] != this.starArr[i][j - 1] && this.starArr[i][j - 1] != 0 && this.starArr[i][j] != this.starArr[i - 1][j] && this.starArr[i - 1][j] != 0)
							noArr.push(roleIndex);
					} else if (i == 0 && j == 0) {
						if (this.starArr[i][j] != this.starArr[i + 1][j] && this.starArr[i + 1][j] != 0 && this.starArr[i][j] != this.starArr[i][j + 1] && this.starArr[i][j + 1] != 0)
							noArr.push(roleIndex);
					} else if (i == 0 && j == this.clos - 1) {
						if (this.starArr[i][j] != this.starArr[i + 1][j] && this.starArr[i + 1][j] != 0 && this.starArr[i][j] != this.starArr[i][j - 1] && this.starArr[i][j - 1] != 0)
							noArr.push(roleIndex);
					} else if (i == this.row - 1 && j == 0) {
						if (this.starArr[i][j] != this.starArr[i - 1][j] && this.starArr[i - 1][j] != 0 && this.starArr[i][j] != this.starArr[i][j + 1] && this.starArr[i][j + 1] != 0)
							noArr.push(roleIndex);
					} else if (i == this.row - 1 && j == this.clos - 1) {
						if (this.starArr[i][j] != this.starArr[i - 1][j] && this.starArr[i - 1][j] != 0 && this.starArr[i][j] != this.starArr[i][j - 1] && this.starArr[i][j - 1] != 0)
							noArr.push(roleIndex);
					} else if (i + 1 >= this.row) {
						if (this.starArr[i][j] != this.starArr[i - 1][j] && this.starArr[i - 1][j] != 0 && this.starArr[i][j] != this.starArr[i][j + 1] && this.starArr[i][j + 1] != 0 && this.starArr[i][j] != this.starArr[i][j - 1] && this.starArr[i][j - 1] != 0)
							noArr.push(roleIndex);
					} else if (i - 1 <= 0) {
						if (this.starArr[i][j] != this.starArr[i + 1][j] && this.starArr[i + 1][j] != 0 && this.starArr[i][j] != this.starArr[i][j + 1] && this.starArr[i][j + 1] != 0 && this.starArr[i][j] != this.starArr[i][j - 1] && this.starArr[i][j - 1] != 0)
							noArr.push(roleIndex);
					} else if (j + 1 >= this.clos) {
						if (this.starArr[i][j] != this.starArr[i - 1][j] && this.starArr[i - 1][j] != 0 && this.starArr[i][j] != this.starArr[i][j - 1] && this.starArr[i][j - 1] != 0 && this.starArr[i][j] != this.starArr[i + 1][j] && this.starArr[i + 1][j] != 0)
							noArr.push(roleIndex);
					} else if (j - 1 <= 0) {
						if (this.starArr[i][j] != this.starArr[i - 1][j] && this.starArr[i - 1][j] != 0 && this.starArr[i][j] != this.starArr[i][j + 1] && this.starArr[i][j + 1] != 0 && this.starArr[i][j] != this.starArr[i + 1][j] && this.starArr[i + 1][j] != 0)
							noArr.push(roleIndex);
					}
				}
				roleIndex++;
			}
		}
		return noArr;
	}
	//存档操作
	public saveUserInfo(): void {
		let saveArr: Array<any> = this.flatten(this.starArr); //转为以为数组存储
		//发送服务器存储
		let saveObject: any = {};
		saveObject.value = saveArr;
		saveObject.prop = config.prop;
		saveObject.maxResult = config.passLevel;
		saveObject.result = config.userHp;
		saveObject.surplusResult = config.userNowHp;
		saveObject.checkpoint = config.nowLevel;
		saveObject.showTxt = this.showTxt;
		//本地也进行存档操作，以便于返回首页使用
		config.saveLevelInfo={};
		config.saveLevelInfo.value = saveArr;
		config.saveLevelInfo.checkpoint = config.nowLevel;
		config.saveLevelInfo.result = config.userHp;
		config.saveLevelInfo.surplusResult = config.userNowHp;
		config.saveLevelInfo.maxResult = config.passLevel;
		config.saveLevelInfo.prop = config.prop;
		config.saveLevelInfo.showTxt = this.showTxt;
		//上线打开这个接口
		new GetData(`/EatChicken/user/keepGame.action?value=${encodeURI(JSON.stringify(saveObject))}`, 'get', {}, config.cookie, (data) => {
		});
	}
	//恭喜过关操作
	public conPass(): void {
		this.main.setPassOk(true);
		let passPopup: any = new PopupManager();
		passPopup.pass((data: any) => {
			if (data == 1) {
				//增加道具
				passPopup.getGiftCode('gcz', 1, this.main);
				passPopup.getGiftCode('greset', 1, this.main);
				passPopup.getGiftCode('glx', 1, this.main);
				passPopup.getGiftCode('gsz', 1, this.main);
			}
		})
		Laya.stage.addChild(passPopup);

		if (Laya.Browser.onMiniGame) {
			let openDataContext: any = Laya.Browser.window.wx.getOpenDataContext();
			openDataContext.postMessage({ action: 'set', score: config.nowLevel });//存储关卡以及分数
		}
		//存储
		new GetData(`/EatChicken/user/gameOver.action?maxResult=${config.userHp - config.userNowHp}&checkpoint=${config.nowLevel}`, 'get', {}, config.cookie, (data): void => {
		});
		// new SoundManager('shengyin/shengli.mp3', false, 1);
		// this.showTxt = true;
		// if (Laya.stage.getChildByName(`pass`) != null) Laya.stage.removeChild(Laya.stage.getChildByName(`pass`));
		// let scX: number = Laya.Browser.window.scX;
		// let passBox: Laya.Sprite = new Laya.Sprite();
		// passBox.pos((Laya.stage.width - 193 * scX) / 2, Laya.stage.height);
		// let sp: Laya.Sprite = this.getImage(`zhuye/pass.png`, 193 * scX, 44 * scX, 0, 0);
		// sp.zOrder = 1;
		// passBox.alpha = 0;
		// passBox.name = 'pass';
		// //旋转光效
		// passBox.addChild(sp)
		// let light: Laya.Sprite = this.getImage(`zhuye/xzlight.png`, 100 * scX, 97 * scX, 0, 0);
		// light.pivot(light.width / 2, light.height / 2);
		// light.pos(193* scX / 2, 44 * scX / 2);
		// light.alpha = 0;
		// passBox.addChild(light)
		// //使用tween
		// Laya.Tween.to(passBox, {
		// 	y: (Laya.stage.height - 44 * scX) / 2,
		// 	alpha: 1
		// }, 500, Laya.Ease.linearInOut, Laya.Handler.create(this, e => {

		// }), 0);
		// Laya.Tween.to(passBox, {
		// 	y: 140 * Laya.Browser.window.scY,
		// 	x: Laya.stage.width - sp.width
		// }, 500, Laya.Ease.linearInOut, Laya.Handler.create(this, e => {
		// 	light.alpha = 1;
		// }), 2500);
		// let timeRo: any = new Laya.TimeLine();
		// timeRo.to(light, {
		// 	rotation: 360
		// }, 3500, Laya.Ease.linearInOut, 0);
		// passBox.zOrder = 2;
		// timeRo.play(0, true);
		// Laya.stage.addChild(passBox);
	}
	//流星粒子
	private sendParticle(x: number, y: number, ex: number, ey: number, index: number, len: number, callBack: any = null): void {
		let lz: any = this.prBox.getChildAt(index);
		//更正圆心
		let cirx: number = x;
		let ciry: number = y;
		let enx: number = ex - cirx;  //正正的x
		let eny: number = ciry - ey; //正正的y
		lz.pos(x, y);
		lz.rotation = this.countAngle([enx, eny]);  //旋转角度
		lz.visible = true;
		let inv: number = 500;
		let timeTween: any = new Laya.TimeLine();
		timeTween.to(lz, {
			x: ex,
			y: ey
		}, inv, Laya.Ease.linearInOut, 0);
		timeTween.on(Laya.Event.COMPLETE, this, e => {
			lz.visible = false;
			if (callBack != null) callBack();
		});
		timeTween.play(0, false);
		new SoundManager('shengyin/qiu.mp3', false, 1);
	}
	//添加五个元素
	private addParBox(): void {
		this.prBox = new Laya.Sprite();
		for (let i: number = 0; i < 5; ++i) {
			// 测试粒子
			let scX: number = Laya.Browser.window.scX;
			let starBox: Laya.Sprite = new Laya.Sprite();
			let starPr: Laya.Sprite = new Laya.Sprite();
			starPr.width = 39 * scX;
			starPr.height = 40 * scX;
			starPr.graphics.drawTexture(Laya.loader.getRes('zhuye/starfg.png'), 0, 0, 39 * scX, 40 * scX);
			starPr.pivot(starPr.width / 2, starPr.height / 2);
			starPr.pos(starPr.width / 2, starPr.height / 2);
			let starTween: any = new Laya.TimeLine();
			starTween.to(starPr, {
				rotation: 3600,
			}, 10000, Laya.Ease.linearInOut, 0);
			starTween.play(0, true);
			let prBox: Laya.Sprite = new Laya.Sprite();
			let parSetting: Laya.ParticleSetting = new Laya.ParticleSetting();
			var particle: Laya.Particle2D = new Laya.Particle2D(parSetting);
			particle.pos(starPr.width / 4, starPr.height / 4);
			particle.url = 'starPr.part';
			// particle.load('starPr.part');
			particle.play();
			particle.pos(starPr.width, starPr.height / 2);
			particle.emitter.emit();
			var particle1: Laya.Particle2D = new Laya.Particle2D(parSetting);
			particle1.pos(starPr.width / 4, starPr.height / 4);
			particle1.url = 'starPr.part';
			// particle.load('starPr.part');
			particle1.play();
			particle1.pos(starPr.width, starPr.height / 2);
			particle1.emitter.emit();
			var particle2: Laya.Particle2D = new Laya.Particle2D(parSetting);
			particle2.pos(starPr.width / 4, starPr.height / 4);
			particle2.url = 'starPr.part';
			// particle.load('starPr.part');
			particle2.play();
			particle2.pos(starPr.width, starPr.height / 2);
			particle2.emitter.emit();
			// setTimeout(function(){
			// 	particle.emitter.emit();
			// 	particle1.emitter.emit();
			// 	particle2.emitter.emit();
			//   },200)
			//需要根据x,y,ex,ey去计算角度
			starBox.addChild(starPr);
			starBox.addChild(particle);
			starBox.addChild(particle1);
			starBox.addChild(particle2);
			starBox.width = 40 * scX;
			starBox.height = 40 * scX;
			starBox.pivot(starBox.width / 2, starBox.height / 2);
			starBox.pos(0, 0);
			starBox.visible = false;
			this.prBox.addChild(starBox);
		}
		this.prBox.zOrder = 5;
		//回到主页需要干掉
		Laya.stage.addChild(this.prBox);
	}
	//计算角度
	private countAngle(parms: Array<any>) {
		// let position:Array<any>=[...parms];
		let _x: number = parms[0];
		let _y: number = parms[1];
		return 360 * Math.atan(_x / _y) / (2 * Math.PI);
	}
	//结算操作
	private accountGame(type: boolean = true): void {
		this.account = true;
		this.aliveOk = type;  //是否复活
		//直接结算
		this.clearAnimationAll(); //清除所有动画
		if (!type) config.gameOver = true;
		//循环查询最后剩余的
		let endArr: Array<any> = [];
		//循环查询最后剩余的
		for (let i: number = 0; i < this.row; ++i) {  //这里根据最大的来循环最后剩余的
			for (let j: number = 0; j < this.row; ++j) {
				if (this.starArr[j][i] != undefined && this.starArr[j][i] != 0) { //j，i
					endArr.push(this.starIndexArr[j][i]);
				}
			}
		}
		this.endLen = endArr.length; //最后剩余长度
		let aniLen: number = 0;
		if (this.endLen == 0) {
			// this.addTxtTip('BOSS血量额外减少：' + this.accountScore, true);
			this.setAccountData(this.aliveOk, 0);
			return;
		}
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			let overTime: any = new Laya.TimeLine();
			overTime.to(this.roleBox._children[i], {
				alpha: .1
			}, 500, Laya.Ease.linearInOut, 0);
			overTime.to(this.roleBox._children[i], {
				alpha: 1
			}, 500, Laya.Ease.linearInOut, 0);
			overTime.to(this.roleBox._children[i], {
				alpha: .1
			}, 500, Laya.Ease.linearInOut, 0);
			overTime.to(this.roleBox._children[i], {
				alpha: 1
			}, 500, Laya.Ease.linearInOut, 0);
			overTime.on(Laya.Event.COMPLETE, this, e => {
				aniLen++;
				//动画执行完毕
				if (aniLen == this.roleBox._children.length) {
					//执行碎裂动画
					for (let j: number = 0; j < endArr.length; ++j) {
						for (let k: number = 0; k < this.roleBox._children.length; ++k) {
							if (endArr[j] == this.roleBox._children[k].index) {
								this.accountScore -= 200;
								if (this.accountScore <= 0) this.accountScore = 0;
								if (j < 10) {
									//闭包处理
									((tipScore: number) => {
										setTimeout(() => {
											this.clearStar([endArr[j]], endArr[j], true);
											// this.addTxtTip('BOSS血量额外减少：' + tipScore, true);
										}, j * 300);
									})(this.accountScore)
								} else {
									((tipScore: number) => {
										setTimeout(() => {
											this.clearStar([endArr[j]], endArr[j], true);
											// this.addTxtTip('BOSS血量额外减少：' + tipScore, true);
										}, 10 * 300);
									})(this.accountScore)
								}
								continue;
							}
						}

					}
				}
			});
			overTime.play(0, false);
		}
		//结算
		// this.addTxtTip('BOSS血量额外减少：' + this.accountScore, true);
	}
	//添加文字提示
	private addTxtTip(txt: string, account: boolean = false): void {
		if (account) {
			if (Laya.stage.getChildByName('tipNum1') != null) {
				let tipNum: any = Laya.stage.getChildByName('tipNum1');
				tipNum.text = `${txt}`;
			} else {
				let tipNum: Laya.Text = new Laya.Text();
				tipNum.text = `${txt}`;
				tipNum.name = 'tipNum1';
				tipNum.fontSize = 32 * Laya.Browser.window.scX;
				// tipNum.font = 'whiteFont';
				tipNum.pos((Laya.stage.width - tipNum.width) / 2, (Laya.stage.height - tipNum.height) / 2);
				tipNum.zOrder = 1;
				Laya.stage.addChild(tipNum);
			}
		} else {
			let tipNum: Laya.Text = new Laya.Text();
			tipNum.text = `${txt}`;
			tipNum.name = 'tipNum';
			tipNum.fontSize = 32 * Laya.Browser.window.scX;
			// tipNum.font = 'whiteFont';
			tipNum.pos(-tipNum.width, (Laya.stage.height - tipNum.height) / 2);
			tipNum.zOrder = 1;
			let tipNumTime: any = new Laya.TimeLine();
			tipNumTime.to(tipNum, {
				x: (Laya.stage.width - tipNum.width) / 2,
				alpha: 1
			}, 300, Laya.Ease.linearInOut, 0);
			tipNumTime.to(tipNum, {
			}, 1500, 0);
			tipNumTime.to(tipNum, {
				x: Laya.stage.width + tipNum.width,
				alpha: 0
			}, 300, Laya.Ease.linearInOut, 0);
			tipNumTime.on(Laya.Event.COMPLETE, this, e => {
				tipNum.removeSelf();
			});
			tipNumTime.play(0, false);
			Laya.stage.addChild(tipNum);
		}
	}
}