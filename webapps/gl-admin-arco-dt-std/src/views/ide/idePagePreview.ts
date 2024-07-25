import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import store from '../../store';
import i18n from '../../locale';
import geelatoMain from "./ide.geelato";
import IdePagePreview from './IdePagePreview.vue';

const app = createApp(IdePagePreview);

app.use(store);
app.use(ArcoVue, {});
app.use(i18n);
app.use(geelatoMain)

app.mount('#app');
