import {RecordsUtil} from './RecordsUtil'

export class Utils {
  constructor() {
  }

  trim(str: string) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }

  /**
   * 'false' -> false ,'0' -> false
   * @param v
   * @returns {boolean}
   */
  toBoolean(v: string | boolean | number) {
    if (typeof v === 'string' && 'false|0'.indexOf(this.trim(v.toLowerCase())) !== -1) {
      return false
    } else {
      return !!v
    }
  }

  /**
   * @param prefix 用于区分gid的类型，如node、div、component
   * @param maxLength 加上prefix和连接符“_”总的gid长度，默认为20
   */
  gid(prefix?: string, maxLength?: number) {
    if (prefix) {
      return `${prefix}_${this.uuid((maxLength || 20) - prefix.length - 1)}`
    }
    return this.uuid(20)
  }

  uuid(len: number, radix?: number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    let i
    radix = radix || chars.length

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
      // rfc4122, version 4 form
      let r
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16)
          uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return uuid.join('')
  }

  /**
   * 执行表达式
   * @param expression
   * @param $gl 用于expression的上下文参数
   * @param glName 指定上下文的参数名，默认为$gl
   * @returns {*}
   */
  evalExpression(expression: string | number, $gl: object, glName = '$gl') {
    try {
      if (utils.isNumber(expression)) {
        // console.log('gl-ui > utils > evalExpression() > expression: ', expression, 'result:', expression, '$gl', $gl)
        return expression
      }

      const Fn = Function
      // @ts-ignore
      const str = this.trim(expression)
      const index = str.indexOf(';')
      let result
      if (index === -1 || index === str.length - 1) {
        // 单语句
        result = new Fn(glName, 'return ' + str)($gl)
      } else {
        // 多语句
        const strAry = str.split(';')
        const lastStr = strAry.pop()
        const preStr = strAry.join(';')
        result = new Fn(glName, preStr + '; return ' + lastStr)($gl)
      }
      // console.log(
      //   'gl-ui > utils > evalExpression() > expression: ',
      //   expression,
      //   'result:',
      //   result,
      //   '$gl',
      //   $gl
      // )
      return result
    } catch (e: any) {
      console.error('执行脚本出错', e.message, '表达式为：', expression, '$gl为：', $gl)
      return ''
    }
  }

  /**
   * 直接执行方法体内容
   * @param fnBody 方法体的内容，如果内容
   * @param $gl 用于fnBody的上下文参数
   * @param glName 指定上下文的参数名，默认为$gl
   * @param async 对于fnBody里有wait的场景，可以设置async为true
   * @returns {*}
   */
  evalFn(fnBody: string, $gl: object, glName = '$gl', async?: boolean) {
    try {
      // console.log('gl-ui > utils > evalFn() > blocks: ', fnBody)
      // console.log('gl-ui > utils > evalFn() > ctx: ', ctx)
      // console.log('gl-ui > utils > evalFn() > async: ', async)
      let bodyScript = this.trim(fnBody)
      // 去掉头尾分号
      bodyScript = bodyScript.replace(/^;+|;+$/g, '')
      // 无换行，无“;”的则按表达式处理
      if (!bodyScript.match(/[\r\n;]/g) && !bodyScript.toLowerCase().startsWith('return ')) {
        bodyScript = 'return ' + bodyScript
      }
      if (async) {
        bodyScript = `return (async () => {
              ${bodyScript}
          })()`
      }
      // console.log('gl-ui > utils > evalFn() > bodyScript: ', bodyScript)
      return new Function(glName, bodyScript)($gl)
    } catch (e: any) {
      console.error('执行脚本出错', e.message, '方法体为：', fnBody, '详细异常e:', e)
    }
  }

  isEmpty(str: string) {
    return str === undefined || str === null || str.replace(/\s/g, '') === ''
  }

  isNumber(str: any) {
    if (str === null || str === undefined) {
      return false
    }
    const t = typeof str
    if (t === 'number') {
      return true
    } else if (t === 'string') {
      return /^[0-9]*$/.test(str)
    }
    return false
  }

  isArray(ary: any) {
    return typeof ary === 'object' && ary.length !== undefined
  }

  isNullOrEmpty(obj: Object | undefined | null) {
    return (
      obj === null ||
      obj === undefined ||
      (typeof obj === 'object' && Object.keys(obj).length === 0)
    )
  }

  /**
   * 基于sessionStorage存储
   * @param key
   * @param json 默认返回{}
   */
  session(key: string, json: object) {
    if (arguments.length === 2) {
      if (json) {
        sessionStorage.setItem(key, JSON.stringify(json))
      } else {
        sessionStorage.removeItem(key)
      }
    } else if (arguments.length === 1) {
      const value = sessionStorage.getItem(key)
      if (value) {
        return JSON.parse(value)
      } else {
        return {}
      }
    } else {
      console.error('参数不正确。')
    }
  }

  /**
   *
   * @param hex 16进制
   * @param alpha 透明度，默认为1，即不透明
   * @returns {string}
   */
  hex2Rgb(hex: string, alpha: number) {
    const alphaLocal = alpha || 1
    let sColor = hex.toLowerCase()
    // 十六进制颜色值的正则表达式
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = '#'
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      // 处理六位的颜色值
      const sColorChange = []
      for (let j = 1; j < 7; j += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(j, j + 2)))
      }
      return 'RGBA(' + sColorChange.join(',') + ',' + alphaLocal + ')'
    }
    return sColor
  }

  /**
   * 数组指定列去重，返回去重后的列对象
   * @param arr 数组
   * @param col
   */
  distinct(arr: Array<any>, col: string | number) {
    return arr.reduce(function (result, item) {
      if (!(item[col] in result)) {
        result[item[col]] = item[col]
      }
      return result
    }, {})
  }

  /**
   * 默认data的id为“id”，pid为“pid”
   * @param data 列表数据
   * @param pidValue  根id的值
   * @param fieldsMapper id.pid字段映射
   * @returns {Array}
   */
  listToTree<
    T extends {
      [key: string]: any
    }
  >(data: Array<T>, pidValue: string | number | null, fieldsMapper?: Record<string, string>) {
    const tree = []
    let idField = 'id'
    let pidField = 'pid'
    if (fieldsMapper) {
      fieldsMapper.id ? (idField = fieldsMapper.id) : 'id'
      fieldsMapper.pid ? (pidField = fieldsMapper.pid) : 'pid'
    }
    let temp
    for (let i = 0; i < data.length; i++) {
      if (data[i][pidField] == pidValue) {
        const obj = data[i]
        temp = this.listToTree(data, data[i][idField])
        if (temp.length > 0) {
          // @ts-ignore
          obj.children = temp
        }
        tree.push(obj)
      }
    }
    return tree
  }

  /**
   * 树结构转成列表结构
   * @param treeNodes
   */
  treeToList(treeNodes: Record<string, any>[]) {
    const list: Record<string, any>[] = []
    treeNodes.forEach((treeNode) => {
      const addTreeNode = treeNode
      list.push(addTreeNode)
      if (addTreeNode.children) {
        this.treeToList(treeNode.children)
        delete addTreeNode.children
      }
    })
    return list
  }

  /**
   * 将树结构数据，转成以主键为key,value为节点的Map
   * @param treeNodes
   * @param keyName
   * @param map
   */
  treeToMap(treeNodes: Record<string, any>[], keyName: string, map: Record<any, any>) {
    treeNodes.forEach((treeNode) => {
      map[treeNode[keyName]] = treeNode
      if (treeNode.children) {
        this.treeToMap(treeNode.children, keyName, map)
        delete treeNode.children
      }
    })
  }

  /**
   *
   * @param d 需格式化的日期，可为数值或字符串或日期对象
   * @param formatString 日期格式
   * @returns {*}
   */
  dateFormat(d: string | number | object, formatString: string) {
    let date: Date
    let fmt = formatString
    if (typeof d === 'string') {
      date = new Date(parseInt(d))
    } else if (typeof d === 'number') {
      date = new Date()
    } else if (typeof d === 'object') {
      date = d as Date
    } else {
      date = new Date()
      console.error('输入格式不对，应为日期数值或字符串，或日期对象')
    }
    const o: Record<string, any> = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'H+': date.getHours(), // 24小时制
      'h+': date.getHours() % 12, // 12小时制
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }

  /**
   * 查找当前组件所在的页面组件
   * @param component 组件实例
   * @return 查找到当前组件所处的页面，若找不到则返回undefined
   */
  findCurrentPage(component: any): any {
    if (!component.$parent.$vnode) {
      // 到了根节点，还找不到，可能是在设计器中执行该方案，设计器的舞台中不存在GlPage
      return undefined
    }
    // console.log('gl-ui > CtxHandler.js > findCurrentPage() > component.$parent):', component.$parent)
    if (component.$parent.glType === 'page') {
      return component.$parent
    } else {
      return this.findCurrentPage(component.$parent)
    }
  }

  /**
   * 查找当前控件（基础组件）所在的组件（高级组件）
   * @param component 组件实例
   * @return 查找到当前组件所处的页面，若找不到则返回undefined
   */
  findCurrentComponent(component: any): any {
    if (!component.$parent.$vnode) {
      // 到了根节点，还找不到，可能是在设计器中执行该方案，设计器的舞台中不存在GlPage
      return undefined
    }
    // console.log('gl-ui > CtxHandler.js > findCurrentPage() > component.$parent):', component.$parent)
    if (component.$parent.glType === 'component') {
      return component.$parent
    } else {
      return this.findCurrentComponent(component.$parent)
    }
  }

  /**
   *
   * @param ms 毫秒
   */
  async sleep(ms: number) {
    function sleepMs(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

    await sleepMs(ms)
  }

  /**
   * 获取url的查询参数
   * @param paramName
   */
  getUrlQueryParam(paramName: string) {
    const query = window.location.search.substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] == paramName) {
        return pair[1]
      }
    }
    return
  }

  groupSum(data: { [key: string]: any }[], groupField: string, sumFields: string[]) {
    return RecordsUtil.groupSum(data, groupField, sumFields)
  }

  /**
   * 反转数组，返回新的数组，不改变原数据
   * @param array
   */
  arrayReverse(array: Array<any>) {
    const newAry = []
    for (let i = array.length - 1; i >= 0; i--) {
      newAry.push(array[i])
    }
    return newAry
  }

  /**
   * 移动数组内的项，改变原数据
   * @param array
   * @param oldIndex 被移动项的位置
   * @param newIndex 移动到新的位置
   */
  arrayMoveItem = (array: any[], oldIndex: number, newIndex: number) => {
    if (oldIndex > -1 && newIndex > -1 && oldIndex !== newIndex) {
      // 先删老，后加新
      const deleteItem = array.splice(oldIndex, 1)[0]
      array.splice(newIndex, 0, deleteItem)
    }
    return array
  }

  /**
   * 字符串是否是json字符串
   * @param val
   */
  isJSON(val: string) {
    let isJ = false;
    try {
      if (typeof val === 'string' && val) {
        const obj = JSON.parse(val);
        if (typeof obj === 'object' && obj) {
          isJ = true;
        }
      }
    } catch (e) {
      isJ = false;
    }
    return isJ;
  }
}

const utils = new Utils()
export default utils
