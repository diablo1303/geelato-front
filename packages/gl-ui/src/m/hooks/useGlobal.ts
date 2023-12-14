import {type ComponentInternalInstance, getCurrentInstance } from 'vue'
export default function useGlobal() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    return appContext.config.globalProperties
}

