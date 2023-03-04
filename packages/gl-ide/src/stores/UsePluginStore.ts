import {defineStore} from 'pinia'

export const usePluginStore = defineStore({
    id: 'GlPluginStore',
    state: () => ({
        plugins: []
    }),
})