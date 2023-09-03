import jsScriptExecutor, {Ctx} from "../../m/actions/JsScriptExecutor";
import type {ComponentInstance} from "@geelato/gl-ui-schema";


/**
 * 一级属性为非对象、非数据组的场景
 * 转换计算实例的一级属性，并把计算的结果值设置到一级属性中
 * @param inst
 * @param ctx
 */
export function executeInstPropsExpressions(inst: ComponentInstance, ctx: object) {
    if (inst && inst.propsExpressions) {
        Object.keys(inst.propsExpressions).forEach((key: string) => {
            // @ts-ignore
            const propsExpression = inst.propsExpressions[key]
            if (propsExpression) {
                if (key === '_valueExpression') {
                    // 组件值
                    inst.value = jsScriptExecutor.evalExpression(propsExpression, ctx)
                } else {
                    // 属性值
                    inst.props[key] = jsScriptExecutor.evalExpression(propsExpression, ctx)
                    // console.log(inst.props.label, key, inst.props[key], propsExpression)
                }
            }
        })
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
    // console.log('executePropsExpressions() > ctx:', glComponentInst.componentName, glComponentInst.props.label, ctx)
    executeInstPropsExpressions(glComponentInst, ctx)
    executeObjectPropsExpressions(glComponentInst.props, ctx)
    // console.log('_hidden',glComponentInst.props._hidden)
}