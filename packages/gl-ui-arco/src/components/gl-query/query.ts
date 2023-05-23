import type {ComponentInstance} from "@geelato/gl-ui-schema";

export default class QueryItem {
    id: string = '';
    title: string = "";
    name: string = "";
    colspan: number = 6;
    // 操作
    cop: string = 'eq';
    isAdvanceQuery: boolean = false;
    component: ComponentInstance | undefined = undefined
}