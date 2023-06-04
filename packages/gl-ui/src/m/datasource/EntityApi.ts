import axios, {type AxiosInstance, type AxiosRequestConfig} from "axios";
import ResultMapping from "../datasource/ResultMapping";
import UrlConfig from "../datasource/UrlConfig";
import MixUtil from "../utils/MixUtil";
import type {EntityReader, EntityReaderParam} from "./EntityDataSource";
import type {LooseObject} from "../mix/LooseObject";
import AllUtils from "../utils/AllUtils";

export class EntityApi {
    url = new UrlConfig();

    service: AxiosInstance;

    VITE_API_BASE_URL: string = ''

    constructor(url?: UrlConfig, options?: AxiosRequestConfig) {
        if (url) {
            this.url = url;
        }
        // console.log('import.meta.env', import.meta.env)
        // console.log('import.meta.env.VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL)
        // this.VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL
        // if (!this.VITE_API_BASE_URL) {
        //     console.error('未配置环境变量VITE_API_BASE_URL')
        // }
        // axios.all('*', function (req, res, next) {
        //   res.header("Access-Control-Allow-Origin", "*")
        //   res.header("Access-Control-Allow-Headers", "Authorization,Origin, X-Requested-With, Content-Type, Accept")
        //   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
        //   next()
        // })
        this.service = this.reCreate(options)
        // if (options && typeof options.interceptors === 'function') {
        //     options.interceptors(service)
        // }
    }

    reCreate(options?: AxiosRequestConfig) {
        const opts = {
            baseURL: (options && options.baseURL) || (this.VITE_API_BASE_URL || ''), // api base url，在env文件中配置
            timeout: (options && options.timeout) || 6000, // 请求超时时间
            headers: (options && options.headers) || {
                //   'Request-Method': 'PUT,POST,GET,DELETE,OPTIONS',
                //   'Request-Headers': 'Authorization,Origin, X-Requested-With, Content-Type, Accept',
                "Access-Control-Allow-Origin": "*",
                //   'Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
                //   'Allow-Headers': 'Authorization,Origin, X-Requested-With, Content-Type, Accept'
            },
            withCredentials: true,
            // crossDomain: true
        }
        this.service = axios.create(opts);
        // console.log('EntityApi > reCreate() > service options:', opts)
        return this.service
    }

    /**
     * 基于mql对象进行查询
     * @param mql Object or mqlArray
     * @param withMeta 是否需同时查询出各列表字段的元数据信息
     * @returns {*}
     */
    queryByGql(mql: object | Array<object>, withMeta?: boolean) {
        const path = Array.isArray(mql)
            ? this.url.metaMultiList
            : this.url.metaList;
        return this.service({
            url: `${path}?withMeta=${!!withMeta}`,
            method: "POST",
            data: mql,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        });
    }

    /**
     * 基于实体数据源查询
     * 分页默认为1页10条记录
     * @param entityReader
     * @returns {*}
     */
    queryByEntityReader(entityReader: EntityReader) {
        const mql: LooseObject = {};
        mql[entityReader.entity] = {}
        // fields
        if (entityReader.fields && entityReader.fields.length > 0) {
            const fieldNames: Array<string> = []
            entityReader.fields.forEach((item) => {
                fieldNames.push(item.name)
            })
            mql[entityReader.entity]['@fs'] = fieldNames.join(',');
        } else {
            mql[entityReader.entity] = {"@fs": "*"};
        }
        // order
        if (entityReader.order && entityReader.order.length > 0) {
            let orderStr = ''
            entityReader.order.forEach((item) => {
                orderStr = item.field + ' ' + item.order + ' '
            })
            orderStr = AllUtils.ConvertUtil.trim(orderStr)
            mql[entityReader.entity]['@order'] = orderStr;
        }
        // params
        const params: LooseObject = {};
        if (entityReader.params && entityReader.params.length > 0) {
            for (const i in entityReader.params) {
                const param: EntityReaderParam = entityReader.params[i];
                // param.cop的值为：eq,neq,lt,lte,gt,gte,startwith,endwith,contains,in中的一个
                const key = `${param.name}|${param.cop || "eq"}`;
                params[key] = param.value;
            }
        }
        Object.assign(mql[entityReader.entity], params);

        const pageNo = entityReader.pageNo || 1
        const pageSize = entityReader.pageSize || 10
        // page
        mql[entityReader.entity]['@p'] = pageNo + ',' + pageSize;

        return this.queryByGql(mql, entityReader.withMeta);
    }

    /**
     * 实体查询，内部依据参数构建mql对象进行查询
     * 更复杂、高级的查询@see queryByGql
     * @param entityName e.g. platform_dev_project
     * @param fieldNames 查询的列字段 e.g. id,name
     * @param params 查询要件键值对 e.g. {id:123456,name:'张三'} or {'@order':'name|+'}
     */
    query(
        entityName: string,
        fieldNames: string,
        params: object,
        withMeta?: boolean
    ) {
        if (!fieldNames) {
            // eslint-disable-next-line no-throw-literal
            throw "查询列（fieldNames）不能为空。";
        }
        // mql查询语句
        const mql: LooseObject = {};
        mql[entityName] = {
            "@fs": fieldNames || "*",
        };
        Object.assign(mql[entityName], params);
        return this.queryByGql(mql, withMeta);
    }

    /**
     * 批量查询
     * @param queryParamArray [{entityName:String,keyValues:{key1:value1,key2:value2,...},fieldNames:'id,name,...'},...]
     *        @see query
     */
    queryBatch(queryParamArray: Array<object>, withMeta: boolean) {
        const mqlAry: Array<any> = [];
        queryParamArray.forEach((item, index) => {
            const queryParam: LooseObject = item;
            const mql: LooseObject = {};
            mql[queryParam.entityName] = {
                "@fs": queryParam.fieldNames || "*",
            };
            Object.assign(mql[queryParam.entityName], queryParam.keyValues);
            mqlAry.push(mql);
        });
        return this.queryByGql(mqlAry, withMeta);
    }

    update(
        url: string,
        entityName: string,
        keyValues: object,
        biz?: string,
        successMsg?: string,
        errorMsg?: string
    ) {
        const bizCode = biz || "0";
        const data: LooseObject = {
            "@biz": bizCode,
        };
        data[entityName] = keyValues || {};
        return this.service({
            url: `${url}/${bizCode}`,
            method: "POST",
            data,
        });
    }

    /**
     * @param entityName 实体名称
     * @param keyValues Object类型
     * @returns {*}
     */
    save(
        entityName: string,
        keyValues: object,
        biz?: string,
        successMsg?: string,
        errorMsg?: string
    ) {
        return this.update(
            this.url.apiMetaSave,
            entityName,
            keyValues,
            biz,
            successMsg || "保存成功",
            errorMsg || "保存失败"
        );
    }

    /**
     * 基于mql对象进行查询
     * @param mqlObject or mqlArray
     * @param biz 业务代码
     * @returns {*}
     */
    saveByGql(biz: string, mql: LooseObject) {
        const path = Array.isArray(mql)
            ? this.url.apiMetaSave
            : this.url.apiMetaSave;
        const bizCode = biz || "0";
        return this.service({
            url: `${path}/${bizCode}`,
            method: "POST",
            data: mql,
        });
    }

    delete(entityName: string, keyValues: object, biz?: string) {
        return this.update(this.url.apiMetaDelete, entityName, keyValues, biz);
    }

    /**
     * 批量删除
     * @param items
     * @param biz
     */
    deleteBatch(items: Array<{ entityName: string, keyValues: object }>, biz?: string) {
        if (!items) {
            return
        }
        let result = undefined
        let that = this
        // TODO 需后台服务提供批量删除的方法，暂无事务单个删除
        items.forEach((item) => {
            result = that.delete(item.entityName, item.keyValues, biz)
        })
        return result
    }

    /**
     * 通过页面ID获取页面配置信息
     * @param pageId
     * @returns {*}
     */
    queryPageById(pageId: string) {
        // mql查询语句
        const mql = {
            platform_app_page: {
                "@p": "1,1",
                "@fs": "id,code,releaseContent",
                id: pageId,
            },
        };
        return this.service({
            url: this.url.metaList,
            method: "POST",
            data: mql,
        });
    }

    /**
     * 通过应用页面树节点ID获取页面配置信息
     * @param extendId
     * @returns {*}
     */
    queryPageByExtendId(extendId: string) {
        // mql查询语句
        const mql = {
            platform_app_page: {
                "@p": "1,1",
                "@fs": "id,code,releaseContent",
                extendId: extendId,
            },
        };
        return this.service({
            url: this.url.metaList,
            method: "POST",
            data: mql,
        });
    }

    /**
     * 返回数据处理
     * @param res 请求响应（response）
     * @param resultMapping res中的数据返回结果转换定义
     * @returns {{data: Array, resultMapping: {}}}
     */
    static entityReaderResultHandler(
        res: LooseObject,
        resultMapping: ResultMapping
    ) {
        console.log(
            "gl-ui > Api.js > entityReaderResultHandler() > res: ",
            res
        );
        const resultSet: LooseObject = {
            //  依据传入参数resultMapping的定义处理后的数据
            data: [],
            // 经转换之后的列映射，key为组件中用到的变量名，value为data中的列名。
            resultMapping: new ResultMapping(),
        };

        // 返回结果预处理
        // 获取返回结果的列名
        const resColumns: LooseObject = {};
        if (res.data && res.data.length > 0) {
            const item = res.data[0];
            const resultFieldNameAry = Object.keys(item);
            // eslint-disable-next-line guard-for-in,no-restricted-syntax
            for (const i in resultFieldNameAry) {
                resColumns[resultFieldNameAry[i]] = resultFieldNameAry[i];
            }
        }
        // 先找出需处理的列：resultMapping的key和value不相同，mapping，e.g. [{avatar:'https://xxxxx/xx/xx.jpg'}]
        const toStatMappingItems: Array<any> = [];
        // console.log('gl-ui > toStatMappingItems>', toStatMappingItems)
        const mapping = resultMapping.getMapping();
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const key in mapping) {
            const field = mapping[key];
            // let resultName = resColumns[field]
            if (key !== field) {
                const isRename = resColumns[field] !== undefined && !!resColumns[field];
                toStatMappingItems.push({key, value: field, isRename});
                resultSet.resultMapping[key] = key;
            }
        }
        // console.log(
        //   'gl-ui > Api.js > entityReaderResultHandler() > resColumns: ',
        //   resColumns
        // );
        // console.log(
        //   'gl-ui > Api.js > entityReaderResultHandler() > resultMapping: ',
        //   resultMapping
        // );
        // console.log(
        //   'gl-ui > Api.js > entityReaderResultHandler() > toStatMappingItems: ',
        //   toStatMappingItems
        // );

        // 如增加静态的列，列值格式化、列值组合;重命名列(在原有列的基础上增加重命名的列)等
        const dataItems = res.data as Array<any>;
        dataItems.forEach((dataItem) => {
            toStatMappingItems.forEach((mappingItem, index) => {
                if (mappingItem.isRename) {
                    dataItem[mappingItem.key] = dataItem[mappingItem.value];
                } else {
                    dataItem[mappingItem.key] = MixUtil.evalPlus(
                        mappingItem.value,
                        dataItem
                    );
                }
            });
        });
        resultSet.data = res.data;
        console.log(
            "gl-ui > Api.js > entityReaderResultHandler() > resultSet: ",
            resultSet
        );
        return resultSet;
    }

    /**
     * 实体对像的数据转换
     * @param <Object> data 简单一层对象，如：{id:'123456',name:'张三'}
     * @param <Object> dataMapping  可为可层对象，如两层对像：{query: {fullName: '$ctx.name'}}
     * @return <Object> 若dataMapping为空，则直接返回data，{query: {fullName: '张三'}}
     */
    entityDataMappingHandler(data: LooseObject, dataMapping: LooseObject = {}) {
        const convertedData: LooseObject = {};
        Object.keys(dataMapping).forEach((value, key) => {
            if (typeof value === "object") {
                convertedData[key] = this.entityDataMappingHandler(data, value);
            } else {
                convertedData[key] = MixUtil.evalPlus(value, data);
            }
        });
        // for (const key in dataMapping) {
        //
        // }
        return convertedData;
    }

    /**
     * 查询数据定义信息，即元数据信息
     * @param mqlObject or mqlArray
     * @param withMeta 是否需同时查询出各列表字段的元数据信息
     * @returns {*}
     */
    queryMeta(entityName: string) {
        return this.service({
            url: `${this.url.apiMetaDefined}/${entityName}`,
            method: "POST",
            data: "",
        });
    }

    queryEntityNames() {
        return this.service({
            url: `${this.url.apiMetaEntityNames}/`,
            method: "POST",
            data: "",
        });
    }

    queryEntityLiteMetas(appCode: string = "platform") {
        return this.service({
            url: `${this.url.apiEntityLiteMetas}?appCode=${appCode}`,
            method: "GET",
            data: "",
        });
    }

    /**
     *
     * @param path e.g. url:/api/cache/，path:/cache/
     * @returns {*}
     */
    // queryList(path: string, data: object) {
    //   return this.service({
    //     url: this.url.api + path,
    //     method: "POST",
    //     data,
    //   });
    // }

    getService() {
        return this.service;
    }
}

const entityApi = new EntityApi();
export {entityApi};
export default EntityApi;
