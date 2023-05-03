import type {App, Plugin} from 'vue'
import ComponentMeta from "./entity/ComponentMeta";
import ComponentInstance from "./entity/ComponentInstance";
import BlockInstance from "./entity/actions/BlockInstance";
import ComponentMaterial from "./entity/ComponentMaterial";
import ComponentMaterialGroup from "./entity/ComponentMaterialGroup";
import {PropertySetterMetaImpl} from "./entity/IPropertySetterMeta";
import type IPropertySetterMeta from "./entity/IPropertySetterMeta";
import {ComponentSetterMetaImpl} from "./entity/ComponentSetterMeta";
import {PropertySetterBuilderMeta, PropertySetterSelectOption} from "./entity/PropertySetterBuilderMeta";
import type IActionSetterMeta from "./entity/actions/ActionSetterMeta";
import {ActionSetterMeta} from "./entity/actions/ActionSetterMeta";
import {schema} from "./components/schema";
import Action from './entity/actions/Action';
const component: Plugin = {
    install: function (app: App) {
        console.log('gl-ui-schema > install()', app)
    }
}
export {
    schema,
    BlockInstance,
    ComponentMaterial,
    ComponentMaterialGroup,
    ComponentMeta,
    ComponentInstance,
    ComponentSetterMetaImpl,
    IPropertySetterMeta,
    PropertySetterMetaImpl,
    IActionSetterMeta,
    ActionSetterMeta,
    PropertySetterBuilderMeta,
    PropertySetterSelectOption,
    Action
}
// 默认导出组件
export default component
