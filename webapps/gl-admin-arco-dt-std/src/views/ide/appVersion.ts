import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import '@/api/interceptor';
import store from '../../store';
import i18n from '../../locale';
import geelatoMain from "./ide.geelato";
import AppVersion from './AppVersion.vue';

const app = createApp(AppVersion);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(store);
app.use(i18n);
app.use(geelatoMain)

app.mount('#app');
