import type { MethodMeta } from '@geelato/gl-ui-schema'
import { type ParamMeta, ReturnInfoMeta } from '@geelato/gl-ui-schema'

export const commonPropsDataEntry = [
  {
    name: '_valueExpression',
    setterComponentProps: { showInput: true },
    setterComponentVModelName: 'modelValue',
    group: 'base',
    type: 'props',
    show: true,
    expanded: true,
    title: '默认值',
    setterComponentName: 'AInput',
    enableValueExpress: true,
    description: '基于表达式计算默认值'
  },
  {
    name: '_labelColFlex',
    group: 'base',
    type: 'props',
    enableValueExpress: false,
    show: true,
    expanded: true,
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    title: '标题宽度',
    setterComponentName: 'AInput',
    description: '标题的宽度，默认的标题占比20%（精确值应为20.83%，这里需填整数去掉.83）',
    placeholder: '如：6% 或 100px'
  },
  {
    name: 'placeholder',
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    group: 'base',
    type: 'props',
    show: true,
    expanded: true,
    title: '占位提示',
    setterComponentName: 'AInput',
    enableValueExpress: true
  },
  {
    name: 'description',
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    group: 'base',
    type: 'props',
    show: true,
    expanded: true,
    title: '描述',
    setterComponentName: 'AInput',
    enableValueExpress: true
  },
  {
    name: 'readonly',
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    group: 'base',
    type: 'props',
    show: true,
    expanded: true,
    title: '只读',
    setterComponentName: 'ASwitch',
    enableValueExpress: true
  },
  {
    name: 'disabled',
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    group: 'base',
    type: 'props',
    description: '是否禁用状态，默认为 false',
    title: '禁用',
    setterComponentName: 'ASwitch',
    show: true,
    expanded: true,
    enableValueExpress: true
  },
  {
    name: '_hidden',
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    group: 'base',
    type: 'props',
    show: true,
    expanded: true,
    title: '隐藏',
    description: '页面中存在该组件，只是不可见',
    setterComponentName: 'ASwitch',
    enableValueExpress: true
  },
  {
    name: 'unRender',
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    group: 'base',
    type: 'props',
    show: true,
    expanded: true,
    title: '不渲染',
    description: '页面中不存在该组件，不渲染，不可见，一般是为了提高性能在一些场景下不渲染。',
    setterComponentName: 'ASwitch',
    enableValueExpress: true
  },
  {
    name: 'rules',
    group: 'base',
    type: 'props',
    show: true,
    expanded: true,
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    title: '验证规则',
    setterComponentName: 'GlValidateRulesSetter'
  }
]

export const commonPropsOther = [
  {
    name: 'disabled',
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    group: 'base',
    type: 'props',
    description: '是否禁用状态，默认为 false',
    title: '禁用',
    setterComponentName: 'ASwitch',
    show: true,
    expanded: true
  },
  {
    name: '_hidden',
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    group: 'base',
    type: 'props',
    show: true,
    expanded: true,
    title: '隐藏',
    description: '页面中存在该组件，只是不可见',
    setterComponentName: 'ASwitch',
    enableValueExpress: true
  },
  {
    name: 'unRender',
    setterComponentProps: {},
    setterComponentVModelName: 'modelValue',
    group: 'base',
    type: 'props',
    show: true,
    expanded: true,
    title: '不渲染',
    description: '页面中不存在该组件，不渲染，不可见，一般是为了提高性能在一些场景下不渲染。',
    setterComponentName: 'ASwitch',
    enableValueExpress: true
  }
]

export const commonActions = [
  {
    eventName: 'onMounted',
    name: 'onMounted',
    description: '组件加载完时触发，和Vue的onMounted一致',
    title: '加载完'
  },
  {
    eventName: 'onUpdated',
    name: 'onUpdated',
    description: '组件更新时触发，和Vue的onUpdated一致',
    title: '更新完'
  }
]

export const commonMethods: MethodMeta[] = [
  {
    async: false,
    name: '_getValue',
    title: '获取组件值',
    description: '获取通过_getValue获取组件的值',
    params: [],
    defaultValue: undefined,
    returnInfo: {
      returnType: 'any',
      description: '获取通过_getValue获取组件的值。'
    }
  },
  {
    async: false,
    name: '_setValue',
    title: '设置组件值',
    description: '设置组件值',
    params: [
      {
        name: 'value',
        type: 'string',
        title: '变量名',
        required: true,
        description: ''
      }
    ],
    defaultValue: undefined,
    returnInfo: {
      returnType: 'void',
      description: '设置组件值。'
    }
  },
  {
    async: false,
    name: '_reRender',
    title: '重新渲染组件',
    description: '重新渲染组件，基于nextTick。',
    params: [
      // {
      //   name: 'props',
      //   type: 'object',
      //   title: '属性值',
      //   required: false,
      //   description: '设置组件的新props值，将合并到组件已有的props中。'
      // }
    ],
    defaultValue: undefined,
    returnInfo: {
      returnType: 'void',
      description:
        '重新渲染组件，注意对于组件外部传入的参数并不会重新计算，因为它们不属于本组件的内容，若需重新计算，需重新渲染组件该组件的上一层组件。例如：本组件为页面组件A，在属性面板中设置了参数form.id值为另一个列表的当前选中值，若需要本组件的页面依据列表的当前当中值变化，则需要调用页面组件A的上一级组件进行重新渲染。'
    }
  },
  {
    async: false,
    name: '_setVar',
    title: '设置组件变量',
    description: '设置组件的临时变量，在组件刷新时或_reRender时会丢失',
    params: [
      {
        name: 'name',
        type: 'string',
        title: '变量名',
        required: true,
        description: ''
      },
      {
        name: 'value',
        type: 'any',
        title: '变量值',
        required: true,
        description: ''
      }
    ],
    defaultValue: undefined,
    returnInfo: {
      returnType: 'void',
      description: '设置组件的临时变量，在组件刷新时或_reRender时会丢失。'
    }
  },
  {
    async: false,
    name: '_getVar',
    title: '获取组件变量',
    description: '获取通过_setVar设置的组件临时变量值',
    params: [
      {
        name: 'name',
        type: 'string',
        title: '变量名',
        required: true,
        description: ''
      }
    ],
    defaultValue: undefined,
    returnInfo: {
      returnType: 'any',
      description: '获取通过_setVar设置的组件临时变量值。'
    }
  }
]
