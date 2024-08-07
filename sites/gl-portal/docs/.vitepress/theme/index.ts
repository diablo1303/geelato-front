import {inBrowser} from 'vitepress';
import DefaultTheme from 'vitepress/theme'
import ArcoVue, { Modal, Drawer } from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css';
import draggable from 'vuedraggable'
import GlUi from '@geelato/gl-ui'
import GlUiArco from '@geelato/gl-ui-arco'
import GlUiSchemaCore from '@geelato/gl-ui-schema'
import GlUiSchemaArco from '@geelato/gl-ui-schema-arco'
import GlIde from '@geelato/gl-ide'
import GlIdeArco from '@geelato/gl-ide-arco'
import ComponentBuilderExample from '../components/setter/ComponentBuilderExample.vue'
import SetterExample from '../components/setter/SetterExample.vue'
import ApiBlocks from '../components/setter-block/ApiBlocks.vue'
import BrowserBlocks from '../components/setter-block/BrowserBlocks.vue'
import AllComponents from '../components/setter-component/AllComponents.vue'
import PluginList from '../components/plugin/PluginList.vue'
// import MyLayout from './MyLayout.vue'

// import i18n from '../locale/index';
import {createPinia} from "pinia";

import './custom.css'
import {createI18n} from "vue-i18n";
import en from "../locale/en-US";
import cn from "../locale/zh-CN";

export default {
    ...DefaultTheme,
    // root component to wrap each page
    // MyLayout,

    // this is a Vue 3 functional component
    NotFound: () => 'custom 404',

    enhanceApp({app, router, siteData}) {

        app.component('gl-draggable', draggable)
        app.component('ComponentBuilderExample', ComponentBuilderExample)
        app.component('SetterExample', SetterExample)
        app.component(BrowserBlocks.name, BrowserBlocks)
        app.component(ApiBlocks.name, ApiBlocks)
        app.component(AllComponents.name, AllComponents)
        app.component(PluginList.name, PluginList)
        const pinia = createPinia()
        app.use(pinia)
        // app is the Vue 3 app instance from `createApp()`.
        // router is VitePress' custom router. `siteData` is
        // a `ref` of current site-level metadata.

        // entityApi.reCreate({baseURL: "https://localhost:8080"})
        app.use(ArcoVue)
        Drawer._context = app._context
        Modal._context = app._context;
        app.component('GlModal', Modal)
        app.component('GlDrawer', Drawer)
        app.use(GlUi)
        app.use(GlUiArco)
        app.use(GlUiSchemaCore)
        app.use(GlUiSchemaArco)
        app.use(GlIde)
        app.use(GlIdeArco)

        if (inBrowser) {
            const i18n = createI18n({
                locale: localStorage.getItem('arco-locale') || 'zh-CN',
                fallbackLocale: 'en-US',
                allowComposition: true,
                messages: {
                    'en-US': en,
                    'zh-CN': cn,
                },
            });
            app.use(i18n)
        }

        // 需要在调用时手动传入 AppContext，或者为组件全局指定 AppContext
        // Modal._context = app._context;
    },
}
