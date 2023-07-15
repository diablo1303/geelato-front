import {utils} from "@geelato/gl-ui";

export default class App {
    id: string = '' // utils.gid('app', 32)
    name: string = '' // utils.gid('app', 20)
    code: string = '' // utils.gid('app', 20)
    tenantCode: string = ''
    icon: string = ''
    key?: string
    token?: string
    tree: string = ''
    logo: string = ''
    theme: string = ''
    href: string = ''
    description?: string
    watermark: number = 0

    constructor() {
    }
}
