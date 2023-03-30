import {type ComponentInternalInstance, getCurrentInstance } from 'vue'
export default function useGlobal() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    const globalProperties = appContext.config.globalProperties
    return {
        ...globalProperties
    }
}
