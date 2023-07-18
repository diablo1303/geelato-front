import type {App} from "vue";
import GlUi, {entityApi} from '@geelato/gl-ui';
import GlUiArco from '@geelato/gl-ui-arco'
import GlUiSchemaCore from '@geelato/gl-ui-schema'
import GlUiSchemaArco from '@geelato/gl-ui-schema-arco'
import GlIde from '@geelato/gl-ide'
import GlIdeArco from '@geelato/gl-ide-arco'
import draggable from "vuedraggable";

const geelatoMain = {
    install(app: App) {

        app.component('GlDraggable', draggable)
        entityApi.reCreate({baseURL: import.meta.env.VITE_API_BASE_URL})
        app.use(GlUi)
        app.use(GlUiArco)
        // @ts-ignore
        app.use(GlUiSchemaCore)
        app.use(GlUiSchemaArco)
        app.use(GlIde)
        app.use(GlIdeArco)
    }
}

export default geelatoMain

