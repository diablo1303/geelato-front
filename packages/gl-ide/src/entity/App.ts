import {utils} from "@geelato/gl-ui";

export default class App {
    id: String = utils.gid('app', 32)
    name: String = utils.gid('app', 16)
    code: String = utils.gid('app', 16)
    icon: String = ''
    key?: String
    token?: String
    tree: String = ''
    logo: String = ''
    theme: String = ''
    href: String = ''
    description?: String
    watermark: number = 0

    constructor() {
    }
}
