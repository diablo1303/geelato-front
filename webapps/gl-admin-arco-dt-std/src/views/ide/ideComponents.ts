import {createApp} from 'vue';
import '@/api/interceptor';
import ArcoVue from '@arco-design/web-vue';
import store from '../../store';
import i18n from '../../locale';
import IdeComponents from "./IdeComponents.vue";
import '@arco-design/web-vue/dist/arco.css';
import geelatoMain from "./ide.geelato";

const app = createApp(IdeComponents);

app.use(store);
app.use(ArcoVue, {});
app.use(i18n);
app.use(geelatoMain)

app.mount('#app');
