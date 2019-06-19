export default class BtnAnimation {
    private role: any;
    private callback: Function;
    private loop: boolean = false;
    constructor(role: any, callback: Function, loop: boolean = false) {
        this.role = role;
        this.callback = callback;
        this.loop = loop;
        // this.init();
    }
    public jelly(): void {
        let self: any = this;
        let times: Laya.TimeLine = new Laya.TimeLine();
        times.to(this.role, {
            scaleX: 1.2,
            scaleY: 1.2
        }, 150, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1,
            scaleY: 1.1
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1,
            scaleY: 1
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1.1,
            scaleY: 1
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1,
            scaleY: 1
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1,
            scaleY: 1.05
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1,
            scaleY: 1
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1.05,
            scaleY: 1
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1,
            scaleY: 1
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1,
            scaleY: 1.01
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1,
            scaleY: 1
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1.01,
            scaleY: 1
        }, 25, Laya.Ease.elasticInOut, 0);
        times.to(this.role, {
            scaleX: 1,
            scaleY: 1
        }, 25, Laya.Ease.elasticInOut, 0);
        if (this.loop) {
            times.to(this.role, {
                scaleX: 1,
                scaleY: 1
            }, 3000, Laya.Ease.elasticInOut, 0);
            times.play(0, true);
        } else {
            times.on(Laya.Event.COMPLETE, this, function () {
                self.callback();
            });
            times.play(0, false);
        }
    }
    public zoom():void{
        let btnScale: any = new Laya.TimeLine();
        btnScale.to(this.role, {
            scaleX: 1.1,
            scaleY: 1.1
        }, 1000, Laya.Ease.linearInOut, 0);
        btnScale.to(this.role, {
            scaleX: 1,
            scaleY: 1
        }, 1000, Laya.Ease.linearInOut, 0);
        btnScale.play(0, this.loop); 
    }
}