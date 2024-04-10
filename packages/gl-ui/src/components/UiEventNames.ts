const UiEventNames = {
  EntityForm: {
    // 完成保存对象创建，但还未保存数据到服务端之前
    onCreatedEntitySavers: 'onCreatedEntitySavers',
    // 完成表单提交，即保护数据到服务端之后触发
    onSubmitted: 'onSubmitted',
  }
}

export default UiEventNames
