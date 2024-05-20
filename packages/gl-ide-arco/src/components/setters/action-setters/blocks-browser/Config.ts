const tabs = [
  { key: '组件', title: '默认指令', show: true, tips: '一个动作由多个指令组成' },
  { key: '模板', title: '模板', show: false },
  { key: '自定义区块', title: '自定义指令', show: true }
]

const componentGroups = [
  { name: 'block_var', text: '变量', opened: true },
  { name: 'block_page', text: '页面和组件', opened: true },
  { name: 'block_condition', text: '条件判断', opened: true },
  { name: 'block_loop', text: '循环', opened: true },
  { name: 'block_data', text: '数据', opened: true },
  { name: 'block_feedback', text: '反馈', opened: true },
  { name: 'block_file', text: '文件', opened: true },
  { name: 'block_network', text: '网络', opened: true },
  { name: 'block_other', text: '其它', opened: true }
]

const sidebar = {
  tabs,
  componentGroups
}

export { sidebar }
