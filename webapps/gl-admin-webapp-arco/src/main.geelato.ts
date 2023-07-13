import type {App} from "vue";
import GlUi from '@geelato/gl-ui';
import GlUiArco from '@geelato/gl-ui-arco';

const geelatoMain = {
  install(app: App) {
    app.use(GlUi)
    app.use(GlUiArco)
  }
}

export default geelatoMain

