import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import i18n from '../../locale';
import geelatoMain from "./ide.geelato";
import IdeMain from './IdeMain.vue';

const app = createApp(IdeMain);

app.use(ArcoVue, {});
app.use(i18n);
app.use(geelatoMain)

app.mount('#app');
