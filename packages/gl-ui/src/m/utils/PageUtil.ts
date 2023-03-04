import type { LooseObject } from "../mix/LooseObject";

export default class PageUtil {
  /**
   * 查找当前组件所在的页面组件
   * @param component 组件实例
   * @return 查找到当前组件所处的页面，若找不到则返回undefined
   */
  static findCurrentPage(component: LooseObject): any {
    if (!component.$parent.$vnode) {
      // 到了根节点，还找不到，可能是在设计器中执行该方案，设计器的舞台中不存在GlPage
      return undefined;
    }
    console.log(
      "geelato-ui-ant > CtxHandler.js > findCurrentPage() > component.$parent):",
      component.$parent
    );
    if (component.$parent.glType === "page") {
      return component.$parent;
    }
    return PageUtil.findCurrentPage(component.$parent);
  }

  /**
   * 查找当前控件（基础组件）所在的组件（高级组件）
   * @param control 组件实例
   * @return 查找到当前组件所处的页面，若找不到则返回undefined
   */
  static findCurrentComponent(component: LooseObject): any {
    if (!component.$parent.$vnode) {
      // 到了根节点，还找不到，可能是在设计器中执行该方案，设计器的舞台中不存在GlPage
      return undefined;
    }
    console.log(
      "geelato-ui-ant > CtxHandler.js > findCurrentPage() > component.$parent):",
      component.$parent
    );
    if (component.$parent.glType === "component") {
      return component.$parent;
    }
    return PageUtil.findCurrentComponent(component.$parent);
  }
}
