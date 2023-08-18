export const setterSelectOptions = [
    {name: 'GlEmpty', label: '空（不需配置）', vModelName: 'modelValue', type: 'String'},
    {name: 'AInput', label: '单行输入', vModelName: 'modelValue', type: 'String'},
    {name: 'GlInputSetter', label: '单行输入（支持表达式）', vModelName: 'modelValue', type: 'Object | String'},
    {name: 'AInputNumber', label: '数值', vModelName: 'modelValue', type: 'Number'},
    {
        name: 'ASwitch',
        label: '开关(是/否)',
        vModelName: 'modelValue',
        type: 'Boolean',
        propsSetter: 'SwitchPropsBuilder'
    },
    {
        name: 'ARadioGroup',
        label: '单选(Radio)',
        vModelName: 'modelValue',
        type: 'String',
        propsSetter: 'GlRadioGroupSetter'
    },
    {
        name: 'GlOptionsSetter',
        label: '下拉选项配置器（静态）',
        vModelName: 'modelValue',
        type: 'String'
    }, {
        name: 'GlDynamicSelect',
        label: '下拉选项配置器(动态实体)',
        vModelName: 'modelValue',
        type: 'Object',
        propsSetter: 'GlOptionsDynamicBuilder'
    },
    {
        name: 'ASelect',
        label: '下拉选项(单选|多选)',
        vModelName: 'modelValue',
        type: 'String',
        propsSetter: 'GlSelectSetter'
    },
    {
        name: 'GlExpressionSetter',
        label: '表达式配置器',
        vModelName: 'modelValue',
        type: 'String',
        propsSetter: 'GlExpressionBuilder'
    },
    {name: 'GlIconfontSelect', label: '图标选择器', vModelName: 'modelValue', type: 'Object'},
    {name: 'GlIconfontTextSetter', label: '图标文字选择器', vModelName: 'modelValue', type: 'Object'},
    // {name: 'GlIconfontSetterForSlot', label: '图标选择器（用于插槽）', vModelName: 'modelValue', type: 'String'},
    {name: 'GlHtmlSetterForSlot', label: 'Html设置（用于插槽）', vModelName: 'modelValue', type: 'String'},
    {name: 'GlValidateRulesSetter', label: '字段验证规则配置器', vModelName: 'modelValue', type: 'Object'},
    {
        name: 'GlEntityReaderSetter',
        label: '实体数据源（Reader）配置器',
        vModelName: 'modelValue',
        type: 'Object',
        propsSetter: 'GlEntityReaderBuilder'
    },
    {name: 'GlAppEntitySelect', label: '应用实体对象选择器', vModelName: 'modelValue', type: 'Object'},
    {name: 'GlEntityFieldSelect', label: '实体字段对象选择器', vModelName: 'modelValue', type: 'Object'},
    {name: 'GlEntitySelect', label: '实体名称选择器', vModelName: 'modelValue', type: 'String'},
    {name: 'GlFieldSelect', label: '字段名称选择器', vModelName: 'modelValue', type: 'String'},
    {name: 'GlUserSelect', label: '用户选择器', vModelName: 'modelValue', type: 'String'},
    {name: 'GlGroupSelect', label: '组织选择器', vModelName: 'modelValue', type: 'String'},
    {name: 'GlValueTypes', label: '值类型选择器', vModelName: 'modelValue', type: 'String'},
    {name: 'GlCompareValueSetter', label: '值选择器', vModelName: 'modelValue', type: 'String'},
    {name: 'GlJson', label: 'Json编辑器', vModelName: 'modelValue', type: 'String'},
    {name: 'GlColor', label: '颜色选择器', vModelName: 'modelValue', type: 'String'},
    {name: 'GlPageSelect', label: '应用内的页面选择器', vModelName: 'modelValue', type: 'String'},
    {
        name: 'GlPageComponentSelect',
        label: '页面内的组件选择器',
        vModelName: 'modelValue',
        type: 'String',
        propsSetter: 'GlPageComponentSelectBuilder'
    },
    {name: 'GlComponentSelect', label: '组件选择器', vModelName: 'modelValue', type: 'String'},
    {name: 'GlSubComponentSetter', label: '子组件设置', vModelName: 'modelValue', type: 'String'},
    {name: 'GlComponentMethodSelect', label: '组件方法选择器', vModelName: 'modelValue', type: 'String'},
    {name: 'GlComponentActionSelect', label: '组件动作事件选择器', vModelName: 'modelValue', type: 'String'},
    {
        name: 'GlArrayNumberSetter',
        label: '数组-数值类 [1,2,3...]',
        vModelName: 'modelValue',
        type: 'String',
        propsSetter: 'GlArrayNumberBuilder'
    },
    {name: 'GlArrayStringSetter', label: '数组-字符串类 ["a","b"...]', vModelName: 'modelValue', type: 'String'},
    {name: 'GlArrayBooleanSetter', label: '数组-布尔类 [true,false...]', vModelName: 'modelValue', type: 'String'},
    {
        name: 'GlArrayComponentSetter',
        label: '数组-组件类 [{componentName,props,slots...}...]',
        vModelName: 'modelValue',
        type: 'String'
    }
]