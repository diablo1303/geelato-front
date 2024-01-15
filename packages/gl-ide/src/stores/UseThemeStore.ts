import {defineStore} from 'pinia'
import {CheckUtil} from "@geelato/gl-ui";

const sidebarTabWidthDefault = 24


export const useThemeStore = defineStore({
    id: 'GlThemeStore',
    state: () => ({
        theme: {background: 'rgb(238, 238, 238)'},
        ideHeight: 0,
        // ideMainHeight: 0,
        ideWidth: 0,
        toolbarHeight: 34,
        toolbarWidth: 0,
        // sidebarHeight: 0,
        sidebarWidth: 280,
        sidebarTabWidth: sidebarTabWidthDefault * 2,
        // stageHeight: 0,
        stageWidth: 0,
        stageBreadcrumbHeight: 32,
        // setterHeight: 0,
        setterWidth: 420,
        statusHeight: 0,
        statusWidth: 0,
        panelPadding: 4,
        // modal*用于模态窗口脚本编辑器
        // 默认弹框的头部高度 48+1+1
        modalHeaderHeight: 50,
        // 全屏弹窗的内容高度
        // modalBodyHeight: 0,
        // 默认弹框的脚高度  padding上下合计16
        modalFooterHeight: 70
    }),
    getters: {
        ideMainHeight: (state) => state.ideHeight - state.toolbarHeight - state.statusHeight -8,
        sidebarHeight: (state) => state.ideHeight - state.toolbarHeight - state.statusHeight -8,
        stageHeight: (state) => state.ideHeight - state.toolbarHeight - state.statusHeight -8,
        setterHeight: (state) => state.ideHeight - state.toolbarHeight - state.statusHeight -8,
        sidebarsWidthPercent: (state) => state.sidebarWidth / state.ideWidth * 100,
        sidebarTabWidthPercent: (state) => state.sidebarTabWidth / state.ideWidth * 100,
        sidebarTabFontSize: (state) => state.sidebarTabWidth / sidebarTabWidthDefault >= 1.5 ? 1.5 : 1,
        // 4px 为调节宽度，将面板的内容小一些，以便能放入sidebar内
        sidebarRightPanelWidth: (state) => state.sidebarWidth - state.sidebarTabWidth - state.panelPadding * 2 - 4,
        stageWidthPercent: (state) => (state.ideWidth - state.sidebarWidth - state.setterWidth) / state.ideWidth * 100,
        setterWidthPercent: (state) => state.setterWidth / state.ideWidth * 100,
        modalBodyHeight: (state) => state.ideHeight - state.modalHeaderHeight - state.modalFooterHeight,
    },
    actions: {
        /**
         *  window 窗口调整
         */
        resize() {
            if (CheckUtil.isBrowser()) {
                if (typeof window !== 'undefined') {
                    this.ideHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
                    this.ideWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                }
            }
        }
    }
})