import {IPropertySetterMeta} from "@geelato/gl-ui-schema";

export const propertySetterMetasData: Array<IPropertySetterMeta> = [
    {
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: "value",
        name: "type",
        title: "步骤条类型",
        group: "基础信息",
        show: true,
        setterComponentName: "ARadioGroup",
        setterComponentProps: {
            optionType: 'button',
            options: [{label: '默认', value: 'default'}, {label: '导航', value: 'navigation'}]
        },
        defaultValue: 'default'
    }, {
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: "value",
        name: "size",
        title: "大小",
        group: "基础信息",
        show: true,
        setterComponentName: "ARadioGroup",
        setterComponentProps: {
            optionType: 'button',
            options: [{label: '默认', value: 'default'}, {label: '小', value: 'small'}]
        },
        defaultValue: 'default'
    }, {
        expanded: true,
        placeholder: "",
        style: undefined,
        setterComponentVModelName: "value",
        name: "current",
        title: "当前步骤",
        group: "基础信息",
        show: true,
        setterComponentName: "AInputNumber",
        setterComponentProps: {},
        description: "指定当前步骤，从 0 开始记数"
    }, {
        expanded: true,
        placeholder: "",
        style: undefined,
        type: 'children',
        setterComponentVModelName: undefined,
        name: "steps",
        title: "步骤项",
        group: "基础信息",
        show: true,
        setterComponentName: "GlChildrenComponentSetter",
        setterComponentProps: {ChildComponentName: 'AStep', maxCount: 0}, //  count为0 表示不限
        description: "设置子组件",
        properties: [{
            expanded: true,
            placeholder: "",
            style: undefined,
            setterComponentVModelName: "value",
            name: "title",
            title: "标题",
            group: "基础信息",
            show: true,
            setterComponentName: "AInput",
            setterComponentProps: {},
            description: ""
        }, {
            expanded: true,
            placeholder: "",
            style: undefined,
            setterComponentVModelName: "value",
            name: "subTitle",
            title: "子标题",
            group: "基础信息",
            show: true,
            setterComponentName: "AInput",
            setterComponentProps: {},
            description: ""
        }, {
            expanded: true,
            placeholder: "",
            style: undefined,
            setterComponentVModelName: "value",
            name: "description",
            title: "描述",
            group: "基础信息",
            show: true,
            setterComponentName: "AInput",
            setterComponentProps: {},
            description: ""
        }]
    }
]


export const componentMeta = {
    componentName: 'ASteps',
    componentRefName: 'ASteps',
    displayMode: 'Tile',
    group: 'base',
    useBy: ['page'],
    properties: propertySetterMetasData
}

export const componentInstance = {
    "componentName": "ASteps",
    "id": "aBtn_NqW4RONO4n2",
    "templateId": "Dfl0TDrcD0itS6iT",
    "title": "步骤条",
    "group": "form",
    "props": {"current": 0},
    "children": {
        "steps": [
            {
                "componentName": "AStep",
                "id": "aBtn_NqW4RONO4n2",
                "templateId": "Dfl0TDrcD0itS6iT",
                "title": "步骤",
                "group": "form",
                "props": {"title": "Finished", "description": "This is a description."},
            },
            {
                "componentName": "AStep",
                "id": "aBtn_NqW4RONO442",
                "templateId": "Dfl0TDrcD0itS6iT",
                "title": "步骤",
                "group": "form",
                "props": {"title": "In Progress", "subTitle": "Left 00:00:08", "description": "This is a description."},
            },
            {
                "componentName": "AStep",
                "id": "aBtn_NqW43ONO442",
                "templateId": "Dfl0TDrcD0itS6iT",
                "title": "步骤",
                "group": "form",
                "props": {"title": "Waiting", "description": "This is a description."},
            }
        ]
    }
}

export default {}
