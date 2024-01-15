import type Panel from './Panel'

export default class GlPlugin {
  name: string = ''
  sidebar: Array<Panel> = []
  stage: Array<Panel> = []
  setter: Array<Panel> = []
  // 页面类型与设置面板的映射，key为pageType如flowPage
  pageTypeSetterPanelNameMap: Record<string, string[]> = {}

  constructor(name: string) {
    this.name = name
  }

  getPanels(panelType: string) {
    switch (panelType) {
      case 'sidebar':
        return this.sidebar
      case 'stage':
        return this.stage
      case 'setter':
        return this.setter
    }
  }

  pushPageTypeAndSetterPanelNames(pageType: string, panelNames: string[]) {
    this.pageTypeSetterPanelNameMap[pageType] = panelNames
  }

  getSetterPanelNamesByPageType(pageType: string) {
    return this.pageTypeSetterPanelNameMap[pageType] || []
  }
}
