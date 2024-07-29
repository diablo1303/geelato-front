import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import i18n from '../../locale';
import geelatoMain from "./ide.geelato";
import AppSettings from './AppSettings.vue';

const app = createApp(AppSettings);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(i18n);
app.use(geelatoMain)

app.mount('#app');
