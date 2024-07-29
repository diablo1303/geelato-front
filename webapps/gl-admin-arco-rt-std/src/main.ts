import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import GlUi, {GeelatoPluginOptions} from "@geelato/gl-ui";
import GlUiArcoAdmin, {axios} from "@geelato/gl-ui-arco-admin";
import {defaultRoute, externalModules, loginComponent, modules, prefixUrl, router} from "@/router";
import GlUiArco from "@geelato/gl-ui-arco";
import store from './store';
import i18n from './locale';
import App from './App.vue';

const app = createApp(App);

// @ts-ignore
await GlUiArcoAdmin.setupGeelato({
  "axios": axios,
  "router": {
    "router": router,
    "modules": modules,
    "externalModules": externalModules,
    "prefixUrl": prefixUrl,
    "defaultRoute": defaultRoute,
    "loginComponent": loginComponent
  },
} as unknown as GeelatoPluginOptions);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(store);
app.use(i18n);
app.use(GlUi)
app.use(GlUiArco)
app.use(GlUiArcoAdmin)
app.use(router)

app.mount('#app');