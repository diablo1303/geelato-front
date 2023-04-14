import type {PropType} from "vue";
import type IComponentInstance from "./gl-component/IComponentInstance";
import type {ComponentInstance} from "@geelato/gl-ui-schema";

const props = {
    parentId: {
        type: [String, Number]
    },
    glComponentInst: {
        type: Object as PropType<ComponentInstance>,
        default() {
            return {}
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
    }
}
export default {
    props: props
}


