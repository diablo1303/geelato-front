import { h } from "vue";
import type {PageConfig} from "../m/types/global";
import GlPageViewer from "./gl-page-viewer/GlPageViewer.vue";


/**
 * 加载页面，可作为drawer或modal的content
 * @param pageConfig
 */
export const loadPageContent = (pageConfig: PageConfig):any => {
    const pageProps = { params: pageConfig.params, pageTemplateProps: pageConfig.pageTemplateProps }
    console.log('JsScriptExecutor > loadPage > pageConfig:', pageConfig)
    return h(GlPageViewer, {
        pageId: pageConfig.pageId,
        extendId: pageConfig.pageId,
        pageStatus: pageConfig.pageStatus,
        pageTemplateName: pageConfig.pageTemplateName,
        pageProps
    })
}