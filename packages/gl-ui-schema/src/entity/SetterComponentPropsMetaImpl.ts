export default interface SetterComponentPropsMeta {
    // 配置的数据内容
    dataItems?: Array<any>
    [key: string]: any;
}

export class SetterComponentPropsMetaImpl implements SetterComponentPropsMeta {
    dataItems?: Array<any> = [];

    [key: string]: any;
}
