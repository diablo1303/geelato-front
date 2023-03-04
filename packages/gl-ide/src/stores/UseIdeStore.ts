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

    function getUiLibName(){
        return uiLibName.value
    }
    function setUiLibName(name: string) {
        if ('ant|arco'.indexOf(name) === -1) {
            throw "未支持的UI库:" + name + ",当前支持的UI库为：ant|arco"
        }
        uiLibName.value = name
    }

    function openPage({type, id, title, iconType}: Page) {
        // 从已打开的页面中查找，若有若激活
        let foundItem = pageStore.findPage(id)
        if (foundItem.index >= 0) {
            pageStore.setCurrentPage(foundItem.page)
            pageStore.setCurrentPageIndex(<number>foundItem.index)
        } else {
            let items = findPanelsByType('stage')
            let foundPanel = items.find((panel) => {
                return panel.name === type
            })
            if (foundPanel) {
                let newPage = new Page()
                newPage.type = type
                newPage.id = id
                newPage.title = title
                newPage.iconType = iconType
                newPage.ideStageComponentName = foundPanel.componentName
                pageStore.addPage(newPage)
                pageStore.setCurrentPage(newPage)
                pageStore.setCurrentPageIndex(pageStore.pages.length - 1)
            }
        }
    }
    return {
        name,
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
