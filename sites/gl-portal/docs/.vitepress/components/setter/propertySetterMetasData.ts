import {IPropertySetterMeta} from "@geelato/gl-ui-schema";

export const propertySetterMetasData: Array<IPropertySetterMeta> = [
    {
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: "value",
        name: "type",
        title: "类型",
        group: "基础信息",
        show: true,
        setterComponentName: "ARadioGroup",
        setterComponentProps: {
            optionType: 'button',
            options: [
                {label: 'primary', value: 'primary'}, {label: 'ghost', value: 'ghost'}, {
                    label: 'dashed',
                    value: 'dashed'
                }, {label: 'link', value: 'link'}, {label: 'text', value: 'default'}
            ]
        },
    }, {
        type: 'slots',
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: "modelValue",
        name: "icon",
        title: "文字|图标",
        group: "基础信息",
        show: true,
        setterComponentName: "GlIconfontSetterForSlot",
        setterComponentProps: {
            description: ""
        },
    }, {
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: "value",
        name: "size",
        title: "按钮大小",
        group: "基础信息",
        show: true,
        setterComponentName: "ASelect",
        setterComponentProps: {
            options: [
                {label: '大', value: 'large'}, {label: '中', value: 'middle'}, {label: '小', value: 'small'}
            ]
        },
        description: "按钮大小"
    }, {
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: "checked",
        name: "disabled",
        title: "是否失效",
        group: "基础信息",
        show: true,
        setterComponentName: "ASwitch",
        setterComponentProps: {},
        description: "按钮失效状态"
    }, {
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: "checked",
        name: "loading",
        type: "props",
        title: "载入状态",
        group: "基础信息",
        show: true,
        setterComponentName: "GlSimpleObjectSetter",
        setterComponentProps: {},
        description: "设置按钮载入状态",
        properties: [{
            expanded: true,
            placeholder: "",
            style: undefined,
            setterComponentVModelName: "value",
            name: "delay",
            title: "延迟时间",
            group: "基础信息",
            show: true,
            setterComponentName: "AInputNumber",
            setterComponentProps: {},
            description: "设置按钮载入状态延迟时间"
        }]
    }]
export default {}
