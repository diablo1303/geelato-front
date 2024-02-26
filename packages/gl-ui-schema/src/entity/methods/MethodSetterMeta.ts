import type MethodParamMeta from "./MethodParamMeta";

export class ReturnInfoMeta {
    // 如string | number | string[] 等
    returnType: string = ''
    // 对返回的内容进行补充描述
    description: string = ''
    // 内部的文档指引中的文档id
    docId: string = ''
}

export class MethodSetterMeta {
    // 方法名
    name: String = 'method';
    title: String = '方法标题';
    description?: String;
    params: Array<MethodParamMeta> = []
    returnInfo: ReturnInfoMeta = new ReturnInfoMeta()

}

