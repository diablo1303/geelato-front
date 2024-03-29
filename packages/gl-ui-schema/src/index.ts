// import type {App, Plugin} from 'vue'
import ComponentMeta, { InnerComponentPosition } from "./entity/ComponentMeta";
import ComponentInstance from "./entity/ComponentInstance";
import {I18nItem} from "./entity/ComponentInstance";
import BlockInstance from "./entity/actions/BlockInstance";
import ComponentMaterial from "./entity/ComponentMaterial";
import ComponentMaterialGroup from "./entity/ComponentMaterialGroup";
import {PropertySetterMetaImpl} from "./entity/IPropertySetterMeta";
import type IPropertySetterMeta from "./entity/IPropertySetterMeta";
import {ComponentSetterMetaImpl} from "./entity/ComponentSetterMeta";
import {PropertySetterBuilderMeta, PropertySetterSelectOption} from "./entity/PropertySetterBuilderMeta";
import {ActionSetterMeta} from "./entity/actions/ActionSetterMeta";
import {MethodSetterMeta, ReturnInfoMeta} from "./entity/methods/MethodSetterMeta";
import {schema} from "./components/schema";
import Action, {ActionMeta, MethodMeta, ParamMeta} from './entity/actions/Action';
import BlockMetaGroup from './entity/actions/BlockMetaGroup';
import {useValueTypeOptions, ValueTypes} from './entity/methods/ValueTypes';
import BindField from './entity/model/BindField';

// const component: Plugin = {
//     install: function (app: App) {
//         console.log('gl-ui-schema > install()', app)
//     }
// }
export {
    schema,
    BlockInstance,
    BlockMetaGroup,
    ComponentMaterial,
    ComponentMaterialGroup,
    InnerComponentPosition,
    ComponentMeta,
    ComponentInstance,
    I18nItem,
    ComponentSetterMetaImpl,
    IPropertySetterMeta,
    PropertySetterMetaImpl,
    ActionSetterMeta,
    ReturnInfoMeta,
    MethodSetterMeta,
    ValueTypes,
    useValueTypeOptions,
    PropertySetterBuilderMeta,
    PropertySetterSelectOption,
    Action,
    ParamMeta,
    ActionMeta,
    MethodMeta,
    BindField
}
// 默认导出组件
export default {
    install: () => {
    }
}
