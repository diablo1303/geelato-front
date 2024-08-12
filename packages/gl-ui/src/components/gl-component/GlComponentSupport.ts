import jsScriptExecutor, { Ctx } from '../../m/actions/JsScriptExecutor'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import { RuleExpression } from '../../index'

/**
 * 创建正则表达式校验器
 * @param expression js表达式
 */
const createValidator = (expression: string, message: string) => {
  return (value: string, callback: (error?: string) => void) => {
    // 失败时返回异常的信息
    const message = jsScriptExecutor.evalExpression(expression, {value})
    if (message) {
      callback(message)
    }
  }
}

/**
 * 要求只在运行时执该方法
 * 尝试解析规则，构建自定校验规则器
 * @param inst
 */
export function tryParsePropsRulesInRuntime(inst: ComponentInstance) {
  // 对于表单输入组件设置有规则的，检查是否有自定义的校验规则，如果进行转换
  if (inst.group === 'dataEntry' && inst.props?.rules) {
    // {
    //   "type": "_exp",
    //   "message": "格式不符合",
    //   "ruleName": "type"
    // }
    // @ts-ignore 在此平台中rules是数组
    inst.props.rules.forEach((rule: {[RuleExpression]?: string, message?: string }) => {
      // @ts-ignore
      if (rule[RuleExpression]) {
        // @ts-ignore
        inst.props.rules.push({
          // @ts-ignore
          validator: createValidator(rule[RuleExpression], rule.message || '输入不符合规则')
        })
      }
    })
  }
}

/**
 * 一级属性为非对象、非数据组的场景
 * 转换计算实例的一级属性，并把计算的结果值设置到一级属性中
 * @param inst
 * @param ctx
 */
export function executeInstPropsExpressions(inst: ComponentInstance, ctx: object) {
  if (inst) {
    let hasValueExpression = false
    let hasPropsExpression = false
    if (inst.propsExpressions) {
      Object.keys(inst.propsExpressions).forEach((key: string) => {
        // @ts-ignore
        const propsExpression = inst.propsExpressions[key]
        if (propsExpression) {
          if (key === '_valueExpression') {
            hasValueExpression = true
            // 组件值
            // console.log(inst.componentName,inst.id,'inst.value:',inst.value,'inst.value === undefined:',inst.value === undefined,inst)
            // if(inst.value === undefined){
            // 如果组件值已存在，则不设置默认值；不存在时（为undefined）才设置
            // }
            inst.value = jsScriptExecutor.evalExpression(propsExpression, ctx)
          } else {
            // 属性值
            inst.props[key] = jsScriptExecutor.evalExpression(propsExpression, ctx)
            hasPropsExpression = true
            // console.log(inst.props.label, key, inst.props[key], propsExpression)
          }
        }
      })
    }
    if (!hasValueExpression) {
      // 若前面属性的值表达式中(inst.propsExpressions._valueExpression)没有设置时，则取组件的默认值（props._valueExpression）
      // 注意：props._valueExpression是组件的默认值，不是表达式
      if (inst.props && inst.props._valueExpression) {
        inst.value = inst.props._valueExpression
      }
    }
    return { hasValueExpression, hasPropsExpression }
  }
}

/**
 * 一级属性为对象、数据组的场景
 * 递归计算二、三、四。。。级属性值，并将计算结果设置回相应的属性值中
 * 如GlEntityTable的{base:{xx:yy,xx2:yy2}}
 * @param obj
 * @param ctx
 */
export function executeObjectPropsExpressions(obj: any, ctx: object) {
  // @ts-ignore
  if (obj && typeof obj === 'object') {
    // console.log('executeObjectPropsExpressions() > obj:', obj, 'ctx:', ctx)

    if (obj.length !== undefined) {
      // array
      for (const objKey in obj) {
        executeObjectPropsExpressions(obj[objKey], ctx)
      }
    } else {
      // 对象中有组件
      if (obj.componentName) {
        executeInstPropsExpressions(obj, ctx)
      }

      // object
      if (obj._propsExpressions) {
        Object.keys(obj._propsExpressions).forEach((key: string) => {
          const expression = obj._propsExpressions[key]
          if (expression) {
            obj[key] = jsScriptExecutor.evalExpression(expression, ctx)
          }
        })
      }

      // 处理对象的子级
      for (const objKey in obj) {
        executeObjectPropsExpressions(obj[objKey], ctx)
      }
    }
  }
}

export function executeArrayExpressions(ary: object[], ctx: object) {
  ary?.forEach((item) => {
    executeObjectPropsExpressions(item, ctx)
  })
}

/**
 * 运行属性表达式
 * 依据propsExpression设置的各属值的值表达式，计算出值，并合设置到props中，覆盖props中相应属性的值
 * @param glComponentInst
 * @param ctx
 */
export const executePropsExpressions = (glComponentInst: any, ctx: Ctx) => {
  // console.log('executePropsExpressions() > ctx:', glComponentInst.componentName, glComponentInst.props.label, ctx, glComponentInst)
  const result = executeInstPropsExpressions(glComponentInst, ctx)
  executeObjectPropsExpressions(glComponentInst.props, ctx)
  // console.log('_hidden',glComponentInst.props._hidden)
  return result
}

/**
 * 组件设置到pageProxy的时机，对于最原子的组件，即组件不引用其它动态组件，则
 * @param componentName
 */
// export const isSetRefOnMounted = (componentName:string)=>{
//
// }
