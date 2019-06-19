
export default class GetCookieApache {
    private data;
    constructor(data) {
        this.data=data;
    }
    getCookie():any{
        if (JSON.stringify(this.data.header).split('JSESSIONID')[1] != undefined) {
            return JSON.stringify(this.data.header).split('JSESSIONID')[1].split(';')[0].split('=')[1]
        }
        return null;
    }
}