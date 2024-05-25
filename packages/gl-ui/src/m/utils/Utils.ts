import { RecordsUtil } from './RecordsUtil'
import { toChineseCurrency } from './toChineseCurrency'

export class Utils {
  constructor() {}

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
    // 首字母不为数字
    uuid[0] = chars[11 + (0 | (Math.random() * radix))]
    if (len) {
      // Compact form
      for (i = 1; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
      // rfc4122, version 4 form
      let r
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 1; i < 36; i++) {
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
        if (
          bodyScript.toLowerCase().startsWith(';if(') ||
          bodyScript.toLowerCase().startsWith('if(')
        ) {
          // if开始头，直接在前面加'return '会报错，这里按函数处理
          bodyScript = `return (() => {
              ${bodyScript}
          })()`
        } else {
          bodyScript = 'return ' + bodyScript
        }
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

  isEmpty(target: string | object | undefined | null) {
    if (target === undefined || target === null) {
      return true
    }
    switch (typeof target) {
      case 'string':
        return target.replace(/\s/g, '') === ''
      case 'object':
        // @ts-ignore
        if (target.length !== undefined) {
          // @ts-ignore
          return target.length === 0
        }
        if (Object.keys(target).length === 0) {
          return true
        }
    }
    return false
  }

  isNumber(target: any) {
    if (target === null || target === undefined) {
      return false
    }
    const t = typeof target
    if (t === 'number') {
      return true
    } else if (t === 'string') {
      return /^[0-9]*$/.test(target)
    }
    return false
  }

  isArray(ary: any) {
    return Array.isArray(ary)
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
      console.log('pidValue', pidField, data[i][pidField], pidValue, data[i])
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

  listToTree2<
    T extends {
      [key: string]: any
    }
  >(list: Array<T>) {
    const tree: Record<string, any>[] = []
    const lookup: Record<string, Record<string, any>> = {}

    // 将列表转换为对象，以便快速查找
    list.forEach((item) => {
      lookup[item.id] = item
    })

    // 将对象转换为树结构
    list.forEach((item) => {
      if (item.pid === '') {
        // 如果pid为空字符串，表示这是一个根节点
        tree.push(lookup[item.id])
      } else {
        if (lookup[item.pid]) {
          if (lookup[item.pid].children === undefined) {
            lookup[item.pid].children = []
          }
          lookup[item.pid].children.push(lookup[item.id])
        }
      }
    })

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
   * @param formatString 日期格式，默认为：yyyy-MM-dd HH:mm:ss
   * @returns {*}
   */
  dateFormat(d: string | number | object, formatString?: string) {
    let date: Date
    let fmt = formatString || 'yyyy-MM-dd HH:mm:ss'
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
   * 将时间转为XX时间之前
   * const time = "2024-03-04 16:18:40";
   * const result = timeAgo(time);
   * @param time 格式如："2024-03-04 16:18:40"
   */
  timeAgo(time: string) {
    const now = new Date()
    const givenTime = new Date(time)
    // @ts-ignore
    const seconds = Math.floor((now - givenTime) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    if (seconds < 60) {
      return '刚刚'
    } else if (minutes < 60) {
      return `${minutes}分钟前`
    } else if (hours < 24) {
      return `${hours}小时前`
    } else if (days < 7) {
      return `${days}天前`
    } else if (weeks < 4) {
      return '一周前'
    } else {
      // 计算月份差异，需要考虑不同月份的天数差异
      const nowMonth = now.getMonth()
      const nowYear = now.getFullYear()
      const givenMonth = givenTime.getMonth()
      const givenYear = givenTime.getFullYear()
      let monthDifference = (nowYear - givenYear) * 12 + nowMonth - givenMonth
      if (now.getDate() < givenTime.getDate()) {
        // 如果当前日期小于给定日期，那么月份差异需要减1
        monthDifference -= 1
      }
      if (monthDifference === 1) {
        return '1个月前'
      } else if (monthDifference < 12) {
        return `${monthDifference}个月前`
      } else {
        return `${Math.floor(monthDifference / 12)}年前`
      }
    }
  }

  /**
   * 获取对象的属性值
   * @param obj
   * @param propPath 支持链式，如x.y.z
   */
  getProperty(obj: object, propPath: string) {
    let propPaths: string[] = []
    // 如果属性路径是字符串，按点分割
    if (typeof propPath === 'string') {
      propPaths = propPath.split('.')
    }
    // 递归访问属性
    return propPaths.reduce((acc: Record<string, any>, part: string) => {
      if (acc && acc.hasOwnProperty(part)) {
        return acc[part]
      }
      return undefined
    }, obj)
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
    let isJ = false
    try {
      if (typeof val === 'string' && val) {
        const obj = JSON.parse(val)
        if (typeof obj === 'object' && obj) {
          isJ = true
        }
      }
    } catch (e) {
      isJ = false
    }
    return isJ
  }

  /**
   * 查询选项值对应标题
   * @param optionValue 选项值
   * @param data 选项集合
   */
  getOptionLabel(optionValue: string | number | boolean, data: any[]) {
    if (data && data.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data) {
        if (item.value === optionValue) {
          return item.label
        }
      }
    }
    return ''
  }

  /**
   * 将map构建成url参数
   * @param params
   */
  getUrlParams(params: Record<string, any>) {
    const parameters = []
    for (const key in params) {
      parameters.push(`${key}=${encodeURIComponent(params[key])}`)
    }
    return parameters
  }

  /**
   * Clipboard Api
   * @param value
   * @param successMsg
   * @param failMsg
   */
  copyToClipboard = async (value: string, successCallBack: any, failCallBack?: any) => {
    try {
      await navigator.clipboard.writeText(value)
      if (successCallBack && typeof successCallBack === 'function') successCallBack(value)
    } catch (err) {
      if (failCallBack && typeof failCallBack === 'function') failCallBack(value)
    }
  }

  /**
   * 生成随机数
   * @param extent
   * @constructor
   */
  generateRandom(extent?: number) {
    extent = extent && extent > 0 ? extent : 32
    const chars = '0123456789'
    let result = ''
    for (let i = 0; i < extent; i += 1) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      result += chars[randomIndex]
    }
    return result
  }

  toChineseCurrency(num: number | string) {
    return toChineseCurrency(num)
  }

  /**
   *  字符串转对象格式，如应用于多币种的值转换
   *  @param str 多币种字符串格式：CNY:18145.1;USD:176.48
   *  @param separator 默认为：“;”
   *  @return  对象{CNY:18145.1,USD:176.48}，为空时{}
   */
  convertStrToObj(str: string,separator?:string) {
    if (str) {
      let parsedAmount: Record<string, string | number> = {}
      str.split(separator || ';').forEach((segment) => {
        let kvs = segment.split(':')
        parsedAmount[kvs[0]] = kvs[1]
      })
      return parsedAmount
    }
    return {}
  }

  /**
   * 简单的对象转为字符串格式，如应用于多币种的值转换
   * @param obj 如 {CNY:18145.1,USD:176.48}
   * @param separator 默认为：“;”
   * @return 如 CNY:18145.1;USD:176.48
   */
  convertObjToStr(obj: Record<string, string>,separator?:string) {
    return Object.keys(obj)
      .map(key => `${key}:${obj[key]}`)
      .join(separator || ';')
  }
}

const utils = new Utils()
export default utils
