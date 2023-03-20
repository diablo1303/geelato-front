import {defineStore} from 'pinia'
import type GlPlugin from "../entity/GlPlugin";
import type Panel from "../entity/Panel";
import {useAppStore} from "./UseAppStore";
import {usePageStore} from "./UsePageStore";
import {useComponentStore} from "./UseComponentStore";
import {useEntityStore} from "./UseEntityStore";
import Page from "../entity/Page";
import type {ComponentMeta} from "@geelato/gl-ui-schema";
import {ref} from "vue";
export const useIdeStore = defineStore('GlIdeStore', () => {
    const name = ref('Geelato Ide')
    // 主UI库，如：ant | arco
    const uiLibName = ref('arco')
    // 组件别名
    const componentAlias = ref({})
    const logo = ref('')
    const activatedSidebarPanelTitle = ref('')
    const plugins = ref<Array<GlPlugin>>([])
    const currentApp = useAppStore()
    const pageStore = usePageStore()
    const entityStore = useEntityStore()
    const componentStore = useComponentStore()
    const currentComponentTree = ref([])

    // 舞台强行更新标识
    const stageRefreshFlag = ref(true)

    /**
     * 安装插件
     * 插件title唯一
     * @param plugin
     */
    function usePlugin(plugin: GlPlugin) {
        if (findPlugin(plugin.name)) {
            console.error('存在同名的插件：', plugin.name)
            return
        }
        plugins.value.push(plugin)
        console.log('use plugin', plugin)
    }

    function findPlugin(pluginName: string) {
        for (let i in plugins.value) {
            const plugin: GlPlugin = plugins.value[i]
            if (plugin.name === pluginName) {
                return plugin
            }
        }
    }

    function findPanelsByType(panelType: string) {
        const panels: Array<Panel> = []
        for (let i in plugins.value) {
            const plugin: GlPlugin = plugins.value[i]
            const somePanels = plugin.getPanels(panelType)
            if (somePanels) {
                panels.push(...somePanels)
            }
        }
        return panels
    }

    function addComponentMetas(componentMetas: Array<ComponentMeta>) {
        componentStore.addComponentMetas(componentMetas)
    }

    function getUiLibName() {
        return uiLibName.value
    }

    function setUiLibName(name: string) {
        if ('ant|arco'.indexOf(name) === -1) {
            throw "未支持的UI库:" + name + ",当前支持的UI库为：ant|arco"
        }
        uiLibName.value = name
    }

    /**
     * 在舞台stage中打开页面
     * @param type
     * @param extendId 页面所处的节点id
     * @param title
     * @param iconType
     */
    function openPage({type, extendId, title, iconType}: Page) {
        // 从已打开的页面中查找，若有若激活
        let foundItem = pageStore.findPageByExtendId(extendId)
        if (foundItem.index >= 0) {
            pageStore.switchToPage(<number>foundItem.index)
        } else {
            let items = findPanelsByType('stage')
            let foundPanel = items.find((panel) => {
                return panel.name === type
            })
            if (foundPanel) {
                // 从后台服务中加载页面，若无则创建新页面
                pageStore.loadPage({extendId}).then((res) => {
                    console.log(res.data.data)
                    let page = new Page()
                    if (res.data.data && res.data.data.length > 0) {
                        const pageItem = res.data.data[0]
                        page.id = pageItem.id
                        page.extendId = pageItem.extendId
                        page.title = title
                        page.iconType = iconType
                        page.code = pageItem.code
                        page.description = pageItem.description
                        page.sourceContent = page.parseContent(pageItem.sourceContent)
                    } else {
                        page.type = type
                        page.extendId = extendId
                        page.title = title
                        page.iconType = iconType
                    }
                    // @ts-ignore
                    page.ideStageComponentName = foundPanel.componentName
                    pageStore.addPage(page)
                })
            }
        }
    }

    function setStageRefreshFlag(flag: boolean) {
        stageRefreshFlag.value = flag
    }

    return {
        name,
        stageRefreshFlag,
        activatedSidebarPanelTitle,
        componentAlias,
        logo,
        currentApp,
        pageStore,
        componentStore,
        entityStore,
        currentComponentTree,
        setUiLibName,
        getUiLibName,
        usePlugin,
        addComponentMetas,
        findPlugin,
        findPanelsByType,
        openPage
    }
})
