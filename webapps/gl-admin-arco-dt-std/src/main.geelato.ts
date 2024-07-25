import type {App} from "vue";
import GlUi from '@geelato/gl-ui';
import GlUiArco from '@geelato/gl-ui-arco';

const geelatoMain = {
  async install(app: App) {
    // 不需要用到IDE不用引用那么多资源，只需引用GlUi、GlUiArco
    // IDE的引用在专用的ide.geelato.ts文件中
    app.use(GlUi)
    app.use(GlUiArco)
  }
}

export default geelatoMain