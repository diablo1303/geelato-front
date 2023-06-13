export enum ValueTypes {
    String = 'String',
    Boolean = 'Boolean',
    Express = 'Express',
    Number = 'Number',
    Array = 'Array',
    Object = 'Object',
    Dict = 'Dict',
}

export const useValueTypeOptions = () => {
    return [
        {"label": "字符串", "value": ValueTypes.String},
        {"label": "布尔", "value": ValueTypes.Boolean},
        {"label": "表达式", "value": ValueTypes.Express},
        {"label": "数值", "value": ValueTypes.Number},
        {"label": "数组", "value": ValueTypes.Array},
        {"label": "对象", "value": ValueTypes.Object},
        {"label": "字典值", "value": ValueTypes.Dict}
    ]
}