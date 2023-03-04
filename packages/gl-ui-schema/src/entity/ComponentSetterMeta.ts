import type PropertySetterMeta from "./PropertySetterMeta";

export default interface ComponentSetterMeta {
    // 注册到全局环境的名称GlButton
    componentName: String,
    // 引用的组件名称，如AButton
    componentRefName: String,
    // 组件分组，用于在组件选择栏目中进行区分，如form、base
    group: String,
    // 使用于哪些类型的页面，如Page、Dbm...，以便于在编辑相应的页面时从sidebar中过滤掉不合适的组件
    useBy: Array<String>,
    // 在属性配置面板中，是以哪种模式来展示属性，值为：Tile|Collapse
    displayMode: String,
    // 属性数组
    properties: Array<PropertySetterMeta>
}

export class ComponentSetterMetaImpl implements ComponentSetterMeta {
    componentName: String = "";
    componentRefName: String = "";
    displayMode: String = "";
    group: String = "";
    properties: Array<PropertySetterMeta> = [];
    useBy: Array<String> = [];
}
