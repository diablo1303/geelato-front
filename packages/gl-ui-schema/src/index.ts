import type {App, Plugin} from 'vue'
import ComponentMeta from "./entity/ComponentMeta";
import ComponentInstance from "./entity/ComponentInstance";
import ComponentMaterial from "./entity/ComponentMaterial";
import {PropertySetterMetaImpl} from "./entity/PropertySetterMeta";
import type PropertySetterMeta from "./entity/PropertySetterMeta";
import {ComponentSetterMetaImpl} from "./entity/ComponentSetterMeta";
import {PropertySetterBuilderMeta, PropertySetterSelectOption} from "./entity/PropertySetterBuilderMeta";
import {schema} from "./components/schema";

const component: Plugin = {
    install: function (app: App) {
        console.log('gl-ui-schema > install()', app)
    }
}
export {
    schema,
    ComponentMaterial,
    ComponentMeta,
    ComponentInstance,
    ComponentSetterMetaImpl,
    PropertySetterMeta,
    PropertySetterMetaImpl,
    PropertySetterBuilderMeta,
    PropertySetterSelectOption,
}
// 默认导出组件
export default component
