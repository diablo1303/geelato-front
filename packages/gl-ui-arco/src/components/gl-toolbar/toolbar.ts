export interface ComponentMeta {
    id: string;
    component: {
        componentName: string;
        props: object;
        slots?: object;
        style?: object;
    }
}

export interface Toolbar {
    leftColSpan?: number;
    centerColSpan?: number;
    rightColSpan?: number;
    leftItems?: [];
    centerItems?: [];
    rightItems?: [];
}

const defaultToolbar: Toolbar = {};
export {defaultToolbar};
