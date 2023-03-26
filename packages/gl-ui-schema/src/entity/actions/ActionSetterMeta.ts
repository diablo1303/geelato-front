export default interface IActionSetterMeta {
    // 属性名
    name: String

    // 属性标题
    title: String

    // 属性描述，用于在配置属性时，可以了解该属性的详细信息
    description?: String

}

export class ActionSetterMeta implements IActionSetterMeta {
    description?: String;
    name: String = 'action';
    title: String = '动作';
}
