/**
 *  事件命名规则：
 *  GlIde + [Sidebar|Stage|Settings] + [Component|Object_tree_node|Panel]+[Update/Remove/Open]
 */
enum EventNames {
  // 打开创建新项目页面
  GlIdeToolbarShowNewAppForm = 'GlIdeToolbarShowNewAppForm',
  // 打开项目修改页面
  GlIdeToolbarShowCurrentAppForm = 'GlIdeToolbarShowCurrentAppForm',
  // 打开创建基于模板新项目页面
  GlIdeToolbarShowNewAppFormByTemplate = 'GlIdeToolbarShowNewAppFormByTemplate',
  // 打开项目列表页面
  GlIdeToolbarShowAppList = 'GlIdeToolbarShowAppList',
  // 保存页面前，可以对页面进行处理
  GlIdeToolbarPageSaving = 'GlIdeToolbarPageSaving',
  // 保存页面文件之后
  GlIdeToolbarPageSaved = 'GlIdeToolbarPageSaved',
  // 点保存页面文件之后，经检查不符合一些条件，忽列此次保存
  GlIdeToolbarPageSaveIgnore = 'GlIdeToolbarPageSaveIgnore',
  // 切换中间的图标
  GlIdeToolbarIconSelected = 'GlIdeToolbarIconSelected',
  // 显示代码
  GlIdeToolbarShowCodeViewer = 'GlIdeToolbarShowCodeViewer',
  // 打开页面代码替换界面
  GlIdeToolbarShowPagesReplaceEditor = 'GlIdeToolbarShowPagesReplaceEditor',
  // 侧边组件栏上选择组件
  GlIdeSidebarComponentSelected = 'GlIdeSidebarComponentSelected',

  // 在设置面板中更新了组件实例信息
  GlIdeSetterUpdateComponentInstance = 'GlIdeSetterUpdateComponentInstance',
  // 删除当前选中的组件实例之前
  GlIdeSetterComponentInstDeleting = 'GlIdeSetterComponentInstDeleting',
  // 删除当前选中的组件实例之后
  GlIdeSetterComponentInstDeleted = 'GlIdeSetterComponentInstDeleted',
  // 打开ide的设置面板
  GlIdeSetterOpen = 'GlIdeSetterOpen',
  // 更新ide的设置面板
  GlIdeSetterUpdate = 'GlIdeSetterUpdate',
  // 切换面板
  GlIdeSetterPanelSwitch = 'GlIdeSetterPanelSwitch',
  // 更新对象树节点
  GlIdeSetterObjectTreeNodeUpdate = 'GlIdeSetterObjectTreeNodeUpdate',
  // 更新组件绑定事件的状态
  GlIdeSetterComponentEventStateUpdate = 'GlIdeSetterComponentEventStateUpdate',
  // 打开动作编辑器
  GlIdeOpenActionEditor = 'GlIdeOpenActionEditor',
  // 打开页面
  GlIdeOpenPage = 'GlIdeOpenPage',

  // 舞台上选择组件
  GlIdeStageComponentSelected = 'GlIdeStageComponentSelected',
  // 舞台上删除组件
  GlIdeStageComponentDelete = 'GlIdeStageComponentDelete',
  // 舞台上添加组件
  GlIdeStageComponentAdd = 'GlIdeStageComponentAdd',
  // 舞台上移动组件
  GlIdeStageComponentMove = 'GlIdeStageComponentMove',

  // 退出登录
  GlIdeLogout = 'GlIdeLogout',

  // 监听浏览器窗口高度变化
  WindowResize = 'resize',
}

export default EventNames
