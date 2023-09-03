import type {ComponentInstance} from "@geelato/gl-ui-schema";

/**
 * 获取组件的label
 * 由于部分组件没有label属性或另有属性，这里提供统的方法进行获取
 */
export const getLabel = (inst: ComponentInstance) => {
    // if (!inst.props?.label) {
    //     console.log('通过inst.props?.label获取不到label，inst为:', inst)
    // }
    // 表格组件，inst.props?.base?.label
    // GlPage， inst.props?.pageTitle
    return inst.props?.label || inst.title || inst.props?.base?.label || inst.props?.pageTitle
}