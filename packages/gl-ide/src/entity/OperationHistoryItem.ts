export default class OperationHistoryItem {

    private _createAt: string = ''

    private _type: string = ''
    // 配置的json字符串
    private _json: string = ''

    /**
     *
     * @param type GlPage、ComponentTree
     * @param jsonObj
     */
    constructor(type: string = 'ComponentTree', jsonObj: Object = {}) {
        this._createAt = this.dateFormat('YYYY-mm-dd HH:MM', new Date())
        this._json = JSON.stringify(jsonObj)
        this._type = type
    }


    get createAt(): string {
        return this._createAt;
    }


    get type(): string {
        return this._type;
    }

    get json(): string {
        return this._json;
    }

    dateFormat(fmt: string, date: Date) {
        let ret;
        const opt: any = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
        }
        return fmt;
    }
}
