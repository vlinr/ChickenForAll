import config from "../config/config";

export default class Share{
    private share:any = null;
    private imgIndex:number = 0; private shareTxt:string = '';
    constructor(index:number,shareTxt:string) {
      //创建canvas，转发的canvas,并且添加图片
      this.share = Laya.Browser.window.wx.createCanvas()
      this.share.width = 400;
      this.share.height = 320;
      //随机图片和文字
      this.imgIndex = index;
      let ctx:any = this.share.getContext('2d');
      //生产图片
      let images:any = Laya.Browser.window.wx.createImage();
      //获取随机图片
      this.shareTxt =shareTxt;
      images.src = `jiazai/share${this.imgIndex}.jpg`;  //分享的图片
      images.onload = () => {
        ctx.drawImage(images, 0, 0);
      }
    }
    filePath(obj:any):any {
      return obj.toTempFilePathSync({ //小游戏转发的img 最佳比例 5：4
        width: 400,
        height: 320,
        destWidth: 400,
        destHeight: 320,
        x: 0,
        y: 0
      })
    }
    //主动转发有图
    passiveShare(shareType:any, pages:any):void {
      //转发小游戏
      Laya.Browser.window.wx.showShareMenu({ //显示转发按钮
        withShareTicket: true
      });
      Laya.Browser.window.wx.onShareAppMessage(this.shareAll(this, 1, this.shareTxt, shareType,1,'no'));
      Laya.Browser.window.wx.updateShareMenu({
        withShareTicket: true
      });
    }
    shareAll(self:any, active:any, txt:any, shareType:any=null, pages:any=null, userBtn:any=null) {
      let uPages:any=pages;
      if (active == 1) {
        return () => {
          return {
            title: self.shareTxt,
            imageUrl: self.filePath(self.share),
            query: 'fromChannel=btnShare&upUserInfoId=' + Laya.Browser.window.wx.userId
          }
        }
      }
      else {
        return {  //被动分享
          title: self.shareTxt,
          imageUrl: `jiazai/share${self.imgIndex}.jpg`,
          query: `fromChannel=${uPages}&upUserInfoId=${Laya.Browser.window.wx.userId}&userBtn=${userBtn}`
        }
      }
    }
    activeShare(txt:string, shareType:any=null, pages:any=null, shareGetCar:any=null, userBtn:any=null,callBack:any=null):void {
      this.shareTxt=txt;
      Laya.Browser.window.wx.shareAppMessage(this.shareAll(this, 2, txt, shareType, pages, userBtn));
      if(shareType=='getLevel'){
        config.shareNum++;
        if (config.shareNum == 2) {
          config.shareNum = 0;
          config.shareSuccess = true;
        }
      }
      if(callBack!=null){
        Laya.Browser.window.wx.onShow((data:any)=>{
          let timeDesc:any=new Date().getTime();
          if(timeDesc-Laya.Browser.window.timeDesc>3000){
            callBack(1);
          }else{
            callBack(0);
          }
        });
      }
    }
  }
  