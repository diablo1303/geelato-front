import type {App, AppContext} from "vue";
import type {Action} from "@geelato/gl-ui-schema";
import utils from "../utils/Utils";
import {h} from "vue";
import GlPageViewer from '../../components/gl-page-viewer/GlPageViewer.vue'

export class ActionScriptExecutor {

    app: App | undefined

    $gl = {}

    constructor() {
    }

    setApp(app: App) {
        this.app = app
    }

    doAction(action: Action, ctx: object, callback?: Function) {
        const $ctx = {
            ...ctx
        }
        if (Object.keys(this.$gl).length === 0) {
            this.$gl = {
                loadPage: this.loadPage,
                ...utils,
                ...this.app?.config.globalProperties
            }
        }
        console.log('doAction(),$ctx:', $ctx)
        const result = utils.evalFn(action.body, $ctx, '$ctx', this.$gl, '$gl')
        if (callback && typeof callback === 'function') {
            callback()
        }
        return result
    }

    /**
     * 加载页面
     * @param pageId
     */
    loadPage(pageId: string) {
        const props = {pageId}
        console.log('importPage', GlPageViewer)
        return h(GlPageViewer, props)
    }

    /**
     * 获取当前组件所在的页面组件
     */
    getParentPageComponent() {
        // getCurrentInstance().parent.
    }
}

const actionScriptExecutor = new ActionScriptExecutor()
export default actionScriptExecutor