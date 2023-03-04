import type {PropType} from "vue";
import type IComponentInstance from "./gl-component/IComponentInstance";

export default {
    props: {
        parentId: {
            type: [String, Number]
        },
        glComponentInst: {
            type: Object as PropType<IComponentInstance>,
            default() {
                return {}
            }
        },
        glChildren: {
            type: Array as PropType<Array<IComponentInstance>>,
            default() {
                return []
            }
        }
    }
}
