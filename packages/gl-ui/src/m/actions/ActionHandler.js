import InvokeCurrentComponentHandler from './InvokeCurrentComponentHandler'
import InvokeComponentHandler from './InvokeComponentHandler'
import InvokeRestfulSrvHandler from './InvokeRestfulSrvHandler'
import OpenModalHandler from './OpenModalHandler'
import ShowMessageHandler from './ShowMessageHandler'
import ShowNotificationHandler from './ShowNotificationHandler'

export default class ActionHandler {

  constructor($root) {
    this.$root = $root

    this.handlers = {
      InvokeCurrentComponentHandler: new InvokeCurrentComponentHandler(this.$root),
      InvokeComponentHandler: new InvokeComponentHandler(this.$root),
      InvokeRestfulSrvHandler: new InvokeRestfulSrvHandler(this.$root),
      OpenModalHandler: new OpenModalHandler(this.$root),
      ShowMessageHandler: new ShowMessageHandler(this.$root),
      ShowNotificationHandler: new ShowNotificationHandler(this.$root)
    }
  }

  /**
   * 动态加载./handler/下的XXXHandler,并执行
   * @param action
   * @param ctx 触发事件的上下文
   */
  doAction(action, ctx, data, callback) {
    const that = this
    console.log('geelato > runtime > ActionHandler.js > doAction() > try execute action:', action)
    if (!action) {
      console.log('geelato > runtime > ActionHandler.js > doAction() > End doAction.')
      return
    }
    if (typeof action !== 'object' || !action.do) {
      console.warn('geelato > runtime > ActionHandler.js > doAction() > invalid action: ', action)
      return
    }

    for (const index in action.do) {
      const doItem = action.do[index]
      const handlerName = doItem.handler + 'Handler'
      try {
        let page = that.findCurrentPage(ctx)
        let promise = this.handlers[handlerName].doAction(doItem, page, ctx, data)
        console.log('geelato > runtime > ActionHandler.js > doAction() > execute and return promise:', promise)
        if (promise && typeof promise.then === 'function') {
          promise.then(function (result) {
            console.log('geelato > runtime > ActionHandler.js > doAction() > promise.then() ', result)
            that.doThen(doItem.then, ctx, result)
          }).catch(function (result) {
            console.log('geelato > runtime > ActionHandler.js > doAction() > promise.catch() ', result)
            that.doFail(doItem.fail, ctx, result)
          })
        } else {
          that.doAction(doItem.then, ctx, data)
        }
      } catch (e) {
        console.error('geelato > runtime > ActionHandler.js >action,e:', action, e)
      }
    }
  }

  doThen(actionThen, ctx, data, callback) {
    const that = this
    console.log('geelato > runtime > ActionHandler.js > doThen() > try execute actionThen:', actionThen)
    if (actionThen && actionThen.length > 0) {
      actionThen.forEach(thenItem => {
        // action:{handler,fn,then,params}
        const handlerName = thenItem.handler + 'Handler'
        try {
          let page = that.findCurrentPage(ctx)
          let promise = this.handlers[handlerName].doAction(thenItem, page, ctx, data)
          console.log('geelato > runtime > ActionHandler.js > doThen() > execute and return promise:', promise)
          if (promise && typeof promise.then === 'function') {
            promise.then(function (result) {
              console.log('geelato > runtime > ActionHandler.js > doThen() > promise.then() ', promise.then, data)
              that.doThen(thenItem.then, ctx, result)
            }).catch(function (result) {
              that.doFail(actionThen.fail, ctx, result)
            })
          } else {
            that.doThen(actionThen.then, ctx, data)
          }
        } catch (e) {
          console.error('geelato > runtime > ActionHandler.js > doThen() > actionThen,e:', actionThen, e)
        }
      })
    } else {
      console.log('geelato > runtime > ActionHandler.js > doThen() > invalid actionThen:', actionThen, ' end actionThen.')
    }
  }

  doFail(actionThen, ctx, result, callback) {
    // if (result.message === 'Network Error') {
    //   this.$root.$message.error('网络错误，请稍后重试。')
    // }
    // console.error('geelato > runtime > ActionHandler.js > doFail() > action or actionThen,ctx,data:', actionThen, ctx, data)
  }

  findCurrentPage(component) {
    if (!component.$parent || !component.$parent.$vnode) {
      // 到了根节点，还找不到，可能是在设计器中执行该方案，设计器的舞台中不存在GlPage
      return undefined
    }
    console.log('geelato > runtime > ActionHandler.js > findCurrentPage() > component.$parent):', component.$parent.$vnode.tag, component.$parent)
    if (component.$parent.$vnode.tag.search(/-GlPage$/) !== -1) {
      return component.$parent
    } else {
      return this.findCurrentPage(component.$parent)
    }
  }
}
