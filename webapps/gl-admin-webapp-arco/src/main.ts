import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import store from './store';
import router from './router';
import i18n from './locale';
import directive from './directive';
import App from './App.vue';
import '@/api/interceptor';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import geelatoMain from "./main.geelato";

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(store);
app.use(router);
app.use(i18n);
app.use(globalComponents);
app.use(directive);
app.use(geelatoMain)

app.mount('#app');
