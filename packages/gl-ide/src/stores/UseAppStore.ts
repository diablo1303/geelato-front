import {defineStore} from 'pinia'
import type GlPlugin from "../entity/GlPlugin";
import {ref} from "vue";
import App from "../entity/App";

export const useAppStore = defineStore('GlAppStore',()=>{

    const currentApp = ref(new App())
    /**
     * 安装插件
     * 插件title唯一
     * @param plugin
     */
    // usePlugin(plugin: GlPlugin) {
    //
    // }
    return {
        currentApp
    }
})

