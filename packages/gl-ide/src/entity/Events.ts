/**
 *  事件命名规则：
 *  GlIde + [Sidebar|Stage|Settings] + [Component|Object_tree_node|Panel]+[Update/Remove/Open]
 */
enum Events {
    // 打开创建新项目页面
    GlIdeToolbarShowNewAppForm = 'GlIdeToolbarShowNewAppForm',
    // 打开项目修改页面
    GlIdeToolbarShowCurrentAppForm = 'GlIdeToolbarShowCurrentAppForm',
    // 打开创建基于模板新项目页面
    GlIdeToolbarShowNewAppFormByTemplate = 'GlIdeToolbarShowNewAppFormByTemplate',
    // 打开项目列表页面
    GlIdeToolbarShowAppList = 'GlIdeToolbarShowAppList',
    // 保存文件
    GlIdeToolbarSaveFile = 'GlIdeToolbarSaveFile',
    // 切换中间的图标
    GlIdeToolbarIconSelected = 'GlIdeToolbarIconSelected',

    // 侧边组件栏上选择组件
    GlIdeSidebarComponentSelected = 'GlIdeSidebarComponentSelected',

    // 打开ide的设置面板
    GlIdeSettingOpen = 'GlIdeSettingOpen',
    // 更新ide的设置面板
    GlIdeSettingUpdate = 'GlIdeSettingUpdate',
    // 切换面板
    GlIdeSettingPanelSwitch = 'GlIdeSettingPanelSwitch',
    // 更新对象树节点
    GlIdeSettingObjectTreeNodeUpdate = 'GlIdeSettingObjectTreeNodeUpdate',
    // 更新组件绑定事件的状态
    GlIdeSettingComponentEventStateUpdate = 'GlIdeSettingComponentEventStateUpdate',

    // 舞台上选择组件
    GlIdeStageComponentSelected = 'GlIdeStageComponentSelected',
    // 舞台上删除组件
    GlIdeStageComponentDelete = 'GlIdeStageComponentDelete',
    // 舞台上添加组件
    GlIdeStageComponentAdd = 'GlIdeStageComponentAdd',
    // 舞台上移动组件
    GlIdeStageComponentMove = 'GlIdeStageComponentMove'

}

export default Events
