import {createApp} from 'vue';
import ArcoVue from '@arco-design/web-vue';
import geelatoMain from "./ide.geelato";
import store from '../../store';
import i18n from '../../locale';
import IdeMain from './IdeMain.vue';
import '@arco-design/web-vue/dist/arco.css';
import '@/api/interceptor';
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import {useIdeStore} from "@geelato/gl-ide";
import {CheckUtil} from "@geelato/gl-ui";

const app = createApp(IdeMain);

app.use(ArcoVue, {});
app.use(store);
app.use(i18n);
app.use(geelatoMain)


// if (CheckUtil.isBrowser()) {
//     const componentMaterialStore = useComponentMaterialStore()
//     componentMaterialStore.initRegisterComponentMetas()
//     const ideStore = useIdeStore()
//     ideStore.addComponentMetas(componentMaterialStore.componentMetas)
// }

app.mount('#app');
