import {defineStore} from 'pinia'
import {ref} from "vue";
import App from "../entity/App";
import {utils} from "@geelato/gl-ui";

export const useAppStore = defineStore('GlAppStore',()=>{

    const currentApp = ref(new App())

    currentApp.value.id = utils.getUrlQueryParam('appId') || ''
    currentApp.value.name = decodeURI(utils.getUrlQueryParam('appName') || '')
    currentApp.value.tenantCode = utils.getUrlQueryParam('tenantCode') || ''

    return {
        currentApp
    }
})

