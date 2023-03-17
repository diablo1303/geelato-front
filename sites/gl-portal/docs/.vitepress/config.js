import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

export default defineConfig({
  // lang: 'en-US',
  siteTitle: '',
  title: 'Geelato',
  description: 'A low-code engine.',

  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: nav(),

    sidebar: {
      '/guide/': sidebarGuide(),
      '/component/': sidebarComponent(),
      '/config/': sidebarConfig(),
      '/api/':sidebarApi()
    },

    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/geelato-projects' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Geelato'
    },

    algolia: {
      appId: '8J64VVRP8K',
      apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
      indexName: 'vitepress'
    },

    // carbonAds: {
    //   code: 'CEBDT27Y',
    //   placement: 'vuejsorg'
    // }
  }
})

function nav() {
  return [
    { text: '指南', link: '/guide/what-is-geelato', activeMatch: '/guide/' },
    // { text: '协议', link: '/schema/introduction', activeMatch: '/schema/' },
    { text: '组件', link: '/component/introduction', activeMatch: '/component/' },
    { text: '演示', items: [
        {text: 'IDE', link: '/showcase/ide', activeMatch: '/showcase/'},
        {text: 'Admin', link: '/showcase/admin', activeMatch: '/showcase/'}
      ] },
    // {
    //   text: version,
    //   items: [
    //     {
    //       text: 'Changelog',
    //       link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md'
    //     },
    //     {
    //       text: 'Contributing',
    //       link: 'https://github.com/vuejs/vitepress/blob/main/.github/contributing.md'
    //     },
    //   ],
    // },
  ]
}

function sidebarGuide() {
  return [
    {
      text: '介绍',
      collapsible: true,
      items: [
        { text: '什么是Geelato?', link: '/guide/what-is-geelato' }
      ]
    },
    {
      text: '前端工程',
      collapsible: true,
      items: [
        { text: '快速开始', link: '/guide/frontend/getting-started' },
        // { text: '工程部署', link: '/guide/frontend/configuration' },
      ]
    },
    {
      text: '后台工程',
      collapsible: true,
      items: [
        { text: '快速开始', link: '/guide/backend/getting-started' },
        // { text: '工程配置', link: '/guide/backend/configuration' },
        // { text: '工程部署', link: '/guide/backend/deploying' },
        { text: '数据库约定', link: '/guide/backend/db-standard-guide' }
      ]
    },
    {
      text: '前后端接口',
      collapsible: true,
      items: [
        { text: 'Entity增删改查', link: '/guide/api/entity-api' },
        { text: 'SqlKey增删改查', link: '/guide/api/sql-key' },
        { text: 'Mql', link: '/guide/api/mql' },
      ]
    },
    {
      text: '低代码协议',
      collapsible: true,
      items: [
        { text: '低代码引擎协议', link: '/guide/schema/introduction' },
        { text: '属性设置器Meta', link: '/guide/schema/setters-property-meta' },
        { text: '组件设置器Meta', link: '/guide/schema/setters-component-meta' },
        { text: '属性设置器', link: '/guide/schema/setters-property' },
      ]
    }
  ]
}

function sidebarComponent(){
  return [
    {
      collapsible: true,
      items: [
        { text: '介绍', link: '/component/introduction' },
      ]
    },
    {
      text: '通用',
      collapsible: true,
      items: [
        { text: 'Button 按钮', link: '/component/general/button' },
        { text: 'Icon 图标', link: '/component/general/icon' },
        { text: 'Typography 排版', link: '/component/general/typography' }
      ]
    },
    {
      text: '布局',
      collapsible: true,
      items: [
        { text: 'Divider 分割线', link: '/component/layout/divider' },
        { text: 'Grid 栅格', link: '/component/layout/rowLayout' },
        { text: 'Layout 布局', link: '/component/layout/layout' },
        { text: 'Space 间距', link: '/component/layout/space' }
      ]
    },
    {
      text: '导航',
      collapsible: true,
      items: [
        { text: 'Affix 固钉', link: '/component/nav/affix' },
        { text: 'Breadcrumb 面包屑', link: '/component/nav/breadcrumb' },
        { text: 'Dropdown 下拉菜单', link: '/component/nav/dropdown' },
        { text: 'Menu 导航菜单', link: '/component/nav/menu' },
        { text: 'PageHeader 页头', link: '/component/nav/pageHeader' },
        { text: 'Pagination 分页', link: '/component/nav/pagination' },
        { text: 'Steps 步骤条', link: '/component/nav/steps' }
      ]
    },
    {
      text: '数据录入',
      collapsible: true,
      items: [
        { text: 'AutoComplete 自动完成', link: '/component/dataEntry/autoComplete' },
        { text: 'Breadcrumb 面包屑', link: '/component/dataEntry/breadcrumb' },
        { text: 'Cascader 级联选择', link: '/component/dataEntry/cascader' },
        { text: 'Checkbox 多选框', link: '/component/dataEntry/checkbox' },
        { text: 'DatePicker 日期选择框', link: '/component/dataEntry/datePicker' },
        { text: 'Form 表单', link: '/component/dataEntry/form' },
        { text: 'Input 输入框', link: '/component/dataEntry/input' },
        { text: 'InputNumber 数字输入框', link: '/component/dataEntry/inputNumber' },
        { text: 'Radio 单选框', link: '/component/dataEntry/radio' },
        { text: 'Rate 评分', link: '/component/dataEntry/rate' },
        { text: 'Select 选择器', link: '/component/dataEntry/select' },
        { text: 'Slider 滑动输入条', link: '/component/dataEntry/slider' },
        { text: 'Switch 开关', link: '/component/dataEntry/switch' },
        { text: 'TimePicker 时间选择框', link: '/component/dataEntry/timePicker' },
        { text: 'Transfer 穿梭框', link: '/component/dataEntry/transfer' },
        { text: 'TreeSelect 树选择', link: '/component/dataEntry/treeSelect' },
        { text: 'Upload 上传', link: '/component/dataEntry/upload' }
      ]
    },
    {
      text: '数据展示',
      collapsible: true,
      items: [
        { text: 'Avatar 头像', link: '/component/display/avatar' },
        { text: 'Badge 徽标数', link: '/component/display/badge' },
        { text: 'Calendar 日历', link: '/component/display/calendar' },
        { text: 'Card 卡片', link: '/component/display/card' },
        { text: 'Carousel 走马灯', link: '/component/display/carousel' },
        { text: 'Collapse 折叠面板', link: '/component/display/collapse' },
        { text: 'Comment 评论', link: '/component/display/comment' },
        { text: 'Descriptions 描述列表', link: '/component/display/descriptions' },
        { text: 'Empty 空状态', link: '/component/display/empty' },
        { text: 'Image 图片', link: '/component/display/image' },
        { text: 'List 列表', link: '/component/display/list' },
        { text: 'Popover 气泡卡片', link: '/component/display/popover' },
        { text: 'Statistic 统计数值', link: '/component/display/statistic' },
        { text: 'Table 表格', link: '/component/dataDisplay/table' },
        { text: 'Tabs 标签页', link: '/component/display/tabs' },
        { text: 'Tag 标签', link: '/component/display/tag' },
        { text: 'Timeline 时间轴', link: '/component/display/timeline' },
        { text: 'Tooltip 文字提示', link: '/component/display/tooltip' },
        { text: 'Tree 树形控件', link: '/component/display/tree' },
      ]
    },
    {
      text: '反馈',
      collapsible: true,
      items: [
        { text: 'Alert 警告提示', link: '/component/display/alert' },
        { text: 'Drawer 抽屉', link: '/component/display/drawer' },
        { text: 'Message 全局提示', link: '/component/display/message' },
        { text: 'Modal 对话框', link: '/component/display/modal' },
        { text: 'Notification 通知提醒框', link: '/component/display/notification' },
        { text: 'Popconfirm 气泡确认框', link: '/component/display/popconfirm' },
        { text: 'Progress 进度条', link: '/component/display/progress' },
        { text: 'Result 结果', link: '/component/display/result' },
        { text: 'Skeleton 骨架屏', link: '/component/display/skeleton' },
        { text: 'Spin 加载中', link: '/component/display/spin' }
      ]
    },
    {
      text: '脚本组件',
      collapsible: true,
      items: [
        { text: 'IF条件', link: '/component/script/condition/ifelse' }
      ]
    },
    {
      text: '自定义组件',
      collapsible: true,
      items: [
        { text: '表单', link: '/component/gl-form' },
        { text: '表格', link: '/component/gl-table' },
        { text: '组织选取', link: '/component/gl-org-selector' },
        { text: '人员选取', link: '/component/gl-user-selector' }
      ]
    }
  ]
}

function sidebarSchema(){
  return [

  ]
}

function sidebarConfig() {
  return [
    {
      text: 'Config',
      items: [
        { text: 'Introduction', link: '/config/introduction' },
        { text: 'App Configs', link: '/config/app-configs' },
        { text: 'Theme Configs', link: '/config/theme-configs' },
        { text: 'Frontmatter Configs', link: '/config/frontmatter-configs' }
      ]
    }
  ]
}

function sidebarApi() {
  return [
    {
      text: '',
      items: [
        { text: '平台服务接口', link: '/api/platform-api' },
        { text: '元数据查询接口', link: '/api/mql' }
      ]
    }
  ]
}
