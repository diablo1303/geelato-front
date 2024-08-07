import type {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosStatic} from 'axios'
import MixUtil from '../utils/MixUtil'
import {type EntityReader, EntityReaderParam, EntityReaderParamGroup, EntitySaver} from './EntityDataSource'
import jsScriptExecutor from '../actions/JsScriptExecutor'
import utils from '../utils/Utils'
import useApiUrl from '../hooks/useApiUrl'
import entityQueryCache from '../datasource/EntityQueryCache'
import useLogger from '../hooks/useLogger'
import {getToken} from '../utils/Auth'

export type MqlObject = { [key: string]: { [key: string]: any } }
export type ParsedMqlResult = { key: string; mqlObj: Record<string, any> }

const logger = useLogger('entityApi')

// 保存对象示例
const entitySaverInstTemplate = new EntitySaver('必填，如entityABC')
entitySaverInstTemplate.record = {id: 'ID示例，为空表示新增', otherProp: '其它属性示例'}
delete entitySaverInstTemplate.id
delete entitySaverInstTemplate.pidName
delete entitySaverInstTemplate.recordStatus

/**
 * 检查是否为有效的EntitySaver格式
 * @param es
 */
const checkEntitySaver = (es: EntitySaver) => {
  const getMessage = (detail?: string) => {
    return `数据格式有误，${detail ? detail + '，' : ''}有效的EntitySaver格式示例：`
  }

  if (typeof es !== 'object' || utils.isArray(es)) {
    console.error(getMessage(), entitySaverInstTemplate, '当前对象如下：', es)
    throw new Error(getMessage())
  }
  if (!es.entity) {
    console.error(getMessage('entity属性不能为空'), entitySaverInstTemplate, '当前对象如下：', es)
    throw new Error(getMessage())
  }
  if (
    !es.record ||
    typeof es.record !== 'object' ||
    utils.isArray(es.record) ||
    Object.keys(es.record).length == 0
  ) {
    console.error(
      getMessage('record属性不能为空，且为格式为Record<string, any>'),
      entitySaverInstTemplate,
      '当前对象如下：',
      es
    )
    throw new Error(getMessage())
  }
  return true
}

/**
 * 检查mql对象的格式
 * @param mql
 */
const checkMqlObject = (mql: MqlObject | Array<MqlObject>): boolean => {
  if (Array.isArray(mql)) {
    let result = true
    for (const key in mql) {
      const mqlObject = mql[key]
      result = result && checkMqlObject(mqlObject)
    }
    return result
  } else {
    const entityName = Object.keys(mql)[0]
    const config = mql[entityName]
    const fieldNames = config['@fs']

    if (!fieldNames) {
      // eslint-disable-next-line no-throw-literal
      throw `查询${entityName},失败，列（fieldNames）不能为空。`
    }
    if (fieldNames.indexOf(',,') >= 0) {
      // eslint-disable-next-line no-throw-literal
      throw `查询${entityName}失败，列（fieldNames）格式不对,存在连续的",,"：${fieldNames}`
    }
    if (fieldNames.indexOf(',undefined') > 0 || fieldNames.indexOf('undefined,') > 0) {
      throw `查询${entityName}失败，列（fieldNames）格式不对,在存undefined值",,"：${fieldNames}`
    }
    // TODO 子对象验证
    return true
  }
}

export class EntityApi {
  url = useApiUrl().getApiPathName()

  // @ts-ignore
  service: AxiosStatic | AxiosInstance

  VITE_API_BASE_URL: string = ''

  options?: AxiosRequestConfig

  constructor() {
  }

  getAuthorization() {
    const token = getToken()
    if (token) {
      return `Bearer ${token}`
    } else {
      return undefined
    }
  }

  setup(axios: AxiosStatic | AxiosInstance) {
    this.service = axios
  }

  getAxios() {
    return this.service
  }

  /**
   * 基于mql对象进行查询
   * @param mql Object or mqlArray
   * @param withMeta 是否需同时查询出各列表字段的元数据信息
   * @param disabledClientQueryCache 禁止客户端本次从缓存中查询，且禁止客户端缓存本次查询结果，默认为否
   * @param bizCode
   * @returns {*}
   */
  queryByMql(
    mql: MqlObject | Array<MqlObject>,
    withMeta?: boolean,
    disabledClientQueryCache?: boolean,
    bizCode?: string
  ): Promise<any> {
    const isArray = Array.isArray(mql)
    const path = isArray ? this.url.metaMultiList : this.url.metaList

    // 检查查询对象格式
    checkMqlObject(mql)

    // 增加请求缓存
    const key = JSON.stringify(mql)
    const cachePromise = entityQueryCache.get(key)
    // 缓存时长，默认5秒，需要特殊指定的可在些配置，如字典，两分钟缓存时间
    const defaultTime = 5000
    const minutes = 60000
    const entityTime: Record<string, number> = {
      platform_dict_item: minutes * 5,
      platform_province: minutes * 60,
      platform_user: minutes * 5
    }
    if (!disabledClientQueryCache && cachePromise) {
      // logger.debug(`查询实体：${Object.keys(mql)[0]}，从缓存中获取数据`)
      return cachePromise
    } else {
      // logger.debug(`查询实体：${Object.keys(mql)[0]}，从服务端获取数据`)
      const entityName = Object.keys(mql)[0]
      const promiseResult = this.service({
        url: `${path}?withMeta=${!!withMeta}&biz=${bizCode}&e=${
          isArray ? '_multiEntity' : entityName
        }`,
        method: 'POST',
        data: mql
      })
      // 2秒缓存，解决短时间内大量相同的数据查询问题，如列表的字典、实体查询
      if (!disabledClientQueryCache) {
        entityQueryCache.set(key, promiseResult, entityTime[entityName] || defaultTime)
      }
      return promiseResult
    }
  }

  /**
   * 将entityReader对象转换mql对象
   * 若无设置delStatus值，默认加上条件delStatus|eq:0
   * 若无设置排序，则默认加上排序updateAt|-
   * 以上规则对platform_oprecord例外
   * @param entityReader
   */
  convertEntityReaderToMql(entityReader: EntityReader): MqlObject {
    const ignoreDeleteStatusEntity = ['platform_oprecord']
    const ignoreOrderByUpdateAtEntity = ['platform_oprecord']
    // logger.debug('queryByEntityReader > entityReader', entityReader.entity, entityReader)
    const mql: Record<string, any> = {}
    mql[entityReader.entity] = {}
    // 1-fields
    if (entityReader.fields && entityReader.fields.length > 0) {
      const fieldNames: Array<string> = []
      entityReader.fields.forEach((item) => {
        if (!item.isLocalComputeFiled) {
          fieldNames.push(item.name + (item.alias ? ' ' + item.alias : ''))
        }
      })
      mql[entityReader.entity]['@fs'] = fieldNames.join(',')
    } else {
      mql[entityReader.entity] = {'@fs': '*'}
    }
    // 2-order
    if (entityReader.order && entityReader.order.length > 0) {
      let orderStrs: string[] = []
      entityReader.order.forEach((item) => {
        orderStrs.push(item.field + '|' + item.order)
      })
      // orderStr = AllUtils.ConvertUtil.trim(orderStr)
      mql[entityReader.entity]['@order'] = orderStrs.join(',')
    } else {
      // 无排序时，加默认排序，新增（即更新时间）的放前面
      if (ignoreOrderByUpdateAtEntity.indexOf(entityReader.entity) === -1) {
        mql[entityReader.entity]['@order'] = 'updateAt|-'
      }
    }
    // 3-params
    // 支持多层嵌套分组，有多个分组时顶层分组之间会转换成and查询；支持分组即“（）”嵌套
    // 分组示例配置格式：or:groupA>and:subGroupB
    // 如上例，多个or:groupA开头的成为一个分组，多个and:subGroupB组成一组and条件，并与多个or:groupA组成or条件
    const defaultGroupName = EntityReaderParamGroup.DEFAULT_NAME
    const subGroupFlag = EntityReaderParamGroup.GROUP_SPLIT_FLAG
    let hasDelStatus = false

    if (entityReader.params && entityReader.params.length > 0) {
      // 1、先进行分组 2、再将eq条件放在前面 3、再放like条件
      // const paramsGroups: Record<string, EntityReaderParam[]> = {}
      // for (const i in entityReader.params) {
      //   const param: EntityReaderParam = JSON.parse(JSON.stringify(entityReader.params[i]))
      //   param.groupName = param.groupName || defaultGroupName
      //   const groupName = param.groupName.split(subGroupFlag)[0]
      //   paramsGroups[groupName] = paramsGroups[groupName] || []
      //   paramsGroups[groupName].push(param)
      //   if (param.name === 'delStatus') {
      //     hasDelStatus = true
      //   }
      // }
      const paramsGroups: Record<string, EntityReaderParamGroup> = {}
      for (const i in entityReader.params) {
        const param: EntityReaderParam = new EntityReaderParam(
          entityReader.params[i].name,
          entityReader.params[i].cop,
          entityReader.params[i].value,
          entityReader.params[i].groupName
        )
        param.groupName = param.groupName || defaultGroupName
        const simpleGroupName = param.groupName.split(subGroupFlag)[0]
        // logger.debug('simpleGroupName',simpleGroupName,param.groupName)
        paramsGroups[simpleGroupName] =
          paramsGroups[simpleGroupName] || new EntityReaderParamGroup(simpleGroupName)
        paramsGroups[simpleGroupName].push(param, param.groupName, 0)
        if (param.name === 'delStatus') {
          hasDelStatus = true
        }
      }

      // logger.debug('entityReader.params',entityReader.params,paramsGroups)

      // 检查是否有删除状态，默认为0
      if (!hasDelStatus && ignoreDeleteStatusEntity.indexOf(entityReader.entity) === -1) {
        paramsGroups[defaultGroupName].push(
          new EntityReaderParam('delStatus', 'eq', '0', defaultGroupName),
          defaultGroupName
        )
      }

      /**
       * 递归处理分组
       * @param paramGroup
       * @return 例如：[{"expirationDate|lte":"2024-01-01"},{"expirationDate|gte":"2024-01-02"}]
       */
      const handleGroup = (paramGroup: EntityReaderParamGroup) => {
        const paramArray: Record<string, any>[] = []
        paramGroup.children.forEach((item) => {
          if (typeof item.isGroup === 'function' && item.isGroup()) {
            const group = item as EntityReaderParamGroup
            paramArray.push({[group.logic]: handleGroup(group)})
          } else {
            const param = item as EntityReaderParam
            // 去掉参数值为null或undefined的无效条件
            const paramValue = EntityReaderParam.getMqlParamValue(param)
            if (paramValue !== null && paramValue !== undefined) {
              paramArray.push({[EntityReaderParam.getMqlParamName(param)]: paramValue})
            }
          }
        })
        return paramArray
      }

      const params: Record<string, any> = {}
      // 循环处理分组
      Object.keys(paramsGroups).forEach((key) => {
        // logger.debug('key',key,paramsGroups[key])
        if (key !== defaultGroupName) {
          // 其它分组参数部分，其它分组,统一以or分组进行处理，因为and不需要分组
          // @b brackets的简写，用于通过括号来组合条件
          params['@b'] = params['@b'] || []
          // 递归处理分组
          params['@b'].push({[paramsGroups[key].logic]: handleGroup(paramsGroups[key])})
        } else {
          // 默认无分组参数部分归到了默认分组defaultGroupName
          if (paramsGroups[defaultGroupName]) {
            handleGroup(paramsGroups[defaultGroupName]).forEach((param) => {
              Object.assign(params, param)
            })
          }
        }
      })

      Object.assign(mql[entityReader.entity], params)
    } else {
      // 若无参数，默认添加数据未删除的条件
      mql[entityReader.entity]['delStatus|eq'] = '0'
    }

    const pageNo = entityReader.pageNo || 1
    const pageSize = entityReader.pageSize || 15
    // page
    mql[entityReader.entity]['@p'] = pageNo + ',' + pageSize
    return mql
  }

  /**
   * 基于实体数据源查询
   * 分页默认为1页15条记录
   * 如果没有传删除状态，默认会带上删除訚为0，即delStatus='0'
   * @param entityReader
   * @param disabledClientQueryCache 禁止客户端本次从缓存中查询，且禁止客户端缓存本次查询结果，默认为否
   * @param bizCode 业务代码，用于区分不同业务
   * @returns {*}
   */
  queryByEntityReader(
    entityReader: EntityReader,
    disabledClientQueryCache?: boolean,
    bizCode?: string
  ): Promise<any> {
    const mql = this.convertEntityReaderToMql(entityReader)
    return new Promise((resolve, reject) => {
      this.queryByMql(mql, entityReader.withMeta, disabledClientQueryCache, bizCode)
        .then((res) => {
          // 是否需要处理返回结果
          const foundLocalComputeField = entityReader.fields.find((field) => {
            return field.isLocalComputeFiled
          })
          if (
            foundLocalComputeField ||
            (typeof entityReader.resultMapping.isEmpty === 'function' &&
              !entityReader.resultMapping.isEmpty())
          ) {
            const newRows: any[] = []
            res.data.forEach((row: any) => {
              let newRow: Record<string, any> = {}
              for (let index in entityReader.fields) {
                const fieldMeta = entityReader.fields[index]
                // A、基于本地计算字段实现
                if (fieldMeta.isLocalComputeFiled) {
                  if (fieldMeta.valueExpression) {
                    newRow[fieldMeta.name] = jsScriptExecutor.evalExpression(
                      fieldMeta.valueExpression,
                      {
                        record: row,
                        index: Number.parseInt(index)
                      }
                    )
                  } else {
                    newRow[fieldMeta.name] = undefined
                  }
                } else {
                  newRow[fieldMeta.alias || fieldMeta.name] = row[fieldMeta.alias || fieldMeta.name]
                }
                // B、基于返回结果映射实现
                // if(typeof entityReader.resultMapping.findFieldMapping === 'function'){
                //   const fieldMapping = entityReader.resultMapping.findFieldMapping(fieldMeta.name)
                //   if (fieldMapping) {
                //     if (fieldMapping.value) {
                //       // 有静态值，优先取静态值
                //       newRow[fieldMeta.alias || fieldMeta.name] = fieldMapping.value
                //     } else if (fieldMapping.valueExpression) {
                //       // 没有静态值，再取表达式的值
                //       newRow[fieldMeta.alias || fieldMeta.name] = jsScriptExecutor.evalExpression(
                //           fieldMapping.valueExpression,
                //           {
                //             record: row,
                //             index: Number.parseInt(index)
                //           }
                //       )
                //     }
                //   }
                // }
              }
              newRows.push(newRow)
            })
            res.data = newRows
          }
          resolve(res)
        })
        .catch((reason) => {
          reject(reason)
        })
    })
  }

  /**
   * 从queryByEntityReader的返回结果中获取第一条记录
   * 如果没有记录时返回undefined
   * @param res
   */
  getFirstRecordFromRes(res: any) {
    if (res?.data?.length > 0) {
      return res.data[0]
    }
    return undefined
  }

  getRecordsFromRes(res: any) {
    return res?.data
  }

  /**
   * 实体查询，内部依据参数构建mql对象进行查询
   * 更复杂、高级的查询@see queryByMql
   * @param entityName e.g. platform_dev_project
   * @param fieldNames 查询的列字段 e.g. id,name
   * @param params 查询要件键值对 e.g. {id:123456,name:'张三'} or {'@order':'name|+'}。不指定数据状态时，默认不查询已删除的数据
   * @param withMeta
   * @param disabledClientQueryCache
   * @param bizCode
   * @param order 排序，例如：'name|+'、'updateAt|-'
   */
  query(entityName: string, fieldNames: string, params: Record<string, any>, withMeta?: boolean, disabledClientQueryCache?: boolean, bizCode?: string, order?: string) {
    // if (!fieldNames) {
    //     // eslint-disable-next-line no-throw-literal
    //     throw `查询${entityName},失败，列（fieldNames）不能为空。`;
    // }
    // if (fieldNames.indexOf(',,') >= 0) {
    //     // eslint-disable-next-line no-throw-literal
    //     throw `查询${entityName}失败，列（fieldNames）格式不对,存在连续的",,"：${fieldNames}`;
    // }
    // mql查询语句
    const mql: Record<string, any> = {}
    mql[entityName] = {
      '@fs': fieldNames || '*'
    }
    let copyParam = JSON.parse(JSON.stringify(params))
    if (!copyParam.delStatus) {
      copyParam.delStatus = '0'
    }
    if (!copyParam['@p']) {
      copyParam['@p'] = '1,500'
    }
    if (order) {
      mql[entityName]['@order'] = order
    }
    Object.assign(mql[entityName], copyParam)
    return this.queryByMql(mql, withMeta, disabledClientQueryCache, bizCode)
  }

  /**
   * 批量查询
   * @param queryParamArray 例如：[{entityName:String,keyValues:{key1:value1,key2:value2,...},fieldNames:'id,name,...'},...]
   * @param withMeta
   */
  queryBatch(queryParamArray: Array<object>, withMeta: boolean) {
    const mqlAry: Array<any> = []
    queryParamArray.forEach((item) => {
      const queryParam: Record<string, any> = item
      const mql: Record<string, any> = {}
      mql[queryParam.entityName] = {
        '@fs': queryParam.fieldNames || '*'
      }
      Object.assign(mql[queryParam.entityName], queryParam.keyValues)
      mqlAry.push(mql)
    })
    return this.queryByMql(mqlAry, withMeta)
  }

  update(
    url: string,
    entityName: string,
    keyValues: object,
    biz?: string,
    successMsg?: string,
    errorMsg?: string
  ) {
    const bizCode = biz || '0'
    const data: Record<string, any> = {
      '@biz': bizCode
    }
    data[entityName] = keyValues || {}
    return this.service({
      url: `${url}/${bizCode}`,
      method: 'POST',
      data
    })
  }

  convertEntitySaverToMql(entitySaver: EntitySaver, biz?: string): MqlObject {
    const defaultPidValue = '$parent.id'

    // subFormPidValue
    const toMql = (es: EntitySaver, isChildren: boolean, pidValue?: string): ParsedMqlResult => {
      checkEntitySaver(es)
      // 数据预处理：按约定，将记录值中的空字符串转成null值，
      Object.keys(es.record).forEach((key: string) => {
        if (es.record[key] === '') {
          es.record[key] = null
        }
      })

      const mqlObj: Record<string, any> = {}
      const entityName = isChildren ? '#' + es.entity : es.entity
      if (isChildren) {
        // 设置子实体的外键字段值，条件：已设置了字段名，且字段无值
        if (es.pidName && !es.record[es.pidName]) {
          es.record[es.pidName] = pidValue || defaultPidValue
        }
        mqlObj[entityName] = mqlObj[entityName] || []
        mqlObj[entityName].push(es.record)
      } else {
        // 根节点只能有一条记录
        mqlObj[entityName] = es.record
      }

      es.children?.forEach((subEs) => {
        const subMqlResult = toMql(subEs, true, es.record.id)
        // logger.debug('convertEntitySaverToMql() > entitySaver.entity',entityName,'result:',subMqlResult)
        if (
          subMqlResult.mqlObj &&
          subMqlResult.mqlObj[subMqlResult.key] &&
          subMqlResult.mqlObj[subMqlResult.key].length > 0
        ) {
          if (utils.isArray(mqlObj[entityName])) {
            es.record[subMqlResult.key] = es.record[subMqlResult.key] || []
            es.record[subMqlResult.key].push(...subMqlResult.mqlObj[subMqlResult.key])
          } else {
            mqlObj[entityName][subMqlResult.key] = mqlObj[entityName][subMqlResult.key] || []
            mqlObj[entityName][subMqlResult.key].push(...subMqlResult.mqlObj[subMqlResult.key])
          }
          // logger.debug('convertEntitySaverToMql() > parent mqlObj',mqlObj,entityName)
        }
      })
      return {key: entityName, mqlObj: mqlObj}
    }
    const bizCode = biz || '0'
    const entitySaverCopy = JSON.parse(JSON.stringify(entitySaver))
    return Object.assign(toMql(entitySaverCopy, false).mqlObj, {'@biz': bizCode}, undefined)
  }

  /**
   * 基于实体保存对象进行保存，支持父子实体对象保存
   * @param entitySaver 实体保存对象
   * @param biz
   */
  saveEntity(entitySaver: EntitySaver, biz?: string) {
    if (!entitySaver) {
      throw new Error(
        '实体保存对象不可以为空，请检查保存对象的变量名是否有误，或保存对象是否已赋值。'
      )
    }
    const bizCode = biz || '0'
    const mqlObj = this.convertEntitySaverToMql(entitySaver, bizCode)
    // logger.debug('saveEntity > entitySaver:', entitySaver, 'mql:', mqlObj)
    return this.service({
      url: `${this.url.apiMetaSave}/${bizCode}?mainId=${entitySaver.record.id || ''}`,
      method: 'POST',
      data: mqlObj
    })
  }

  /**
   * 多个实体批量保存，用于如批量更新列表的数据，或在批量更新列表数据时，需同步更新或创建列表每一行的子表单数据
   * @param entitySavers
   * @param biz
   */
  saveMultiEntity(entitySavers: EntitySaver[], biz?: string) {
    // const bizCode = biz || '0'
    // const mqObjs: Record<string, any> = {}
    // entitySavers.forEach((entitySaver: EntitySaver) => {
    //   const mqlResult = this.convertEntitySaverToMql(entitySaver, bizCode)
    //   logger.debug('saveEntity > entitySaver:', entitySaver, 'mql:', mqlResult)
    //   mqObjs[mqlResult.key] = mqObjs[mqlResult.key] || []
    //   mqObjs[mqlResult.key].push(mqlResult.mqlObj)
    // })
    // return this.service({
    //   url: `${this.url.apiMetaMultiSave}/${bizCode}`,
    //   method: 'POST',
    //   data: mqObjs
    // })
  }

  /**
   * 该entitySavers指的是同一个实体名（即多个一样的父实体），若有多个不同的实体，请用方法saveMultiEntity
   * 若有不同的实体
   * @param entitySavers
   * @param biz
   */
  saveBatchEntity(entitySavers: EntitySaver[], biz?: string) {
    const bizCode = biz || '0'
    const mqObjs: Record<string, any> = {}
    entitySavers.forEach((entitySaver: EntitySaver) => {
      const mqlObject = this.convertEntitySaverToMql(entitySaver, bizCode)
      logger.debug(
        'saveBatchEntity > convertEntitySaverToMql > entitySaver:',
        entitySaver,
        'mql:',
        mqlObject
      )
      const entity: string = Object.keys(mqlObject)[0]
      mqObjs[entity] = mqObjs[entity] || []
      mqObjs[entity].push(mqlObject[entity])
    })
    return this.service({
      url: `${this.url.apiMetaBatchSave}`,
      method: 'POST',
      data: mqObjs
    })
  }

  /**
   * @param entityName 实体名称
   * @param keyValues Object类型
   * @param biz
   * @param successMsg
   * @param errorMsg
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
      successMsg || '保存成功',
      errorMsg || '保存失败'
    )
  }

  /**
   * 基于mql对象进行查询
   * @param mql or mqlArray
   * @param biz 业务代码
   * @returns {*}
   */
  saveByMql(biz: string, mql: MqlObject | Array<MqlObject>) {
    const path = Array.isArray(mql) ? this.url.apiMetaSave : this.url.apiMetaSave
    const bizCode = biz || '0'
    return this.service({
      url: `${path}/${bizCode}`,
      method: 'POST',
      data: mql
    })
  }

  saveBatch(entityName: string, records: Array<Record<string, any>>, biz?: string) {
    const bizCode = biz || '0'
    const data: Record<string, any> = {
      '@biz': bizCode
    }
    data[entityName] = records || []

    return this.service({
      url: `${this.url.apiMetaBatchSave}`,
      method: 'POST',
      data
    })
  }

  /**
   * 逻辑删除（基于参数组合）
   * @param entityName
   * @param keyValues
   * @param biz
   */
  delete(entityName: string, keyValues: object, biz?: string) {
    return this.update(this.url.apiMetaDelete2, entityName, keyValues, biz)
  }

  /**
   * 删除（基于id）
   */
  deleteById(entityName: string, id: string, biz?: string) {
    return this.service({
      url: `${this.url.apiMetaDelete}/${entityName}/${id}`,
      method: 'POST',
      data: {}
    })
  }

  /**
   * 删除多条记录（基于id）
   */
  deleteByIds(entityName: string, ids: string[], biz?: string) {
    const mql = {
      [entityName]: {
        'id|in': ids
      }
    }
    return this.service({
      url: `${this.url.apiMetaDelete2}/${biz || entityName}`,
      method: 'POST',
      data: mql
    })
  }

  /**
   * 批量删除
   * @param items
   * @param biz
   */
  deleteBatch(items: Array<{ entityName: string; keyValues: object }>, biz?: string) {
    if (!items) {
      return
    }
    // TODO 需后台服务提供批量删除的方法，暂无事务单个删除
    // items.forEach((item) => {
    //   result = that.delete(item.entityName, item.keyValues, biz)
    // })
    const promises: Promise<any>[] = []
    for (const item of items) {
      promises.push(this.delete(item.entityName, item.keyValues, biz))
    }
    return Promise.all(promises)
  }

  /**
   * 基于菜单树节点id或页面id或配置id
   * 获取页面的自定义配置
   * @param idType "extendId" | "pageId" | "id"
   * @param id 具体的id值
   */
  queryPageAndCustomById(idType: string, id: string) {
    return this.service({
      url: `${this.url.getPageAndCustom}/${idType}/${id}`,
      method: 'GET',
      data: ''
    })
  }

  /**
   * 通过页面ID获取页面配置信息
   * @param pageId
   * @param contentType 查询为source内容还是release内容
   * @returns
   */
  queryPageById(pageId: string, contentType?: string): Promise<AxiosResponse> {
    // mql查询语句
    const mql = {
      platform_app_page: {
        '@p': '1,1',
        '@fs': `id,code,appId,,${contentType === 'source' ? 'sourceContent' : 'releaseContent'}`,
        delStatus: 0,
        id: pageId
      }
    }
    return this.service({
      url: this.url.metaList,
      method: 'POST',
      data: mql
    })
  }

  /**
   * 通过应用页面树节点ID获取页面配置信息
   * @param extendId
   * @param contentType 查询为source内容还是release内容
   * @returns
   */
  queryPageByExtendId(extendId: string, contentType?: string): Promise<AxiosResponse> {
    // mql查询语句
    const mql = {
      platform_app_page: {
        '@p': '1,1',
        '@fs': `id,code,appId,${contentType === 'source' ? 'sourceContent' : 'releaseContent'}`,
        delStatus: 0,
        extendId: extendId
      }
    }
    return this.service({
      url: this.url.metaList,
      method: 'POST',
      data: mql
    })
  }

  /**
   * 通过应用页面D获取页面配置信息
   * @param pageId
   * @param myUserId 我的用户id
   * @returns
   */
  queryMyPageCustomByPageId(pageId: string, myUserId: string): Promise<AxiosResponse> {
    const mql = {
      platform_my_page_custom: {
        '@p': '1,1',
        '@fs': `id,extendId,cfg,creator`,
        delStatus: 0,
        pageId: pageId,
        creator: myUserId
      }
    }
    return this.service({
      url: this.url.metaList,
      method: 'POST',
      data: mql
    })
  }

  /**
   * 通过应用页面树节点ID获取页面配置信息
   * @param extendId
   * @param myUserId 我的用户id
   * @returns
   */
  queryMyPageCustomByExtendId(extendId: string, myUserId: string): Promise<AxiosResponse> {
    const mql = {
      platform_my_page_custom: {
        '@p': '1,1',
        '@fs': `id,extendId,cfg,creator`,
        delStatus: 0,
        extendId: extendId,
        creator: myUserId
      }
    }
    return this.service({
      url: this.url.metaList,
      method: 'POST',
      data: mql
    })
  }

  /**
   * 查询当前租户所有的字典
   * @param allStatus 是否查询全部状态，默认为false，即只查询启用状态的字典
   */
  queryAllDict(allStatus?: boolean) {
    const params: Record<string, any> = {
      delStatus: 0,
      '@p': '1,10000',
      '@order': 'seqNo|+'
    }
    if (!allStatus) {
      params.enableStatus = 1
    }
    return this.query('platform_dict', 'id value,appId,dictCode,dictName label,enableStatus', params)
  }

  /**
   *  查询某dictId下的字典项
   * @param dictId 字典ID
   * @param allStatus 查询全部状态，默认为false，即只查询启用状态的字典项
   */
  queryDictItems(dictId: string, allStatus?: boolean) {
    const params: Record<string, any> = {
      dictId: `${dictId}`,
      delStatus: 0,
      '@p': '1,10000',
      '@order': 'seqNo|+'
    }
    if (!allStatus) {
      params.enableStatus = 1
    }
    return this.query('platform_dict_item', 'id,itemCode value,itemName label,enableStatus', params)
  }

  /**
   *  查询多个dictId下的字典项
   * @param dictIds
   * @param allStatus 查询全部状态，默认为false，即只查询启用状态的字典项
   */
  queryMultiDictItems(dictIds: string[], allStatus?: boolean) {
    const params: Record<string, any> = {
      'dictId|in': dictIds.join(","),
      delStatus: 0,
      '@p': '1,10000',
      '@order': 'seqNo|+'
    }
    if (!allStatus) {
      params.enableStatus = 1
    }
    return this.query('platform_dict_item', 'id,dictId,itemCode value,itemName label,enableStatus', params)
  }

  /**
   *  查询字典项
   * @param dictId 字典ID
   * @param dictItemCode 字典项编码
   */
  queryDictItem(dictId: string, dictItemCode: string) {
    return this.query('platform_dict_item', 'id,itemCode value,itemName label,enableStatus', {
      dictId: `${dictId}`,
      itemCode: dictItemCode,
      delStatus: 0,
      '@p': '1,1'
    })
  }

  /**
   * 实体对像的数据转换
   * @param data 简单一层对象，如：{id:'123456',name:'张三'}
   * @param dataMapping  可为可层对象，如两层对像：{query: {fullName: '$ctx.name'}}
   * @return <Object> 若dataMapping为空，则直接返回data，{query: {fullName: '张三'}}
   */
  entityDataMappingHandler(data: Record<string, any>, dataMapping: Record<string, any> = {}) {
    const convertedData: Record<string, any> = {}
    Object.keys(dataMapping).forEach((value, key) => {
      if (typeof value === 'object') {
        convertedData[key] = this.entityDataMappingHandler(data, value)
      } else {
        convertedData[key] = MixUtil.evalPlus(value, data)
      }
    })
    // for (const key in dataMapping) {
    //
    // }
    return convertedData
  }

  /**
   * 查询数据定义信息，即元数据信息
   * @returns {*}
   * @param entityName
   */
  queryMeta(entityName: string) {
    return this.service({
      url: `${this.url.apiMetaDefined}/${entityName}`,
      method: 'POST',
      data: ''
    })
  }

  queryEntityNames() {
    return this.service({
      url: `${this.url.apiMetaEntityNames}/`,
      method: 'POST',
      data: ''
    })
  }

  queryEntityLiteMetas(appCode: string = 'platform') {
    return this.service({
      url: `${this.url.apiEntityLiteMetas}?appCode=${appCode}`,
      method: 'GET',
      data: ''
    })
  }

  /**
   * 单字检查是否唯一
   * @param entityName
   * @param filedName
   * @param fieldValue
   * @param id 可选，记录的id值
   */
  checkFieldUniqueness(entityName: string, filedName: string, fieldValue: any, id?: string) {
    const mql = {
      [entityName]: {
        [filedName]: fieldValue
      }
    }
    if (id) {
      mql[entityName]['id|neq'] = id
    }
    return this.service({
      url: `${this.url.apiMetaUniqueness}`,
      method: 'POST',
      data: mql
    })
  }

  getService() {
    return this.service
  }

  getHeader() {
    return {
      Authorization: this.getAuthorization()!
    }
  }
}

const entityApi = new EntityApi()
export {entityApi}
export default EntityApi
