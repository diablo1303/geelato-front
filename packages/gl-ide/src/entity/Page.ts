/**
 *  动态页面结构定义
 *  对应数据库中的页面模型
 */
import type {PageType} from "@geelato/gl-ui";
import {ComponentInstance} from "@geelato/gl-ui-schema";

export default class Page {
    isInitFromTemplate: boolean;
    id: string = '';
    appId: string = '';
    extendId: any;
    title: string = '';
    type: PageType = '';
    iconType: string = '';
    code: string = '';
    description: string = '';
    // sourceContent: { component: any; opts: {} | any; params: {} | any; events: {} | any } | any;
    // previewContent?: { component: any; opts: {} | any; params: {} | any; events: {} | any } | any;
    // releaseContent?: { component: any; opts: {} | any; params: any; events: {} | any } | any;
    sourceContent?: ComponentInstance;
    previewContent?: ComponentInstance;
    releaseContent?: ComponentInstance;
    objectTree: any[] = [];
    // 该页面的舞台组件
    ideStageComponentName: string = ''
    // 该页面的设计器组件
    ideSetterComponentName: string = 'GlComponentSetter'
    // 页面当前选择中的组件id，用于设计时在切换页面时，记录当前页面选中的id
    currentSelectedComponentId: string = ''

    /**
     * @param options
     * @param isFromRemote 是否从模板初始化，默认为false，方便打开页面时区分是否要加载模板的配置信息还是从服务器加载配置信息
     */
    constructor(options: any = {}, isInitFromTemplate: boolean = false) {
        this.reset(options)
        this.isInitFromTemplate = isInitFromTemplate
    }

    reset(options: any) {
        const params = options || {}
        // const defaultContent = {
        //     // code: {
        //     //   mvel: '',
        //     //   sql: ''
        //     // },
        //     // 页面的内容
        //     // 格式1：'/components/collections/grid'
        //     // 格式2：vue component对象，{template:''}
        //     component: params.component || '',
        //     // 用于传递给component的opts，一般用于页面的定义配置
        //     opts: {
        //         // 页面的配置信息
        //         // body: {},
        //         // 页面元素的配置信息
        //         // elements:{'id1':{'ui':{}},'id2':{}}
        //         // elements: {},
        //         // 结构树
        //         // tree:['id1':['id3','id4'],'id2']
        //         // tree: {}
        //     },
        //     // 运行时生成的组件引用，不保存
        //     // _componentRefs: {},
        //     events: {},
        //     // 运行时生成的事件引用，不保存
        //     // _bindEventHandlers: {},
        //     // 当前页面的子页面，如弹层的页面[{type:modal,page:{}}]、如嵌入页面[{type:inner,page:{}}]
        //     // _subPages: [],
        //     // 默认查询参数，与opts不同，query是同一页面定义下的不同参数
        //     params: {}
        // }
        const defaultContent = new ComponentInstance()
        // 对像数据库中的id(guid)
        this.id = params.id || ''
        // 所属应用id
        this.appId = params.appId || ''
        // 扩展id，用于关联其它对象
        this.extendId = params.extendId
        // 页面名称 不需要名称字段，从树节点中获取
        // this.name = params.name || ''
        // 类型，唯一，如 Page、Canvas、Api、Dbm
        this.type = params.type || 'Page'
        // 页面编码，唯一
        this.code = params.code || ''
        // 描述
        this.description = params.description || ''
        // 包含component、opts、params等内容
        this.sourceContent = params.sourceContent ? this.parseContent(params.sourceContent) : JSON.parse(JSON.stringify(defaultContent))
        // this.sourceContent._componentRefs = this.sourceContent._componentRefs || {}
        // this.sourceContent.events = this.sourceContent.events || {}
        // this.sourceContent._bindEventHandlers = this.sourceContent._bindEventHandlers || {}

        // 预览的内容
        this.previewContent = params.previewContent ? this.parseContent(params.previewContent) : JSON.parse(JSON.stringify(defaultContent))
        // this.previewContent._componentRefs = this.previewContent._componentRefs || {}
        // this.previewContent.events = this.previewContent.events || {}
        // this.previewContent._bindEventHandlers = this.previewContent._bindEventHandlers || {}

        // 发布的内容
        this.releaseContent = params.releaseContent ? this.parseContent(params.releaseContent) : JSON.parse(JSON.stringify(defaultContent))
        // this.releaseContent._componentRefs = this.releaseContent._componentRefs || {}
        // this.releaseContent.events = this.releaseContent.events || {}
        // this.releaseContent._bindEventHandlers = this.releaseContent._bindEventHandlers || {}


        this.objectTree = []

        this.currentSelectedComponentId = ''
    }

    /**
     * @param content 字符串
     * @returns {*} content 对象
     */
    parseContent(content: string) {
        if (typeof content === 'string') {
            const c = JSON.parse(content)
            return {
                component: c.component,
                opts: c.opts,
                params: c.params,
                events: c.events
            }
        } else {
            return content
        }
    }
}
