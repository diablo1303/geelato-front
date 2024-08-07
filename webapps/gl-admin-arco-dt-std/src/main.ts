import {createApp} from 'vue';
import {createPinia} from 'pinia';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import GlUi, {GeelatoPluginOptions} from "@geelato/gl-ui";
import GlUiArcoAdmin, {axios} from "@geelato/gl-ui-arco-admin";
import routerOptions from "@/router";
import GlUiArco from "@geelato/gl-ui-arco";
import i18n from './locale';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

// @ts-ignore
await GlUiArcoAdmin.setupGeelato({
  "axios": axios,
  "pinia": pinia,
  "router": routerOptions,
} as unknown as GeelatoPluginOptions);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(pinia);
app.use(i18n);
app.use(GlUi)
app.use(GlUiArco)
app.use(GlUiArcoAdmin)
app.use(routerOptions.router)

app.mount('#app');