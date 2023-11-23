import {type ComponentInternalInstance, getCurrentInstance } from 'vue'
import {config} from "@vue/test-utils";
export default function useGlobal() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    return appContext.config.globalProperties
}

