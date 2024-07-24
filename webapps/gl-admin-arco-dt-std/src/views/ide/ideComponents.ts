import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import '@/api/interceptor';
import store from '../../store';
import i18n from '../../locale';
import geelatoMain from "./ide.geelato";
import IdeComponents from "./IdeComponents.vue";

const app = createApp(IdeComponents);

app.use(store);
app.use(ArcoVue, {});
app.use(i18n);
app.use(geelatoMain)

app.mount('#app');
