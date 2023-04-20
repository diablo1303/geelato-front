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
        // 在切换页面时，记录原页面当前选中的组件
        currentPage.value.currentSelectedComponentId = componentStore.currentSelectedComponentId
        currentPageIndex.value = Number.parseInt(index+'')
        currentPage.value = pages.value[index]
        // 切换页面之后，重置页面组件状态，并重新选中页面记录的已选组件
        componentStore.$reset()
        componentStore.currentComponentTree.push(currentPage.value.sourceContent)
        if (currentPage.value.currentSelectedComponentId) {
            componentStore.setCurrentSelectedComponentById(currentPage.value.currentSelectedComponentId)
        }
        console.log('switchToPage index:', index, 'currentPage:', currentPage.value,'componentStore:',componentStore)
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
            currentPageIndex.value -= 1
        }
    }

    /**
     * 保存当前的页面到后台服务中
     */
    function saveCurrentPage() {
        entityApi.save('platform_app_page', {
            id: currentPage.value.id,
            appId: currentPage.value.appId,
            extendId: currentPage.value.extendId,
            code: currentPage.value.code,
            type: 'GlPageLayout',
            sourceContent: JSON.stringify(currentPage.value.sourceContent),
            releaseContent: JSON.stringify(currentPage.value.releaseContent),
            previewContent: JSON.stringify(currentPage.value.previewContent),
            description: currentPage.value.description
        }).then((res) => {
            currentPage.value.id = res.data.data
        })
    }

    function setCurrentSourceContent(content: object) {
        currentPage.value.sourceContent = content
    }

    return {
        pages,
        currentPageIndex,
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

/**
 *  创建新页面时，默认的页面根实例数据
 */
export const defaultPageRoot: ComponentInstance = {
    componentName: 'GlPage',
    id: utils.gid('GlPage'),
    props: {},
    slots: {},
    children: [{
        componentName: 'GlDndPlaceholder',
        id: utils.gid('pHolder'),
        props: {
            info: undefined
        },
        slots: {},
        children: [],
        actions: []
    }
    ],
    actions: []
}