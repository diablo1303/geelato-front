export default interface Toolbar {
    leftColSpan?: number;
    centerColSpan?: number;
    rightColSpan?: number;
    leftItems?: [];
    centerItems?: [];
    rightItems?: [];
}

const defaultToolbar: Toolbar = {};
export {defaultToolbar};
