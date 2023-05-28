import type {ComponentInstance} from "@geelato/gl-ui-schema";

export default class QueryItem {
    id: string = '';
    title: string = "";
    name: string = "";
    colspan: number = 6;
    // 操作
    cop: string = 'eq';
    // 是否在高级查询中展示
    isAdvanceQuery: boolean = false;
    // 是否隐藏，不展示的场景示例：作为默认内置的查询条件
    isHidden: boolean = false
    component: ComponentInstance | undefined = undefined
}