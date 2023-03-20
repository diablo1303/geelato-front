import {defineStore} from 'pinia'
import Page from "../entity/Page";
import {entityApi} from "@geelato/gl-ui";
import {ref} from "vue";

export const usePageStore = defineStore('GlPageStore', () => {
    /**
     *  最大的页面数
     */
    const maxPage = ref(20)
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

    function addPage(page: Page) {
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
        console.log('setCurrentPageIndex:', index)
        currentPageIndex.value = index
        currentPage.value = pages.value[index]
    }

    function getPageLength() {
        return pages.value.length
    }

    /**
     * 加载页面
     * @param params
     * @return promise
     */
    function loadPage(params: object) :Promise<any>{
        return entityApi.query('platform_app_page', 'id,extendId,code,sourceContent,description', params, false)
    }

    /**
     * 保存当前的页面到后台服务中
     */
    function saveCurrentPage() {
        entityApi.save('platform_app_page', {
            id: currentPage.value.id,
            extendId: currentPage.value.extendId,
            code: currentPage.value.code,
            sourceContent: JSON.stringify(currentPage.value.sourceContent),
            releaseContent: JSON.stringify(currentPage.value.releaseContent),
            previewContent: JSON.stringify(currentPage.value.previewContent),
            description: currentPage.value.description
        }).then((res) => {
            currentPage.value.id = res.data.data
        })
    }

    return {
        pages,
        currentPageIndex,
        addPage,
        findPageById,
        findPageByExtendId,
        switchToPage,
        saveCurrentPage,
        loadPage
    }
})