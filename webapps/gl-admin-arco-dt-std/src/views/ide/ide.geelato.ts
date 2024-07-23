import type {App} from "vue";
import GlUi from '@geelato/gl-ui';
import GlUiArco from '@geelato/gl-ui-arco'
import GlUiArcoAdmin from '@geelato/gl-ui-arco-admin'
import GlUiSchemaCore from '@geelato/gl-ui-schema'
import GlUiSchemaArco from '@geelato/gl-ui-schema-arco'
import GlIde from '@geelato/gl-ide'
import GlIdeArco from '@geelato/gl-ide-arco'
import draggable from "vuedraggable";

const geelatoMain = {
  install(app: App) {

    app.component('GlDraggable', draggable)
    app.use(GlUi)
    app.use(GlUiArco)
    app.use(GlUiArcoAdmin)
    app.use(GlUiSchemaCore)
    app.use(GlUiSchemaArco)
    app.use(GlIde)
    app.use(GlIdeArco)
  }
}

export default geelatoMain