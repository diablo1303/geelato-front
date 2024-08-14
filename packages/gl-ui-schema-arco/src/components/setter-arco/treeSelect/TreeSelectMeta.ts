export default {
  componentName: 'ATreeSelect',
  displayMode: 'tile',
  iconType: 'gl-treeSelect',
  group: 'dataEntry',
  title: '树选择',
  alias: 'treeselect',
  useBy: ['freePage'],
  properties: [],
  actions: [{ name: 'valueChange', description: '', title: '值改变',params: [
      {
        name: 'value',
        title: '修改后的值',
        required: true,
        type: 'any',
        description: '修改后的值。'
      },
      {
        name: 'oldValue',
        title: '修改前的值',
        required: true,
        type: 'any',
        description: '修改前的值，如是值是对象引用，修改后和修改前的是同一个，值相同。'
      }
    ] }]
}
