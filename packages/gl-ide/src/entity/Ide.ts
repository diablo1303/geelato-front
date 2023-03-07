import {computed, watch, reactive} from 'vue'
import type GlPlugin from "./GlPlugin";
import type Panel from "./Panel";
import App from "./App"
import Page from './Page'
import OperationHistory from './OperationHistory'
import ComponentMetaManager from "./meta/ComponentMetaManager";
import type OperationHistoryItem from "./OperationHistoryItem";
import type ComponentDesignMeta from "./meta/ComponentDesignMeta";
import type BaseDesignMeta from "./meta/BaseDesignMeta";
import type {ComponentInstance} from "@geelato/gl-ui-schema";

// TODO 待整合到stores中
export default class Ide {
    name: string = 'Geelato Ide'
    logo: string = ''
    currentApp: App = new App()
    // 最大历史记录
    maxPages: number = 20
    currentPages: Array<Page> = []
    currentPage: Page = new Page()
    plugins: Array<GlPlugin> = []

    // 操作记录
    // @ts-ignore
    history: OperationHistory = reactive(new OperationHistory(30))

    //--------------- ide的样式 ---------------//
    theme: any = {background: 'rgb(238, 238, 238)'}
    ideHeight: number = 0
    ideWidth: number = 0
    toolbarHeight: number = 34
    toolbarWidth: number = 0
    sidebarHeight: number = 0
    sidebarWidth: number = 280
    sidebarLeftToolbarWidth: number = 22
    stageHeight: number = 0
    stageWidth: number = 0
    setterHeight: number = 0
    settingsWidth: number = 320
    statusHeight: number = 0
    statusWidth: number = 0

    sidebarsWidthPercent: any = computed(() => {
        return this.sidebarWidth / this.ideWidth * 100
    })

    sidebarTabWidthPercent: any = computed(() => {
        return this.sidebarLeftToolbarWidth / this.ideWidth * 100
    })

    stageWidthPercent: any = computed(() => {
        return (this.ideWidth - this.sidebarWidth - this.settingsWidth) / this.ideWidth * 100
    })

    setterWidthPercent: any = computed(() => {
        return this.settingsWidth / this.ideWidth * 100
    })

    panelPadding: number = 4

    //--------------- 设计时交互 ---------------//
    currentComponentTree: Array<ComponentInstance> = reactive([])
    private _currentHoverComponentId: string = ''
    private _currentHoverComponentName: string = ''
    private _currentSelectedComponentId: string = ''
    private _currentSelectedComponentName: string = ''
    private _currentDragComponentId: string = ''
    private _currentDragComponentName: string = ''

    // 当前组件配置
    currentSelectedComponent?: BaseDesignMeta
    // 当前组件元数据
    currentSelectedComponentMeta?: ComponentDesignMeta
    // 当前组件导航条
    currentComponentIdNav: Array<string> = []

    // 组件元数据
    componentMetaManager: ComponentMetaManager = new ComponentMetaManager()

    constructor() {
        // this.sidebarsWidthPercent = computed(this.sidebarsWidthPercentComputed)
        watch(
            () => this.currentComponentTree,
            (state, prevState) => {
                this.history.pushStep('ComponentTree', this.currentComponentTree)
                console.log(
                    "deep ",
                    JSON.stringify(state) === JSON.stringify(prevState),
                    state,
                    prevState
                )
                ;
            },
            {deep: true}
        );
        let that = this
        this.history.onPrevStep = function (ohi: { index: number, item: OperationHistoryItem }) {
            that.reset(ohi)
        }
    }

    reset(ohi: { index: number, item: OperationHistoryItem }) {
        console.log('ide > reset() > OperationHistoryItem:', ohi, 'currentComponentTree:', this.currentComponentTree)
        this.currentComponentTree.splice(0, this.currentComponentTree.length)
        this.currentComponentTree.push(...JSON.parse(ohi.item.json))
    }


    get currentHoverComponentId(): string {
        return this._currentHoverComponentId;
    }

    set currentHoverComponentId(value: string) {
        this._currentHoverComponentId = value;
        if (this._currentHoverComponentId) {
            this.setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsHover', this._currentHoverComponentId)
        }
    }

    get currentHoverComponentName(): string {
        return this._currentHoverComponentName;
    }

    set currentHoverComponentName(value: string) {
        this._currentHoverComponentName = value;
    }

    get currentSelectedComponentId(): string {
        return this._currentSelectedComponentId;
    }

    set currentSelectedComponentId(value: string) {
        this._currentSelectedComponentId = value;
        if (this._currentSelectedComponentId) {
            const foundComponent = this.findComponentFromTreeById(this._currentSelectedComponentId)
            console.log('findComponentFromTreeById', this._currentSelectedComponentId, 'and get', foundComponent)
            this.currentSelectedComponent = foundComponent
            if (this.currentSelectedComponent) {
                this.currentSelectedComponentName = this.currentSelectedComponent.componentName
                // TODO 对于Gl-Col内置的组件，查询为null
                this.currentSelectedComponentMeta = this.componentMetaManager.findComponentDesignMeta(this.currentSelectedComponentName)
                console.log('componentMetaManager:', this.componentMetaManager, this.currentSelectedComponentName,this.currentSelectedComponentMeta)
                // this.currentSelectedComponentMeta.props = foundComponent.props
            }
            console.log('currentComponentTree', this.currentComponentTree)
            console.log('currentSelectedComponent', this.currentSelectedComponent, foundComponent)
            console.log('currentSelectedComponentMeta', this.currentSelectedComponentMeta)
            this.setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsSelected', this._currentSelectedComponentId)
        }
    }

    get currentSelectedComponentName(): string {
        return this._currentSelectedComponentName;
    }

    set currentSelectedComponentName(value: string) {
        this._currentSelectedComponentName = value;
    }

    get currentDragComponentId(): string {
        return this._currentDragComponentId;
    }

    set currentDragComponentId(value: string) {
        this._currentDragComponentId = value;
    }

    get currentDragComponentName(): string {
        return this._currentDragComponentName;
    }

    set currentDragComponentName(value: string) {
        this._currentDragComponentName = value;
    }

    get operationHistory() {
        return this.history
    }

    sidebarsWidthPercentComputed() {
        return this.sidebarWidth / this.ideWidth * 100
    }

    /**
     * 安装插件
     * 插件title唯一
     * @param plugin
     */
    usePlugin(plugin: GlPlugin) {
        if (this.findPlugin(plugin.name)) {
            console.error('存在同名的插件：', plugin.name)
            return
        }
        this.plugins.push(plugin)
        console.log('use gl-ide-plugin', plugin)
    }

    // usePlugin(pluginComponent, options) {
    //     if (!GlobalVue) {
    //         console.error('安装ide插件失败，必需先调用setVue(Vue)设置Vue。')
    //         return
    //     }
    //
    //     let plugin = pluginComponent.config
    //     let checkInfo = checkPlugin(plugin)
    //     if (!checkInfo) {
    //         // install 注册全局组件
    //         if (typeof pluginComponent.install === 'function') {
    //             pluginComponent.install(GlobalVue)
    //         }
    //         plugins.push(plugin)
    //         // use file
    //         if (plugin.file) {
    //             files.push(plugin.file)
    //             fileTypes[plugin.file.type] = {
    //                 type: plugin.file.type,
    //                 icon: plugin.file.icon,
    //                 name: plugin.file.title
    //             }
    //         }
    //         // use panels
    //         if (plugin.panels) {
    //             panels.push(...plugin.panels)
    //         }
    //     } else {
    //         return checkInfo
    //     }
    //     console.log('ide > use plugin > ', plugin, 'options > ', options)
    // }

    /**
     *  选中上一级组件
     */
    selectParentComponent() {
        if (!this._currentSelectedComponentId) {
            return
        }
        let dom = document.getElementById(this._currentSelectedComponentId)
        let parentDom = this.findParentNode(dom)
        if (parentDom.id.indexOf('GlRoot') === -1) {
            this.currentSelectedComponentId = parentDom.id
            this.currentSelectedComponentName = parentDom.id
        }
        console.log('selectParentComponent:', parentDom.id)
    }

    /**
     * 基于dom向上找gl-*组件dom
     * 特点是上级dom有id，且id长度为16
     * @param dom
     */
    findParentNode(dom: Element | null): any {
        if (dom && dom.parentNode) {
            // console.log('dom:', dom, dom.id, dom.parentNode.id)
            // @ts-ignore
            if (dom.parentNode.id && dom.parentNode.id.length === 16) {
                return dom.parentNode
            } else {
                // @ts-ignore
                return this.findParentNode(dom.parentNode)
            }
        }
        return dom
    }

    findComponentFromTreeById(componentId: string) {
        function findNodeFromTree(nodeId: string, nodes: Array<any>): any {
            for (let index in nodes) {
                let node = nodes[index]
                // console.log('compare node.id,componentId', node.id, componentId, node.id === componentId)
                if (node.id === componentId) {
                    return node
                } else if (node.children && node.children.length > 0) {
                    const foundNode = findNodeFromTree(nodeId, node.children)
                    if (foundNode) return foundNode
                }
            }
        }

        return findNodeFromTree(componentId, this.currentComponentTree) || {}
    }

    findPlugin(pluginName: string) {
        for (let i in this.plugins) {
            const plugin: GlPlugin = this.plugins[i]
            if (plugin.name === pluginName) {
                return plugin
            }
        }
    }

    findPanelsByType(panelType: string) {
        const panels: Array<Panel> = []
        for (let i in this.plugins) {
            const plugin: GlPlugin = this.plugins[i]
            const somePanels = plugin.getPanels(panelType)
            if (somePanels) {
                panels.push(...somePanels)
            }
        }
        return panels
    }

    /**
     * 设置工具条的位置
     * @param toolbarBreadcrumbsId 一般该Id值为'glToolbarBreadcrumbsHover'或'glToolbarBreadcrumbsSelected'
     * @param moveToTargetId
     */
    setToolbarBreadcrumbsPosition(toolbarBreadcrumbsId: string, moveToTargetId: string) {
        if (moveToTargetId === 'glToolbarBreadcrumbsHover' || moveToTargetId === 'glToolbarBreadcrumbsSelected' || moveToTargetId === 'glToolbarBreadcrumbs') {
            return
        }
        let oDiv = document.getElementById(toolbarBreadcrumbsId);
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        const target = typeof moveToTargetId === 'string' ? document.getElementById(moveToTargetId) : moveToTargetId
        if (!target) {
            console.error('通过moveToTargetId(' + moveToTargetId + ')找不到停靠的对象。')
            return
        }
        // @ts-ignore
        const targetRect = target.getBoundingClientRect()
        // @ts-ignore
        oDiv.style.top = scrollTop + targetRect.y - this.toolbarHeight + 1 + "px";
        // @ts-ignore
        oDiv.style.left = scrollLeft + targetRect.x - this.sidebarWidth - 4 + "px";
    }

}
