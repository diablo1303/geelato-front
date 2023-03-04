import {createApp} from 'vue'
import {createPinia} from "pinia";
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import GlDraggable from 'vuedraggable/src/vuedraggable'
import GlUi from '@geelato/gl-ui'
import GlUiArco from '@geelato/gl-ui-arco'
import GlUiSetterCore from '@geelato/gl-ui-schema'
import GlUiSetterArco from '@geelato/gl-ui-schema-arco'
import GlIde from '@geelato/gl-ide'
import GlIdeArco from '@geelato/gl-ide-arco'
// import GlPluginCore from 'gl-plugin-core'
// import GlPluginDbm from 'gl-plugin-dbm'
// import GlPluginScript from 'gl-plugin-script'
import '@arco-design/web-vue/dist/arco.css';

const pinia = createPinia()
const app = createApp(App)


app.component('gl-draggable', GlDraggable)
app.use(ArcoVue, {});
app.use(pinia)
// @ts-ignore
app.use(GlUi)
// @ts-ignore
app.use(GlUiArco)
// @ts-ignore
app.use(GlUiSetterCore)
// @ts-ignore
app.use(GlUiSetterArco)
app.use(GlIde)
app.use(GlIdeArco)
// app.use(GlPluginCore)
// @ts-ignore
// app.use(GlPluginScript)
// app.use(GlPluginDbm)


app.mount('#app')
