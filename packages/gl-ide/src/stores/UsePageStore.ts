import {defineStore} from 'pinia'
import Page from "../entity/Page";

export const usePageStore = defineStore({
    id: 'GlPageStore',
    state: () => ({
        /**
         *  最大的页面数
         */
        maxPage: 20,
        /**
         *  当前打开激活的页面
         */
        currentPage: <Page>new Page(),
        /**
         *  当前打开激活的页面索引
         */
        currentPageIndex: -1,
        /**
         *  打开的页面集
         */
        pages: <Array<Page>>[]
    }),
    actions: {
        addPage(page: Page) {
            this.pages.push(page)
        },
        /**
         * 从打开的页面集中查找
         * @param id
         * @return e.g. {page: null, index: -1}
         */
        findPage(id: string) {
            for (let index in this.pages) {
                if (this.pages[index].id === id) {
                    return {page: this.pages[index], index: index}
                }
            }
            return {page: <Page>new Page(), index: -1}
        },
        setCurrentPage(page: Page) {
            this.currentPage = page
        },
        setCurrentPageIndex(index: number) {
            console.log('setCurrentPageIndex:',index)
            this.currentPageIndex = index
        }
    }
})