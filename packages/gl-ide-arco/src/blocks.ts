import type {App, Plugin} from 'vue'
import GlCommandBlockOne from "./components/setters/action-setters/blocks/CommandBlockOne.vue";
import GlCommandBlockTwo from "./components/setters/action-setters/blocks/CommandBlockTwo.vue";

const component: Plugin = {
    install: function (app: App) {
        // 注册组件
        app.component('GlCommandBlock', GlCommandBlockOne)
        app.component('GlBlockMessage', GlCommandBlockOne)
        app.component('GlBlockNotification', GlCommandBlockOne)
        app.component('GlBlockOpenComponentPage', GlCommandBlockOne)
        app.component('GlBlockOpenThirdPage', GlCommandBlockOne)
        app.component('GlBlockSetVar', GlCommandBlockOne)
        app.component('GlBlockIf', GlCommandBlockTwo)
        app.component('GlBlockElse', GlCommandBlockTwo)
        app.component('GlIfComponentValueBlock', GlCommandBlockTwo)
        app.component('GlBlockComponentInvoke', GlCommandBlockOne)
        app.component('GlBlockConfirm', GlCommandBlockOne)
        app.component('GlBlockSetVisible', GlCommandBlockOne)
        app.component('GlTriggerComponentActionBlock', GlCommandBlockOne)
        app.component('GlLogBlock', GlCommandBlockOne)
        app.component('GlSetValueBlock', GlCommandBlockOne)
        app.component('GlReturnBlock', GlCommandBlockOne)
        app.component('GlSetVarBlock', GlCommandBlockOne)
        app.component('GlGroupSumBlock', GlCommandBlockOne)
        app.component('GlJsCodeBlock', GlCommandBlockOne)
        app.component('GlExportExcelBlock', GlCommandBlockOne)
        app.component('GlExportWordBlock', GlCommandBlockOne)
        app.component('GlExportPdfBlock', GlCommandBlockOne)
        app.component('GlGenerateMqlBlock', GlCommandBlockOne)
    }
}

// 默认导出组件
export default component
