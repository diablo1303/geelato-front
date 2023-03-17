import type {App, Plugin} from 'vue'

export {default as ButtonMeta} from "./components/setter/button/ButtonMeta";
export {default as RateMeta} from "./components/setter/rate/RateMeta";
export {default as SwitchMeta} from "./components/setter/switch/SwitchMeta";
export {default as AutoCompleteMeta} from "./components/setter/autoComplete/AutoCompleteMeta";
export {default as DividerMeta} from './components/setter/divider/DividerMeta'
export {default as InputMeta} from "./components/setter/input/InputMeta";
export {default as InputNumberMeta} from "./components/setter/inputNumber/InputNumberMeta";
export {default as TableMeta} from "./components/setter/table/TableMeta";
export {default as FormRowMeta} from "./components/setter/layout/FormRowMeta";

import {useComponentMaterialStore} from "./store/UseComponentMaterialStore";

const component: Plugin = {
    // @ts-ignore
    install: function (app: App) {
        console.log('gl-ui-schema-arco > install()')
    }
}

export { useComponentMaterialStore}
// 默认导出组件
export default component
