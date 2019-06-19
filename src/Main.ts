import GameConfig from "./GameConfig";
import NewVersion from './common/newVersion'
import config from './config/config'
import Share from './share/Share'
class Main {
	private scene: any;
	constructor() {
		if (Laya.Browser.onMiniGame) {
			new NewVersion();
		}
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
		let _w: number = Laya.Browser.window.innerWidth;
		let _h: number = Laya.Browser.window.innerHeight;
		Laya.Browser.window.scX = _w / 375;
		Laya.Browser.window.scY = _h / 667;
		//重置宽高
		Laya.stage.width = 375 * Laya.Browser.window.scX * 2;
		Laya.stage.height = 667 * Laya.Browser.window.scY * 2;
		Laya.stage.bgColor = '#ffffff';
		Laya.stage.size(Laya.stage.width, Laya.stage.height)
		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;
		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, null));
		var sourceArr: Array<any> = [
			{ url: "MyScene/Load.json", type: Laya.Loader.JSON },
			{ url: 'res/atlas/jiazai.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
			{ url: 'jiazai/startBg.jpg', type: Laya.Loader.IMAGE },
			{ url: 'jiazai/loadActive.png', type: Laya.Loader.IMAGE },
			{ url: 'jiazai/loadActive1.png', type: Laya.Loader.IMAGE },
			{ url: 'jiazai/loadDefault.png', type: Laya.Loader.IMAGE },
			{ url: 'jiazai/logo.png', type: Laya.Loader.IMAGE },
		];
		//加载加载界面资源，防止黑屏
		Laya.loader.load(sourceArr, null, Laya.Handler.create(this, (e: Laya.Event): void => {
			this.onProgress(e);
		}, null, false));
	}
	private onProgress(pros: any): void {
		let nowLoad: number = pros * 100; //根据回调，进行百分比计算
		if (nowLoad == 100) this.onConfigLoaded();  //加载完成后进入加载界面
	}
	onConfigLoaded(): void {
		//加载IDE指定的场景
		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		var bitmapFont: Laya.BitmapFont = new Laya.BitmapFont();
		bitmapFont.loadFont('ziti/loadFont.fnt', new Laya.Handler(this, function () {
			bitmapFont.setSpaceWidth(10);  //设置字体间距
			bitmapFont.letterSpacing = 2;
			bitmapFont.autoScaleSize = true;//自动大小
			Laya.Text.registerBitmapFont('loadFont', bitmapFont);  //注册字体
			//小游戏处理暂停
			if (Laya.Browser.onMiniGame) {
				Laya.Browser.window.wx.onShow(function (e: any) {
					Laya.timer.scale = 1;
					if (e.query.upUserInfoId != null) {
						config.upUserInfoId = e.query.upUserInfoId;
					} else {
						config.upUserInfoId = 0;
					}
				})
				Laya.Browser.window.wx.onHide(function () {
					Laya.timer.scale = 0;
				})
			}
			let scene: Laya.Scene = new Laya.Scene();
			//创建这个场景,分离模式这样使用
			scene.loadScene('MyScene/Load.scene');
			//分离模式
			Laya.stage.addChild(scene);
		}, [bitmapFont]));

		// this.initRoleBox();
	}

}
//激活启动类
new Main();
