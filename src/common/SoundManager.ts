export default class SoundManager{
    private url:any;
    private isBgMusic:boolean
    private soundNum:number;
    constructor(url:any,isBgMusic:boolean,soundNum:number){
        this.url=url;
        this.isBgMusic=isBgMusic;
        this.soundNum=soundNum;
        this._playSound();
    }
    _playSound():void{
        if(this.isBgMusic){
            //背景音乐
            Laya.SoundManager.playMusic(this.url,0);
            if(Laya.Browser.onMiniGame){
                let wx:any=Laya.Browser.window.wx;
                wx.bgMusicUrl=this.url;
                wx.onHide(()=>{
                    Laya.SoundManager.destroySound(wx.bgMusicUrl);
                })
                wx.onShow(()=>{
                    Laya.SoundManager.playMusic(wx.bgMusicUrl,0);
                });
            }
        }else{
            Laya.SoundManager.playSound(this.url,1,Laya.Handler.create(this,():void=>{
                //销毁
                Laya.SoundManager.destroySound(this.url);
            }));
        }
        Laya.SoundManager.setMusicVolume(this.soundNum);
    }
}