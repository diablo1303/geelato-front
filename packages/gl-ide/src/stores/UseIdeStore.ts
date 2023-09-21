import {defineStore} from 'pinia'
import type GlPlugin from "../entity/GlPlugin";
import type Panel from "../entity/Panel";
import {useAppStore} from "./UseAppStore";
import {usePageStore} from "./UsePageStore";
import {useComponentStore} from "./UseComponentStore";
import {useEntityStore} from "./UseEntityStore";
import Page from "../entity/Page";
import type {ComponentMeta, ComponentInstance} from "@geelato/gl-ui-schema";
import {ref} from "vue";
import {utils, useGlobal} from "@geelato/gl-ui";


export const useIdeStore = defineStore('GlIdeStore', () => {
    const name = ref('Geelato Ide')
    // 主UI库，如：ant | arco
    const uiLibName = ref('arco')
    // 组件别名
    const componentAlias = ref({})
    const logo = ref('')
    const activatedSidebarPanelTitle = ref('')
    const plugins = ref<Array<GlPlugin>>([])
    const appStore = useAppStore()
    const pageStore = usePageStore()
    // 正在打开的页面extendId，如果在loadPage返回时，发现extendId与当前openingPageExtendId不一致
    // 则是原因在返回前执行了新的打开页面操作，发起了新的loadPage
    const openingPageExtendId = ref('')
    const entityStore = useEntityStore()
    const componentStore = useComponentStore()
    const currentComponentTree = ref([])

    // 舞台强行更新标识
    const stageRefreshFlag = ref(true)

    const global = useGlobal()

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
        // console.log('use plugin', plugin)
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
        // console.log('try to open page:', {type, extendId, title, iconType}, openingPageExtendId.value)
        if (openingPageExtendId.value) {
            if (openingPageExtendId.value === extendId) {
                global.$notification.error({
                    title: `打开页面【${title}】失败`,
                    content: `正在加载页面【${title}】，请勿重复打开`
                })
            } else {
                global.$notification.error({
                    title: `打开页面【${title}】失败`,
                    content: `正在加载其它页面，请加载之后再切换页面`
                })
            }
            return false
        }
        try {
            openingPageExtendId.value = extendId
            // 从已打开的页面中查找，若有若激活
            let foundItem = pageStore.findPageByExtendId(extendId)
            if (foundItem.index >= 0) {
                // console.log('found opened page:', foundItem)
                // componentStore.setComponentTree(foundItem.page.sourceContent)
                pageStore.switchToPage(<number>foundItem.index)
                openingPageExtendId.value = ''
            } else {
                let items = findPanelsByType('stage')
                let foundPanel = items.find((panel) => {
                    return panel.name === type
                })
                if (foundPanel) {
                    // 从后台服务中加载页面，若无则创建新页面
                    pageStore.loadPage({extendId}).then((res) => {
                        // console.log('loadedPage:', res.data)
                        let page = new Page()
                        if (res.data && res.data.length > 0) {
                            // 服务端加载的页面
                            const pageItem = res.data[0]
                            page.id = pageItem.id
                            page.appId = pageItem.appId
                            page.extendId = pageItem.extendId
                            page.title = title
                            page.iconType = iconType
                            page.code = pageItem.code
                            page.description = pageItem.description
                            page.sourceContent = JSON.parse(pageItem.sourceContent)
                        } else {
                            // 新页面
                            page.type = type
                            page.appId = appStore.currentApp.id
                            page.extendId = extendId
                            page.title = title
                            page.iconType = iconType
                            // TODO 如果type为templatePage，则弹出页面模板选择页面，从模板中创建，这样可以支持更多模板页面
                            const pageTemplate = pageStore.getPageTemplate(type)

                            function genComponentId(inst: ComponentInstance) {
                                inst.id = utils.gid(componentStore.getAlias(inst.componentName), 20)
                                if (inst.children) {
                                    inst.children.forEach((subInst: ComponentInstance) => {
                                        genComponentId(subInst)
                                    })
                                }
                            }

                            genComponentId(pageTemplate)
                            // console.log('pageTemplate',pageTemplate)
                            page.sourceContent = pageTemplate
                        }
                        componentStore.setComponentTree(page.sourceContent)
                        // @ts-ignore
                        page.ideStageComponentName = foundPanel.componentName
                        pageStore.addPage(page)
                        openingPageExtendId.value = ''
                        // 记录操作
                        pageStore.operationLogInit('初始化', pageStore.currentPage.sourceContent, page.sourceContent!)
                    })
                } else {
                    openingPageExtendId.value = ''
                }
            }
        } catch (e) {
            console.error('打开页面失败！', e)
            openingPageExtendId.value = ''
        }
    }

    /**
     *  保存当前舞台中打开的页面
     */
    function savePage() {
        // set page content
        if (componentStore.currentComponentTree && componentStore.currentComponentTree.length > 0) {
            pageStore.setCurrentSourceContent(componentStore.currentComponentTree[0])
        } else {
            pageStore.setCurrentSourceContent()
        }
        return pageStore.saveCurrentPage()
    }

    /**
     * 关闭页面
     * 需要同步删除缓存中的数据
     * @param type
     * @param extendId
     * @param title
     * @param iconType
     */
    function closePage({type, extendId, title, iconType}: Page) {
        // console.log('close page:', {type, extendId, title, iconType})
        let foundItem = pageStore.findPageByExtendId(extendId)
        if (foundItem.index >= 0) {
            // console.log('found delete page:', foundItem)
            pageStore.closePage(<number>foundItem.index)
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
        openPage,
        closePage,
        savePage
    }
})
