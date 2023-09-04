export default interface Toolbar {
    leftColSpan?: number;
    centerColSpan?: number;
    rightColSpan?: number;
    leftItems?: [];
    centerItems?: [];
    rightItems?: [];
}

const defaultToolbar: Toolbar = {
    leftColSpan: 12,
    centerColSpan: 0,
    rightColSpan: 12,
    leftItems: [],
    centerItems: [],
    rightItems: []
};
export {defaultToolbar};
