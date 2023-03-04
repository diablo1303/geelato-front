/**
 *  动态页面结构定义
 */
export default class CtxPage {
  /**
   * @param {pageGid,pageId, nodeId, appId} pageGid：页面渲染时生成的全局id； nodeId:树节点id
   */
  constructor({pageGid, pageId, nodeId, appId} = {}) {
    this.reset({pageGid, pageId, nodeId, appId})
  }

  reset({pageGid, pageId, nodeId, appId} = {}) {
    this.pageGid = pageGid
    this.pageId = pageId
    this.nodeId = nodeId
    this.appId = appId
  }
}
