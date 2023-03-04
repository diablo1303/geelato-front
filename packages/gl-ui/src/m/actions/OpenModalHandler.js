import utils from '../utils/Utils';

export default class OpenModalHandler {

  constructor($root) {
    this.$root = $root
  }

  /**
   *  打开窗口
   *  负责对页面传参进行转换处理
   * @param action
   * @param ctx
   * @param data 由于采用基于paramMapping的方式，直接从ctx中取值，不再使用该值
   */
  doAction(action, page, ctx, data) {
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > action:', action)
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > ctx:', ctx)
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > data:', data)
    const params = {}
    if (action.params.paramMapping) {
      action.params.paramMapping.forEach(param => {
        params[param.target.cardItemGid] = params[param.target.cardItemGid] || {}
        // 传过来的数据data一般来说是用gid作为key的，也有可能用name作为key
        let targetGid = param.target.gid.substring(param.target.gid.lastIndexOf('.') + 1)
        let srcData = utils.eval('$ctx.' + param.src.dataCtx, ctx)
        params[param.target.cardItemGid][targetGid] = srcData[param.src.gid] || srcData[param.src.name]
      })
    }
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > parse paramMapping and get param:', params)

    this.$root.$gl.ui.openModal(ctx, {
      title: action.params.title,
      width: action.params.width || '1000px',
      height: action.params.height || '480px',
      body: {
        type: 'dynamic',
        component: 'GlPage',
        props: {
          extendId: action.params.pageId,
          params: params || data
        }
      },
      actions: action.params.actions,
      actionAlign: 'center',
      on: [{fn: 'save', ctx: 'content', then: {fn: 'close', ctx: 'this', then: {fn: 'refresh', ctx: 'opener'}}}],
    })
  }
}
