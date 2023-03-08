/**
 *  组件物料组
 */
import type ComponentMaterial from "./ComponentMaterial";

export default class ComponentMaterialGroup {

    name:String = 'default'

    text:String = '默认'

    // 展开状态
    opened:Boolean = true;

    items:Array<ComponentMaterial> = []

    constructor() {
    }
}