/**
 *   属性配置器管理器
 */
export default class PropertySetterManager {

    defaultSetters: Array<Object> = []

    constructor() {
        this.defaultSetters = [
            {label: '单行字符输入', value: 'AInput'},
            {label: '数值', value: 'ANumber'},
            {label: '开关', value: 'AInput'},
            {label: '单选项', value: 'ARadioGroup'},
            {label: '下拉选项', value: 'ASelect'},
            {label: '多行字符输入', value: 'ATextarea'},
            {label: 'Html编辑器', value: 'GlSetterHtml'},
            {label: 'Json编辑器', value: 'GlSetterJson'},
            {label: '图标选择器', value: 'GlSetterColor'},
            {label: '颜色选择器', value: 'GlSetterColor'},
            {label: '自定义设置器', value: 'GlSetterCustom'}
        ]
    }

    register(name: String, value: String) {
        this.defaultSetters.push({label: name, value: value})
    }

    unregister(name: String) {
        // TODO
    }

    getSetters() {
        return JSON.parse(JSON.stringify(this.defaultSetters))
    }

}
let propertySetterManager = new PropertySetterManager()

export {propertySetterManager}
