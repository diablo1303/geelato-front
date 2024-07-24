import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import '@/api/interceptor';
import store from './store';
import i18n from './locale';
import geelatoMain from "./main.geelato";
import router from './router';
import App from './App.vue';

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(store);
app.use(i18n);
app.use(geelatoMain)
app.use(router);

app.mount('#app');