import {createApp} from 'vue';
import '@/api/interceptor';
import ArcoVue from '@arco-design/web-vue';
import store from '../../store';
import i18n from '../../locale';
import IdePagePreview from './IdePagePreview.vue';
import '@arco-design/web-vue/dist/arco.css';
import geelatoMain from "./ide.geelato";

const app = createApp(IdePagePreview);

app.use(store);
app.use(ArcoVue, {});
app.use(i18n);
app.use(geelatoMain)

app.mount('#app');
