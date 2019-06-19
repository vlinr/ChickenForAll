export default class AllTip extends Laya.Sprite{
    constructor(txt:string){
        super();
        this.allPopop(txt);
    }
   allPopop(txt:string):void{
        let txtSprite:Laya.Sprite=new Laya.Sprite();
        txtSprite.width=212*Laya.Browser.window.scX;
        let txtShow:Laya.Text=new Laya.Text();
        txtShow.text=txt;
        txtShow.color='#fff';
        txtShow.fontSize=28*Laya.Browser.window.scX;
        txtShow.width=txtSprite.width-20*Laya.Browser.window.scX;
        txtShow.align='center';
        txtShow.wordWrap=true;
        txtSprite.height=txtShow.height+50*Laya.Browser.window.scX;
        txtSprite.graphics.drawTexture(Laya.loader.getRes('tupian/opacity.png'), 0, 0, txtSprite.width, txtSprite.height);
        txtShow.x=(txtSprite.width-txtShow.width)/2;
        txtShow.y=(txtSprite.height-txtShow.height)/2;
        txtSprite.addChild(txtShow);
        txtSprite.alpha=0;
        txtSprite.scaleX=0;
        txtSprite.scaleY=0;
        txtSprite.pivot(txtSprite.width/2,txtSprite.height/2);
        txtSprite.x=(Laya.stage.width)/2;
        txtSprite.y=(Laya.stage.height)/2;
        let timeLineTxt:Laya.TimeLine=new Laya.TimeLine();
        timeLineTxt.to(txtSprite, {
            alpha:1,
            scaleX:1,
            scaleY:1
        }, 500, Laya.Ease.elasticInOut, 0);
        timeLineTxt.to(txtSprite, {
            alpha:1,
            scaleX:1,
            scaleY:1
        }, 1000, Laya.Ease.elasticInOut, 0);
        timeLineTxt.to(txtSprite, {
            y:-Laya.stage.height
        }, 500, Laya.Ease.linearOut, 0);
        timeLineTxt.on(Laya.Event.COMPLETE,this,():void=>{
            Laya.Pool.recover('popupAll', AllTip);
            this.removeSelf();
        })
        timeLineTxt.play(0,false);
        this.addChild(txtSprite);
        this.zOrder=10;
        Laya.stage.addChild(this);
    }
}