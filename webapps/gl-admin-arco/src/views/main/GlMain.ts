import {createApp} from 'vue';
import '@/api/interceptor';
import ArcoVue from '@arco-design/web-vue';
import store from '../../store';
import i18n from '../../locale';
import IdeMain from './GlMain.vue';
import '@arco-design/web-vue/dist/arco.css';
import geelatoMain from "../ide/ide.geelato";
import {useGlobal} from "@geelato/gl-ui";


const global = useGlobal()
global.$gl.user = 'xx'

const app = createApp(IdeMain);

app.use(store);
app.use(ArcoVue, {});
app.use(i18n);
app.use(geelatoMain)

app.mount('#app');
