import type Panel from "./Panel";

export default class GlPlugin {

    name: string = ''
    sidebar: Array<Panel> = []
    stage: Array<Panel> = []
    setter: Array<Panel> = []

    constructor(name: string) {
        this.name = name
    }

    getPanels(panelType: string) {
        switch (panelType) {
            case 'sidebar':
                return this.sidebar;
            case 'stage':
                return this.stage;
            case 'setter':
                return this.setter
        }
    }
}
