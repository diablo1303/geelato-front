import type {App, Plugin} from 'vue'

export {default as ButtonMeta} from "./components/setter-arco/button/ButtonMeta";
export {default as RateMeta} from "./components/setter-arco/rate/RateMeta";
export {default as SwitchMeta} from "./components/setter-arco/switch/SwitchMeta";
export {default as AutoCompleteMeta} from "./components/setter-arco/autoComplete/AutoCompleteMeta";
export {default as DividerMeta} from './components/setter-arco/divider/DividerMeta'
export {default as InputMeta} from "./components/setter-arco/input/InputMeta";
export {default as InputNumberMeta} from "./components/setter-arco/inputNumber/InputNumberMeta";
export {default as TableMeta} from "./components/setter-arco/table/TableMeta";
export {default as FormRowMeta} from "./components/setter-arco/layout/FormRowMeta";
export {default as DatePickerMeta} from "./components/setter-arco/datePicker/DatePickerMeta"
export {default as TimelineMeta} from "./components/setter-arco/timeLine/TimelineMeta"
export {default as TimelineItemMeta} from "./components/setter-arco/timeLine/TimelineItemMeta"
export {default as BlockNotificationMeta} from "./components/setter-block/notification/BlockNotificationMeta";
export {default as BlockOpenThirdPageMeta} from "./components/setter-block/page/BlockOpenThirdPageMeta";
import {useComponentMaterialStore} from "./store/UseComponentMaterialStore";
import {schemaBlock} from "./components/schemaBlock";
import {schemaArco} from "./components/schemaArco";
const component: Plugin = {
    // @ts-ignore
    install: function (app: App) {
        console.log('gl-ui-schema-arco > install()')
    }
}

export {useComponentMaterialStore,schemaBlock,schemaArco}
// 默认导出组件
export default component
