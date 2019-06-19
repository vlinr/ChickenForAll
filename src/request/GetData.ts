import URL from './url';
export default class GetData{
    private url: any;
    private method: any;
    private data: any;
    private cookie:any;
    private callbackSucc: any;
    private callbackFail: any;
    constructor(url: any, method: any, data: any,cookie:any, callbackSucc: any, callbackFail: any = null) {
        this.url = url; this.method = method; this.data = data;this.cookie=cookie;
        this.callbackSucc = callbackSucc;
        this.callbackFail = callbackFail;
        this._getData();
    }
    _getData() {
        let wx:any=Laya.Browser.window.wx;
        let self:any=this;
        wx.request({
            url: `${URL}${this.url}`, //仅为示例，并非真实的接口地址
            data: self.data,
            method: self.method,
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': `JSESSIONID=${self.cookie}`
            },
            success: function (result) {
              self.callbackSucc(result)  //判断是否是函数，不是函数不向后继续走
            },
            error: (result) => {
                self.callbackFail(result)
            }
          })
        // let httpRequest: any = new Laya.HttpRequest();
        // httpRequest.once(Laya.Event.PROGRESS, this, this._onHttpRequestProgress);
        // httpRequest.once(Laya.Event.COMPLETE, this, this._onHttpRequestComplete);
        // httpRequest.once(Laya.Event.ERROR, this, this._onHttpRequestComplete);
        // if (this.method == 'get') {
        //     //POST请求
        //     httpRequest.send(`${URL}${this.url}`,null, 'get', 'text',[
        //         'content-type', 'application/x-www-form-urlencoded',
        //         'Cookie', `JSESSIONID=${this.cookie}`
        //       ]);
        // } else {
        //     //Get请求
        //     httpRequest.send(`${URL}${this.url}`, this.data, 'post', 'text',[
        //         'content-type', 'application/x-www-form-urlencoded',
        //         'Cookie', `JSESSIONID=${this.cookie}`
        //       ]);
        // }
    }
    //请求进度
    // _onHttpRequestProgress(): void {

    // }
    // _onHttpRequestComplete(data): void {
    //     // console.log(data)
       
    //     this.callbackSucc(JSON.parse(data));
    // }
    // _onHttpRequestError(data): void {
    //     if (this.callbackFail == null) return;
    //     this.callbackFail(data);
    // }
}