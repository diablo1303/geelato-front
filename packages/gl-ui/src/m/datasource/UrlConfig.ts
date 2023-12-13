export default class UrlConfig {
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

