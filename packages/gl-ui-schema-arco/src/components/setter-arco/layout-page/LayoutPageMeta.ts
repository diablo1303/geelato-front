export default {
  componentName: 'GlLayoutPage',
  displayMode: 'tile',
  iconType: 'gl-layout',
  group: 'layout',
  title: '页面布局',
  alias: 'layoutPage',
  useBy: ['freePage'],
  properties: [
    {
      name: 'showHeader',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '',
      title: '显示头部',
      setterComponentName: 'ASwitch',
      displayMode: 'tile'
    },
    {
      name: 'showFooter',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '',
      title: '显示脚部',
      setterComponentName: 'ASwitch',
      displayMode: 'tile'
    },
    {
      name: 'showSiderExtend',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '',
      title: '显示扩展侧边',
      setterComponentName: 'ASwitch',
      displayMode: 'tile',
      placeholder: ''
    },
    {
      name: 'siderProps',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: false,
      displayMode: 'collapse',
      setterComponentProps: {},
      setterComponentVModelName: '',
      _showSub: false,
      properties: [
        {
          name: 'theme',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              { label: '暗色', value: 'dark' },
              {
                label: '亮色',
                value: 'light'
              }
            ],
            type: 'button'
          },
          setterComponentVModelName: 'modelValue',
          title: '主题颜色',
          setterComponentName: 'ARadioGroup'
        },
        {
          name: 'defaultCollapsed',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '默认收起',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'width',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '宽度',
          placeholder: '默认为200',
          setterComponentName: 'AInputNumber'
        },
        {
          name: 'collapsedWidth',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '收缩宽度',
          placeholder: '默认为48',
          setterComponentName: 'AInputNumber'
        },
        {
          name: 'resizeDirections',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              { label: '左', value: 'left' },
              {
                label: '右',
                value: 'right'
              },
              { label: '上', value: 'top' },
              { label: '下', value: 'bottom' }
            ],
            multiple: true,
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          title: '可伸缩',
          description: '可以用鼠标进行拖拽放大缩小的侧边栏',
          setterComponentName: 'ASelect'
        },
        {
          name: 'collapsible',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '是否可折叠',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'hideTrigger',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          description: '隐藏底部折叠触发器',
          title: '隐藏折叠器',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'breakpoint',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              {
                label: 'xxl',
                __7kPUVfVvSwd0fgGNZt: 'xxl',
                value: 'xxl'
              },
              { label: 'xl', __7kPUVfVvSwd0fgGNZt: 'xl', value: 'xl' },
              {
                label: 'lg',
                __7kPUVfVvSwd0fgGNZt: 'lg',
                value: 'lg'
              },
              { label: 'md', __7kPUVfVvSwd0fgGNZt: 'md', value: 'md' },
              {
                label: 'sm',
                __7kPUVfVvSwd0fgGNZt: 'sm',
                value: 'sm'
              },
              { label: 'xs', __7kPUVfVvSwd0fgGNZt: 'xs', value: 'xs' }
            ],
            multiple: false,
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          title: '触发响应式',
          description: '触发响应式布局的断点',
          setterComponentName: 'ASelect'
        }
      ],
      title: '侧边配置',
      setterComponentName: 'GlSimpleObjectSetter'
    },
    {
      name: 'siderExtendProps',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: false,
      displayMode: 'collapse',
      setterComponentProps: {},
      setterComponentVModelName: '',
      _showSub: false,
      properties: [
        {
          name: 'theme',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              {
                label: '暗色',
                value: 'dark',
                __8rArOJ48w8InIwLkip: 'dark'
              },
              { label: '亮色', value: 'light', __8rArOJ48w8InIwLkip: 'light' }
            ],
            type: 'button'
          },
          setterComponentVModelName: 'modelValue',
          title: '主题颜色',
          setterComponentName: 'ARadioGroup'
        },
        {
          name: 'defaultCollapsed',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '默认收起',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'collapsible',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '是否可收起',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'width',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '宽度',
          placeholder: '默认为200',
          setterComponentName: 'AInputNumber'
        },
        {
          name: 'collapsedWidth',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '收缩宽度',
          placeholder: '默认为48',
          setterComponentName: 'AInputNumber'
        },
        {
          name: 'resizeDirections',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              {
                label: '左',
                __oekNDEtv49L1EBlRxj: 'left',
                value: 'left'
              },
              { label: '右', __oekNDEtv49L1EBlRxj: 'right', value: 'right' },
              {
                label: '上',
                __oekNDEtv49L1EBlRxj: 'top',
                value: 'top'
              },
              { label: '下', __oekNDEtv49L1EBlRxj: 'bottom', value: 'bottom' }
            ],
            multiple: true,
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          title: '可伸缩',
          description: '可以用鼠标进行拖拽放大缩小的侧边栏',
          setterComponentName: 'ASelect'
        },
        {
          name: 'hideTrigger',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          description: '隐藏底部折叠触发器',
          title: '隐藏折叠器',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'breakpoint',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              {
                label: 'xxl',
                __7kPUVfVvSwd0fgGNZt: 'xxl',
                value: 'xxl'
              },
              { label: 'xl', __7kPUVfVvSwd0fgGNZt: 'xl', value: 'xl' },
              {
                label: 'lg',
                __7kPUVfVvSwd0fgGNZt: 'lg',
                value: 'lg'
              },
              { label: 'md', __7kPUVfVvSwd0fgGNZt: 'md', value: 'md' },
              {
                label: 'sm',
                __7kPUVfVvSwd0fgGNZt: 'sm',
                value: 'sm'
              },
              { label: 'xs', __7kPUVfVvSwd0fgGNZt: 'xs', value: 'xs' }
            ],
            multiple: false,
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          title: '触发响应式',
          description: '触发响应式布局的断点',
          setterComponentName: 'ASelect'
        }
      ],
      title: '扩展侧边',
      setterComponentName: 'GlSimpleObjectSetter'
    }
  ],
  actions: [
    {
      eventName: 'mounted',
      name: 'mounted',
      description: '组件加载完时触发，和Vue的onMounted一致',
      title: '加载完'
    },
    {
      eventName: 'updated',
      name: 'updated',
      description: '组件更新时触发，和Vue的onUpdated一致',
      title: '更新完'
    }
  ]
}
