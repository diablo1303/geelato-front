import utils from '../utils/Utils';

let paramType = 'InvokeComponent'

export default class InvokeComponentHandler {

  constructor($root) {
    this.$root = $root
  }

  /**
   * @param action
   * @param ctx 触发事件的组件，如点击树节点，需要刷新右边的列表，则此时ctx为树组件
   * @param data
   * @return {*}
   */
  doAction(action, page, ctx, data) {
    console.log('geelato > runtime > InvokeComponentHandler.js > doAction() > action:', action)
    console.log('geelato > runtime > InvokeComponentHandler.js > doAction() > ctx:', ctx, this.getComponentRefs(ctx))
    console.log('geelato > runtime > InvokeComponentHandler.js > doAction() > data:', data)
    const params = {}
    if (action.params.InvokeComponent.fn.params && action.params.InvokeComponent.fn.params.paramMapping) {
      action.params.InvokeComponent.fn.params.paramMapping.forEach(param => {
        // 传过来的数据data一般来说是用gid作为key的，也有可能用name作为key
        let targetGid = param.target.gid.substring(param.target.gid.lastIndexOf('.') + 1)
        let srcData = utils.eval('$ctx.' + param.src.dataCtx, ctx)
        console.log('geelato > runtime > InvokeComponentHandler.js > srcData:', srcData)
        params[targetGid] = srcData[param.src.gid] || srcData[param.src.name]
      })
      console.log('geelato > runtime > InvokeComponentHandler.js > doAction() > parse paramMapping:', action.params.InvokeComponent.fn.params.paramMapping, ' and get param:', params)
      // params.data = data
    }
    // 获取该页面的所有引用组件
    let refs = this.getComponentRefs(ctx)
    // 通过refId获取组件，并调用该组件的方法
    const targetComponent = refs[action.params.InvokeComponent.refId]
    const promise = targetComponent.component[action.params.InvokeComponent.fn.name]({params: params})
    console.log('geelato > runtime > InvokeComponentHandler.js > doAction() > promise:', promise)
    return promise
  }

  // getPageComponent(c) {
  //   if (typeof c.$parent === 'object') {
  //     return this.getPageComponent(c.$parent)
  //   } else {
  //     return c
  //   }
  // }

  getComponentRefs(c) {
    console.log('geelato > runtime > InvokeComponentHandler.js > getComponentRefs(c) > c:', c)
    if (typeof c.componentRefs === 'object') {
      return c.componentRefs
    } else {
      return this.getComponentRefs(c.$parent)
    }
  }
}
