import {createApp} from 'vue';
import '@/api/interceptor';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import store from '../../store';
import i18n from '../../locale';
import AppSettings from './AppSettings.vue';
import '@arco-design/web-vue/dist/arco.css';
import geelatoMain from "./ide.geelato";

const app = createApp(AppSettings);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(store);
app.use(i18n);
app.use(geelatoMain)

app.mount('#app');
