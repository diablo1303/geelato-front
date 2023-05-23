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
            return false
        }
    },
    /**
     *  如果是runtime，则值为‘Runtime’
     *  该属性和glIsRuntime需对应
     */
    glRuntimeFlag: {
        type: String,
        default() {
            return ''
        }
    },
    glIndex: {
        type: Number
    },
    componentStoreId: {
        type: String,
        default() {
            return 'useComponentStore'
        }
    }
}
export default {
    props: props
}


