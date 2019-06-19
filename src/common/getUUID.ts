export default class GetUUID{
    constructor(){
    }
    private getGuid():any{
        return (this._getUUID() + this._getUUID() + "-" + this._getUUID() + "-" + this._getUUID() + "-" + this._getUUID() + "-" + this._getUUID() + this._getUUID() + this._getUUID()).toUpperCase();
    }
    private _getUUID():any{
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
}
//获取uuid