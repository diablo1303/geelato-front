import type {App} from "vue";
import {createPinia} from "pinia";
import GlUi, {GeelatoPluginOptions} from '@geelato/gl-ui';
import GlUiArco from '@geelato/gl-ui-arco'
import GlUiArcoAdmin, {axios} from '@geelato/gl-ui-arco-admin'
import GlUiSchemaCore from '@geelato/gl-ui-schema'
import GlUiSchemaArco from '@geelato/gl-ui-schema-arco'
import GlIde from '@geelato/gl-ide'
import GlIdeArco from '@geelato/gl-ide-arco'
import draggable from "vuedraggable";

const pinia = createPinia();

const geelatoMain = {
  install(app: App) {
    app.component('GlDraggable', draggable)

    GlUi.setupGeelato({'axios': axios} as unknown as GeelatoPluginOptions)
    GlUiArco.setupGeelato({'axios': axios} as unknown as GeelatoPluginOptions)
    GlUiArcoAdmin.setupGeelato({'axios': axios, 'pinia': pinia} as unknown as GeelatoPluginOptions)
    GlIde.setupGeelato({'axios': axios} as unknown as GeelatoPluginOptions)
    GlIdeArco.setupGeelato({'axios': axios} as unknown as GeelatoPluginOptions)

    app.use(GlUi)
    app.use(GlUiArco)
    app.use(GlUiArcoAdmin)
    app.use(GlUiSchemaCore)
    app.use(GlUiSchemaArco)
    app.use(GlIde)
    app.use(GlIdeArco)
    app.use(pinia)
  }
}

export default geelatoMain