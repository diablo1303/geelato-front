import type MethodParamMeta from "./MethodParamMeta";

export class MethodSetterMeta {
    // 方法名
    name: String = 'method';
    title: String = '方法标题';
    description?: String;
    params: Array<MethodParamMeta> = []

}

