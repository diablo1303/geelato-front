import {defineStore} from 'pinia'
import type GlPlugin from "../entity/GlPlugin";
import {ref} from "vue";
import App from "../entity/App";

export const useAppStore = defineStore('GlAppStore',()=>{

    const currentApp = ref(new App())
    // TODO
    currentApp.value.id = '1976169388038462609'

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

