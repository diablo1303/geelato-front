/**
 *  api的baseUrl由protocol、hostname、port三段组成
 *  默认hostname、protocol、port会与当前的站点的一致
 *  这样在生产环境中使用时，只需要配置接口服务的商品port如8080
 *  多个域名下都可以使用
 */
const getApiBaseUrl = () => {
  if (
    import.meta.env.VITE_API_BASE_PROTOCOL ||
    import.meta.env.VITE_API_BASE_HOSTNAME ||
    import.meta.env.VITE_API_BASE_PORT
  ) {
    const protocol = import.meta.env.VITE_API_BASE_PROTOCOL || window.location.protocol
    const hostname = import.meta.env.VITE_API_BASE_HOSTNAME || window.location.hostname
    const port = import.meta.env.VITE_API_BASE_PORT || window.location.port
    return `${protocol}://${hostname}:${port}`
  }
  return ''
}


export class ApiPathName {
  metaList = "/api/meta/list";

  metaMultiList = "/api/meta/multiList";

  apiMetaSave = "/api/meta/save";

  // 批量保存，针对同一实体，多条记录批量保存
  apiMetaBatchSave = "/api/meta/batchSave";

  // 多实体同时保存
  apiMetaMultiSave = "/api/meta/multiSave"

  // 基于id删除单条记录
  apiMetaDelete = "/api/meta/delete";

  // 支持按参数删除，即可以删除多个
  apiMetaDelete2 = "/api/meta/delete2";

  apiMetaEntityNames = "/api/meta/entityNames";

  apiEntityLiteMetas = "/api/meta/entityLiteMetas";

  apiMetaDefined = "/api/meta/defined";

  apiUpload = "/api/upload/file";

  api = "/api";
}

const getApiPathName = ()=>{
  return new ApiPathName()
}

export default () => {
  return { getApiBaseUrl,getApiPathName: getApiPathName }
}
