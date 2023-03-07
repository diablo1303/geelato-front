import {IPropertySetterMeta} from "@geelato/gl-ui-schema";

export const propertySetterMetasData: Array<IPropertySetterMeta> = [
    {
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: 'value',
        name: "text",
        title: "标题",
        group: "基础信息",
        show: true,
        setterComponentName: "AInput",
        setterComponentProps: {},
        description: ""
    },
    {
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: 'value',
        name: "mode",
        title: "风格模式",
        group: "基础信息",
        show: true,
        setterComponentName: "ARadioGroup",
        setterComponentProps: {
            optionType: 'button',
            options: [{label: '文本模式', value: 'link'}, {label: '按钮模式', value: 'button'}]
        },
        description: ""
    },
    {
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: undefined,
        name: "items",
        title: "菜单项",
        group: "基础信息",
        show: true,
        setterComponentName: "GlJsonArraySetter",
        setterComponentProps: {maxCount: 0},
        description: "",
        properties: [
            {
                expanded: true,
                placeholder: "",
                style: undefined,
                setterComponentVModelName: 'value',
                name: "title",
                title: "标题",
                group: "基础信息",
                show: true,
                setterComponentName: "AInput",
                setterComponentProps: {},
                description: ""
            },
            {
                expanded: true,
                placeholder: "",
                style: undefined,
                setterComponentVModelName: 'value',
                name: "href",
                title: "链接",
                group: "基础信息",
                show: true,
                setterComponentName: "AInput",
                setterComponentProps: {},
                description: ""
            },
             {
                expanded: true,
                placeholder: "",
                style: undefined,
                setterComponentVModelName: 'value',
                name: "disabled",
                title: "是否禁用",
                group: "基础信息",
                show: true,
                setterComponentName: "ARadioGroup",
                setterComponentProps: {
                    optionType: 'button',
                    options: [{label: '是', value: true}, {label: '否', value: false}]
                },
                description: ""
            },
            {
                expanded: true,
                placeholder: "",
                style: undefined,
                setterComponentVModelName: undefined,
                name: "items",
                title: "子菜单",
                group: "基础信息",
                show: true,
                setterComponentName: "GlJsonArraySetter",
                setterComponentProps: {maxCount: 0},
                description: "",
                properties: [
                    {
                        expanded: true,
                        placeholder: "",
                        style: undefined,
                        setterComponentVModelName: 'value',
                        name: "title",
                        title: "标题",
                        group: "基础信息",
                        show: true,
                        setterComponentName: "AInput",
                        setterComponentProps: {},
                        description: ""
                    },
                    {
                        expanded: true,
                        placeholder: "",
                        style: undefined,
                        setterComponentVModelName: 'value',
                        name: "href",
                        title: "链接",
                        group: "基础信息",
                        show: true,
                        setterComponentName: "AInput",
                        setterComponentProps: {},
                        description: ""
                    },
                    {
                        expanded: true,
                        placeholder: "",
                        style: undefined,
                        setterComponentVModelName: 'value',
                        name: "disabled",
                        title: "是否禁用",
                        group: "基础信息",
                        show: true,
                        setterComponentName: "ARadioGroup",
                        setterComponentProps: {
                            optionType: 'button',
                            options: [{label: '是', value: true}, {label: '否', value: false}]
                        },
                        description: ""
                    }
                ]
            },
        ]
    }
]


export const componentMeta = {
    componentName: 'GlDropdown',
    componentRefName: 'GlDropdown',
    displayMode: 'Tile',
    group: 'base',
    useBy: ['page'],
    properties: propertySetterMetasData
}

export const componentInstance = {
    "componentName": "GlDropdown",
    "id": "aBtn_Nqv4RONO4n2",
    "templateId": "Dfl0TDrcD0isS6iT",
    "title": "下拉菜单",
    "group": "form",
    "props": {
        "text": "Hover me",
        "items": []
    },
    "children": {}
}

export default {}
