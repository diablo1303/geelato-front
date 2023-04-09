import type {LooseObject} from "../mix/LooseObject";

export class Utils {
    constructor() {
    }

    /**
     * param({k1: {k2: {k3: 'value'}}}), output: k1.k2.k3=value
     * param({k1: 'value'}, 'p')), output:p.k1=value
     * param({k1: [{kk1: 'vv1'}, {kk2: 'vv2'}]}, 'p')), output:p.k1[0].kk1=vv1&p.k1[1].kk2=vv2
     * @param param
     * @param prefix
     * @returns {string}
     */
    // param(param: object, prefix: string) {
    //     let str = ''
    //     if (param instanceof Array || param instanceof Object) {
    //         for (let k in param) {
    //             let subPrefix = prefix ? (prefix + (param instanceof Array ? '[' + k + ']' : '.' + k)) : k
    //             str += '&' + this.param(param[k], subPrefix)
    //         }
    //     } else {
    //         if ('string|number|boolean'.indexOf(typeof param) !== -1) {
    //             str += '&' + prefix + '=' + encodeURIComponent(param)
    //         } else {
    //             // undefined  RegExp func
    //         }
    //     }
    //     return str.substr(1)
    // }

    /**
     * 为path增加参数，存已存在同名的参数则覆盖
     * @param path
     * @param param {key:value,key2,value2}
     */
    // addParamToPath(url, params) {
    //     if (!params || typeof params !== 'object' || Array.isArray(params)) {
    //         return url
    //     }
    //     let route = this.parseUrl(url)
    //     for (let key in params) {
    //         route.query[key] = params[key]
    //     }
    //     return route.path + '?' + this.param(route.query)
    // }

    /**
     * 解析url，提取path及query
     * @param url
     * @returns {{path: string, query}}
     */
    // parseUrl(url) {
    //     let qIndex = url.indexOf('\\?')
    //     let path = qIndex !== -1 ? url.substring(0, qIndex) : url
    //     let mixQuery = {}
    //     if (qIndex > 0) {
    //         let paramAry = url.substring(qIndex + 1).split("\\&")
    //         for (let index in paramAry) {
    //             let param = paramAry[index]
    //             let segment = this.trim(param)
    //             if (segment.length > 0) {
    //                 let keyValues = segment.split('=')
    //                 if (keyValues.length === 2) {
    //                     mixQuery[keyValues[0]] = keyValues[1]
    //                 }
    //             }
    //         }
    //     }
    //     return {
    //         path: path,
    //         query: mixQuery
    //     }
    // }

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
     * @param maxLength 加上prefix和连接符“_”总的gid长度，默认为16
     */
    gid(prefix?: string, maxLength?: number) {
        if (prefix) {
            return `${prefix}_${this.uuid(maxLength || 16 - prefix.length - 1)}`
        }
        return this.uuid(16)
    }

    uuid(len: number, radix?: number) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
        let uuid = []
        let i
        radix = radix || chars.length

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
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
                    r = 0 | Math.random() * 16
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
                }
            }
        }
        return uuid.join('')
    }

    /**
     * 直接执行eval
     * @param expression
     * @param $ctx 用于expression的上下文参数
     * @param ctxName 指定上下文的参数名，默认为$ctx
     * @returns {*}
     */
    evalPlus(expression: string, ctx: object, ctxName = '$ctx', $utils?: object, utilsName?: string) {
        console.log('gl-ui > utils > eval() > expression: ', expression)
        console.log('gl-ui > utils > eval() > ctx: ', ctx)
        // if (expression.indexOf(ctxName) === -1) {
        //     return expression
        // }
        let Fn = Function
        let uName = utilsName || '$utils'
        let str = this.trim(expression)
        let index = str.indexOf(';')
        // if (index === -1 || index === str.length - 1) {
        //     // 单语句
        //     return new Fn(ctxName, uName, 'return ' + expression)(ctx, $utils || {})
        // } else {
        //     // 多语句
        //     let strAry = str.split(';')
        //     let lastStr = strAry.pop();
        //     let preStr = strAry.join(';')
        //     return new Fn(ctxName, uName, preStr + '; return ' + lastStr)(ctx, $utils || {})
        // }
        return new Fn(ctxName, uName,  expression)(ctx, $utils || {})
    }

    /**
     * 替换对象中的变量，若字符串以“js:”开头，则还需执行(eval)
     * @param obj e.g. js:@.id > 0，变量标识：“@.”
     * @param keyValues 基本数据类型键值对
     * @returns {*} 如上示例，当id=1jf ,结果为执行1>0即true
     */
    invoke(obj: object, keyValues: object) {
        let keyword = '@.'
        let jsFlag = 'js:'
        // let objCopy
        if (typeof obj === 'string') {
            let expression: string = obj
            if (expression.startsWith(jsFlag)) {
                return this.evalPlus(expression.replace(jsFlag, '').replace(/@\./g, '$ctx.'), keyValues)
            } else {
                if (expression.indexOf(keyword) !== -1) {
                    return this.evalPlus(expression.replace(/@\./g, '$ctx.'), keyValues)
                    // return this.compileString(expression, keyValues)
                } else {
                    return expression
                }
            }
        } else if (Array.isArray(obj)) {
            let arrayCopy: Array<any> = []
            for (let index in obj) {
                arrayCopy[index] = this.invoke(obj[index], keyValues)
            }
            return arrayCopy
        } else if (typeof obj === 'object') {
            let objCopy: LooseObject = {}
            Object.assign(objCopy, obj)
            for (let i in objCopy) {
                // console.log('gl-ui > 解析替换' + i, objCopy[i], keyValues, this.invoke(objCopy[i], keyValues))
                objCopy[i] = this.invoke(objCopy[i], keyValues)
            }
            return objCopy
        }
        return obj
    }

    /**
     * 依据上下文信息，编译字符串
     * @param expression
     * @returns {*}
     */
    compileString(expression: string, $ctx: object) {
        let Fn = Function
        // console.log(new Fn('$ctx', 'return "' + expression + '"'))
        return new Fn('$ctx', 'return "' + expression + '"')($ctx)
    }

    /**
     * 检查安全性
     */
    checkJsExpressionSecurity(jsExpression: string) {
        return true
    }

    /**
     *
     * @param jsExpression 格式：js:xxx
     * @param ctx 上下文信息
     * @param ctxName 默认为 'ctx'
     * @return 符合格式要求的时，将js:xxx，中的xxx为作脚本执行；不符合时，直接返回当前jsExpression
     */
    runJs(jsExpression: string, ctx: object, ctxName = 'ctx') {
        if (/^\s*js\s*:/.test(jsExpression)) {
            return this.evalPlus(jsExpression.replace(/^\s*js\s*:/, ''), ctx, 'ctx')
        }
        return jsExpression
    }


    /**
     *  遍历对象各层的键值，并进行变量替换
     */
    deepConvertValue(obj: object, $_ctxLoader: object | Function) {
        const ctx = typeof $_ctxLoader === 'function' ? $_ctxLoader() : $_ctxLoader
        let that = this

        function replace(toReplaceObj: Array<any> | object | string | LooseObject) {
            if (toReplaceObj instanceof Array) {
                let newObj: Array<any> = []
                for (const key in toReplaceObj) {
                    newObj.push(replace(toReplaceObj[key]))
                }
                return newObj
            } else if (toReplaceObj instanceof Object) {
                let newObj: LooseObject = {}
                for (const key in toReplaceObj) {
                    let x: LooseObject = toReplaceObj
                    newObj[key] = replace(x[key])
                }
                return newObj
            } else if (typeof toReplaceObj === 'string') {
                console.log('this.deepConvertValue() > toReplaceString:', toReplaceObj)
                let newObj: LooseObject = that.evalPlus(toReplaceObj, ctx)
                return newObj
            } else {
                let newObj: LooseObject = toReplaceObj
                return newObj
            }
        }

        return replace(obj)
    }

    isEmpty(str: string) {
        return str === undefined || str === null || str.replace(/\s/g, '') === ''
    }

    isArray(ary: any) {
        if (typeof ary === 'object' && ary.length !== undefined) {
            return true
        }
        return false
    }

    isNullOrEmpty(obj: Object | undefined | null) {
        return obj === null || obj === undefined || (typeof obj === 'object' && Object.keys.length === 0)
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
            let value = sessionStorage.getItem(key)
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
        let alphaLocal = alpha || 1
        let sColor = hex.toLowerCase()
        // 十六进制颜色值的正则表达式
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
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
            let sColorChange = []
            for (let j = 1; j < 7; j += 2) {
                sColorChange.push(parseInt('0x' + sColor.slice(j, j + 2)))
            }
            return 'RGBA(' + sColorChange.join(',') + ',' + alphaLocal + ')'
        }
        return sColor
    }

    /**
     *函数定义
     * @param data 需转换的数组
     * @param id
     * @param pid
     */
// array2treetreeUtil (data, id, pid) {
//   let data = data
//   let id = id
//   let pid = pid
//   let tree = {}
//
//   function f () {
//
//   }
// }

    /**
     * 数组指定列去重，返回去重后的列对象
     * @param arr 数组
     * @param col
     */
    distinct(arr: Array<any>, col: string | number) {
        let resultArray = arr.reduce(function (result, item) {
            if (!(item[col] in result)) {
                result[item[col]] = item[col]
            }
            return result
        }, {})
        return resultArray
    }

    // stopPropagationAndPreventDefault(e) {
    //     if (e && e.stopPropagation) {
    //         e.stopPropagation()
    //     } else {
    //         // IE
    //         window.event.cancelBubble = true
    //     }
    //     // stopDefault 默认事件,比如点击a标签以后会跳转至href链接的页面
    //     if (e && e.preventDefault) {
    //         e.preventDefault()
    //     } else {
    //         window.event.returnValue = false
    //     }
    // }

    /**
     *
     * @param data 列表数据
     * @param pid  根id
     * @returns {Array}
     */
    listToTree(data: Array<any>, pid: string | number) {
        let tree = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].pid == pid) {
                let obj = data[i];
                temp = this.listToTree(data, data[i].id);
                if (temp.length > 0) {
                    obj.children = temp;
                }
                tree.push(obj);
            }
        }
        return tree;
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
        let o: LooseObject = {
            "M+": date.getMonth() + 1,  // 月份
            "d+": date.getDate(),  // 日
            "h+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            "S": date.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt
    }

    /**
     * 查找当前组件所在的页面组件
     * @param component 组件实例
     * @return 查找到当前组件所处的页面，若找不到则返回undefined
     */
    findCurrentPage(component: LooseObject): any {
        if (!component.$parent.$vnode) {
            // 到了根节点，还找不到，可能是在设计器中执行该方案，设计器的舞台中不存在GlPage
            return undefined
        }
        console.log('gl-ui > CtxHandler.js > findCurrentPage() > component.$parent):', component.$parent)
        if (component.$parent.glType === 'page') {
            return component.$parent
        } else {
            return this.findCurrentPage(component.$parent)
        }
    }

    /**
     * 查找当前控件（基础组件）所在的组件（高级组件）
     * @param control 组件实例
     * @return 查找到当前组件所处的页面，若找不到则返回undefined
     */
    findCurrentComponent(component: LooseObject): any {
        if (!component.$parent.$vnode) {
            // 到了根节点，还找不到，可能是在设计器中执行该方案，设计器的舞台中不存在GlPage
            return undefined
        }
        console.log('gl-ui > CtxHandler.js > findCurrentPage() > component.$parent):', component.$parent)
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
            return new Promise(resolve => setTimeout(resolve, ms))
        }

        await sleepMs(ms)
    }
}

const utils = new Utils()
export default utils
