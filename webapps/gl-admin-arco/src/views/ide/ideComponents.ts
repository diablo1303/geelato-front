import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import geelatoMain from "./ide.geelato";
import store from '../../store';
import i18n from '../../locale';
import IdeComponents from "./IdeComponents.vue";
import '@arco-design/web-vue/dist/arco.css';
import '@/api/interceptor';

const app = createApp(IdeComponents);

app.use(ArcoVue, {});
app.use(store);
app.use(i18n);
app.use(geelatoMain)

app.mount('#app');
