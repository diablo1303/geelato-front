import type {App} from "vue";
import GlUi from '@geelato/gl-ui';
import GlUiArco from '@geelato/gl-ui-arco'
import GlUiSchemaCore from '@geelato/gl-ui-schema'
import GlUiSchemaArco from '@geelato/gl-ui-schema-arco'
import GlIde from '@geelato/gl-ide'
import GlIdeArco from '@geelato/gl-ide-arco'
import draggable from "vuedraggable";
import axios from 'axios'

const geelatoMain = {
    install(app: App) {
        GlUi.setupGeelato({axios})
        GlUiArco.setupGeelato({axios})
        GlIde.setupGeelato({axios})
        GlIdeArco.setupGeelato({axios})
        app.component('GlDraggable', draggable)
        app.use(GlUi)
        app.use(GlUiArco)
        app.use(GlUiSchemaCore)
        app.use(GlUiSchemaArco)
        app.use(GlIde)
        app.use(GlIdeArco)
    }
}

export default geelatoMain

