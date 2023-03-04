import {LooseObject} from "@/m/mix/LooseObject";

export default class ScriptManager {

    private fnMap = new LooseObject()

    constructor(script: string) {
        this.parseScriptText(script)
    }

    /**
     *
     * @param fnScript fnScript的格式有特殊要求，由一到多个方法组成，如：function(a){return a}
     */
    parseScriptText(fnScript: string) {
        this.fnMap = new Function('state', fnScript)()
    }

    invokeFn(fnName: string, params: Array<any>) {
        return this.fnMap[fnName](...params)
    }
}