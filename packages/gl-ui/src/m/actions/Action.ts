import type ActionParam from "./ActionParam";

export default class Action {
    name: string
    params: Array<ActionParam>

    constructor(name: string, params: Array<ActionParam>) {
        this.name = name
        this.params = params || []
    }
}
