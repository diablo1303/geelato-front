import type {StyleSetterMeta} from "./StyleSetterMeta";

export default interface SetterComponentPropsMeta {
    // 配置的数据内容
    dataItems?: Array<any>
}

export class SetterComponentPropsMetaImpl implements SetterComponentPropsMeta {
    dataItems?: Array<any> = []
}
