export default class GetJSON {
    constructor() {
    }
    getJson(data):any{
        return data == null || data == undefined || typeof (data) != 'string' ? {} : JSON.parse(JSON.parse(JSON.stringify(data)).toString());
    }
}