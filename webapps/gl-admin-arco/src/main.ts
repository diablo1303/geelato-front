import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import geelatoMain from "@/main.geelato";
import {entityApi} from "@geelato/gl-ui";
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import '@/api/interceptor';

const app = createApp(App);


entityApi.reCreate({baseURL: "https://localhost:8080"})

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(geelatoMain)

app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);

app.mount('#app');
