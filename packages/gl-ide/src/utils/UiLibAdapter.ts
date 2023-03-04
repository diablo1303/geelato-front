import {useIdeStore} from "../stores/UseIdeStore";

export class UiLibAdapter {

    uiLibName = ""

    constructor() {

    }

    getTabSlotName = () => {
        switch (this.getUiLibName()) {
            case 'arco':
                return 'title'
            case 'ant':
                return 'tab'
        }
        return ''
    }
    getUiLibName = () => {
        if (!this.uiLibName) {
            const ideStore = useIdeStore()
            this.uiLibName = ideStore.getUiLibName()
        }
        return this.uiLibName;
    }

}

const uiLibAdapter: UiLibAdapter = new UiLibAdapter()
export default uiLibAdapter

