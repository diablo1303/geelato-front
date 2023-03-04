import {defineStore} from 'pinia'
import type GlPlugin from "../entity/GlPlugin";

export const useAppStore = defineStore({
    id: 'GlAppStore',
    state: () => ({
        actions: {
            /**
             * 安装插件
             * 插件title唯一
             * @param plugin
             */
            usePlugin(plugin: GlPlugin) {

            }
        }
    }),
})