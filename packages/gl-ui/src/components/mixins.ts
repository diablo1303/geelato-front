import type {PropType} from "vue";
import {ComponentInstance} from "@geelato/gl-ui-schema";

const props = {
    parentId: {
        type: [String, Number]
    },
    glComponentInst: {
        type: Object as PropType<ComponentInstance>,
        default() {
            return new ComponentInstance()
        }
    },
    glChildren: {
        type: Array as PropType<Array<ComponentInstance>>,
        default() {
            return []
        }
    },
    glCtx: {
        type: Object,
        default() {
            return {}
        }
    },
    /**
     *  是否运行时，用于组件区分是否按设计时进行渲染
     */
    glIsRuntime: {
        type: Boolean,
        default() {
            return true
        }
    },
    /**
     *  如果是runtime，则值为‘Runtime’
     *  该属性和glIsRuntime需对应
     */
    glRuntimeFlag: {
        type: String,
        default() {
            return 'Runtime'
        }
    },
    glIndex: {
        type: Number
    },
    /**
     *  组件忽略注入页面代理
     */
    glIgnoreInjectPageProxy: {
        type: Boolean,
        default() {
            return false
        }
    },
    componentStoreId: {
        type: String,
        default() {
            return ''
        }
    }
}
const subFormProps = {
    /**
     *  是否作为子表单
     */
    isSubForm: Boolean,

    /**
     *  如果作为子表单，那本表单中哪个字段指向父表单的id
     */
    subFormPidName: String,
}
export default {
    props: props,
    subFormProps:subFormProps
}


