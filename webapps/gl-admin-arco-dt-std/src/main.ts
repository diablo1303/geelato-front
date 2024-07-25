import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import {GeelatoPluginOptions} from "@geelato/gl-ui";
import GlUiArcoAdmin, {axios} from "@geelato/gl-ui-arco-admin";
import {externalModules, modules, router} from "@/router";
import store from './store';
import i18n from './locale';
import geelatoMain from "./main.geelato";
import App from './App.vue';

const app = createApp(App);

// @ts-ignore
await GlUiArcoAdmin.setupGeelato({
  "axios": axios,
  "router": router,
  params: {"modules": modules, "externalModules": externalModules}
} as unknown as GeelatoPluginOptions);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(store);
app.use(i18n);
app.use(geelatoMain)
app.use(GlUiArcoAdmin)
app.use(router)

app.mount('#app');