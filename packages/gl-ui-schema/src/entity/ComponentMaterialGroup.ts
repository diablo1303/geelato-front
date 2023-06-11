/**
 *  组件物料组
 */
import type ComponentMaterial from "./ComponentMaterial";

export default class ComponentMaterialGroup {

    name:string = 'default'

    text:string = '默认'

    // 展开状态
    opened:boolean = true;

    items?:Array<ComponentMaterial> = []

    constructor() {
    }
}