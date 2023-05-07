import {ref} from "vue";
import {defineStore} from 'pinia'
import {entityApi, utils} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import {useComponentStore} from "./UseComponentStore";
import Page from "../entity/Page";

export const usePageStore = defineStore('GlPageStore', () => {
    /**
     *  最大的页面数
     */
    // const maxPage = ref(20)
    /**
     *  当前打开激活的页面
     */
    const currentPage = ref(new Page())
    /**
     *  当前打开激活的页面索引
     */
    const currentPageIndex = ref(-1)
    /**
     *  打开的页面集
     */
    const pages = ref(<Array<Page>>[])

    const componentStore = useComponentStore()

    /**
     *  创建页面时的页面模板json,key为页面类型，如formPage、freePage
     */
    const pageTemplates: { [key: string]: any } = {}

    /**
     * 添加页面模板，同类型的只加一次
     * @param pageType
     * @param template
     */
    function addPageTemplate(pageType: string, template: any) {
        console.log('addPageTemplate', pageType, template)
        if (!template || pageTemplates[pageType] !== undefined) return
        if (typeof template.then === "function") {
            template.then((result: any) => {
                console.log('addPageTemplate template.then result.default:', result.default)
                pageTemplates[pageType] = result.default
            })
        } else {
            pageTemplates[pageType] = template
        }
    }

    /**
     * 获取页面模板，并为页面模板中无id的组件加上id
     * @param pageType
     * @param template
     */
    function getPageTemplate(pageType: string): ComponentInstance {
        const template: ComponentInstance = JSON.parse(JSON.stringify(pageTemplates[pageType]))

        return template
    }

    function addPage(page: Page) {
        console.log('push page to pageStore,page:', page)
        pages.value.push(page)
        switchToPage(pages.value.length - 1)
    }

    /**
     * 通过页面id从打开的页面集中查找
     * @param id
     * @return e.g. {page: new Page(), index: -1}
     */
    function findPageById(id: string) {
        for (let index in pages.value) {
            if (pages.value[index].id === id) {
                return {page: pages.value[index], index: index}
            }
        }
        return {page: new Page(), index: -1}
    }

    /**
     * 通过扩展id(页面所在的树id)从打开的页面集中查找
     * @param extendId
     * @return e.g. {page: new Page(), index: -1}
     */
    function findPageByExtendId(extendId: string) {
        for (let index in pages.value) {
            if (pages.value[index].extendId === extendId) {
                return {page: pages.value[index], index: index}
            }
        }
        return {page: new Page(), index: -1}
    }

    function switchToPage(index: number) {
        // 如果是由于删除引起的切换，页面长度有时会为0
        if (pages.value.length === 0) {
            currentPageIndex.value = -1
            currentPage.value = new Page()
            componentStore.$reset()
            return
        }
        const lastPageIndex = currentPageIndex.value
        // pages页面数量调整时，如做了删除操作，需要重新计算lastPageIndexAfter的值，确保索引到调整的灵数组上
        const lastPageIndexAfter = lastPageIndex >= pages.value.length ? lastPageIndex - 1 : lastPageIndex
        const newPageIndex = Number.parseInt(index + '')
        console.log('switchToPage from index:', lastPageIndex, 'to index', newPageIndex, 'lastPage:', currentPage.value, 'componentStore:', componentStore)

        // 在切换页面时，记录原页面(lastPageIndex>=0)当前选中的组件
        if (lastPageIndexAfter >= 0) {
            pages.value[lastPageIndexAfter].currentSelectedComponentId = componentStore.currentSelectedComponentId
        }
        currentPageIndex.value = newPageIndex
        currentPage.value = pages.value[newPageIndex]
        // 切换页面之后，重置页面组件状态，并重新选中页面记录的已选组件
        componentStore.$reset()
        componentStore.currentComponentTree.push(currentPage.value.sourceContent)
        if (currentPage.value.currentSelectedComponentId) {
            componentStore.setCurrentSelectedComponentById(currentPage.value.currentSelectedComponentId)
        }
    }

    function getPageLength() {
        return pages.value.length
    }

    /**
     * 加载页面
     * @param params
     * @return promise
     */
    function loadPage(params: object): Promise<any> {
        console.log('loadPage from server by params:', params)
        return entityApi.query('platform_app_page', 'id,extendId,code,sourceContent,description', params, false)
    }

    /**
     * 关闭页面
     * @param index
     */
    function closePage(index: number) {
        if (pages.value.length > index) {
            pages.value.splice(index, 1)
        }
        if (index <= currentPageIndex.value) {
            let toIndex = index - 1
            if (index - 1 < 0 && pages.value.length > 0) {
                toIndex = 0
            }
            switchToPage(toIndex)
        }
    }

    /**
     * 保存当前的页面到后台服务中
     */
    function saveCurrentPage() {

        function convertToRelease(sourceContent: object) {
            // TODO 待做代码压缩，去掉设计时的或可默认的属性
            return sourceContent
        }

        function convertToPreview(sourceContent: object) {
            return sourceContent
        }

        entityApi.save('platform_app_page', {
            id: currentPage.value.id,
            appId: currentPage.value.appId,
            extendId: currentPage.value.extendId,
            code: currentPage.value.code,
            type: 'GlPageLayout',
            sourceContent: JSON.stringify(currentPage.value.sourceContent),
            releaseContent: JSON.stringify(convertToRelease(currentPage.value.sourceContent)),
            previewContent: JSON.stringify(convertToPreview(currentPage.value.sourceContent)),
            description: currentPage.value.description
        }).then((res) => {
            currentPage.value.id = res.data.data
        })
    }

    function setCurrentSourceContent(content: object) {
        currentPage.value.sourceContent = content
    }

    return {
        addPageTemplate,
        getPageTemplate,
        pages,
        currentPageIndex,
        currentPage,
        addPage,
        closePage,
        findPageById,
        findPageByExtendId,
        switchToPage,
        setCurrentSourceContent,
        saveCurrentPage,
        loadPage
    }
})

// let pageTemplates: { [key: string]: any } = {formPage: ''}
// pageTemplates.freePage = {
//     componentName: 'GlPage',
//     id: utils.gid('GlPage'),
//     props: {},
//     slots: {},
//     children: [{
//         componentName: 'GlDndPlaceholder',
//         id: utils.gid('pHolder'),
//         props: {
//             info: undefined
//         },
//         slots: {},
//         children: [],
//         actions: []
//     }
//     ],
//     actions: []
// }
// pageTemplates.formPage = {
//     "componentName": "GlPage",
//     "id": utils.gid('page'),
//     "props": {},
//     "slots": {},
//     "children": [{
//         "id": utils.gid('form'),
//         "componentName": "GlEntityForm",
//         "title": "实体表单",
//         "props": {
//             "title": "实体表单",
//             "layout": "vertical",
//             "autoLabelWidth": true
//         },
//         "slots": {},
//         "children": [{
//             "id": utils.gid('card'),
//             "componentName": "GlCard",
//             "title": "卡片",
//             "props": {"title": "卡片", "bordered": false},
//             "slots": {},
//             "children": [
//                 {
//                     "id": utils.gid('rc'),
//                     "componentName": "GlRowColLayout",
//                     "title": "栅格布局",
//                     "props": {"title": "栅格布局", "spans": [8, 8, 8]},
//                     "slots": {},
//                     "children": [{
//                         "id": utils.gid('virtual'),
//                         "componentName": "GlVirtual",
//                         "title": "项",
//                         "props": {},
//                         "slots": {},
//                         "children": [{
//                             "id": utils.gid('ph'),
//                             "componentName": "GlDndPlaceholder",
//                             "title": "占位符",
//                             "props": {},
//                             "slots": {},
//                             "children": []
//                         }]
//                     }, {
//                         "id": utils.gid('virtual_'),
//                         "componentName": "GlVirtual",
//                         "title": "项",
//                         "props": {},
//                         "slots": {},
//                         "children": [{
//                             "id": utils.gid('ph'),
//                             "componentName": "GlDndPlaceholder",
//                             "title": "占位符",
//                             "props": {},
//                             "slots": {},
//                             "children": []
//                         }]
//                     }, {
//                         "id": utils.gid('virtual_'),
//                         "componentName": "GlVirtual",
//                         "title": "项",
//                         "props": {},
//                         "slots": {},
//                         "children": [{
//                             "id": utils.gid('ph'),
//                             "componentName": "GlDndPlaceholder",
//                             "title": "占位符",
//                             "props": {},
//                             "slots": {},
//                             "children": []
//                         }]
//                     }],
//                     "style": {}
//                 }],
//             "style": {},
//
//         }]
//
//     }],
//     "actions": []
// }
// pageTemplates.listPage = pageTemplates.freePage
// /**
//  *  创建新页面时，默认的页面根实例数据
//  */
// export const getPageTemplate = (pageType: string): ComponentInstance => {
//     return JSON.parse(JSON.stringify(pageTemplates[pageType]))
// }

