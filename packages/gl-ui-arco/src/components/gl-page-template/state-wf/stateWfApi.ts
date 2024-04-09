/**
 *  基于状态机的工作流api
 */
import { entityApi, EntityReader, EntitySaver, utils } from '@geelato/gl-ui'

export class ProcDef {
  [key: string]: any

  appId: string = ''
  initState: string = ''
  states: Array<ProcStateDef> = []
  trans: Array<ProcTranDef> = []
}

export class ProcStateDef {
  [key: string]: any

  id: string = undefined
  procDefId: string = undefined
  appId: string = undefined
  remark: string = undefined
  name: string = undefined
}

export class ProcTranDef {
  [key: string]: any

  id: string = undefined
  procDefId: string = undefined
  tranCondition: string = undefined
  appId: string = undefined
  remark: string = undefined
  targetStateId: string = undefined
  srcStateId: string = undefined
  name: string = undefined
}

export class ProcInst {
  id = ''
  name = ''
  currentStateId = ''
  appId = ''
  procDefId = ''
  bizId = ''
}

/**
 *  流程任务实例
 */
export class ProcTask {
  id = ''
  procInstId = ''
  name = ''
  srcStateId = ''
  targetStateId = ''
  handlerId = ''
  handlerName = ''
  remark = ''
}

/**
 * 加载流程定义，及流程状态转换定义
 * @param id
 */
export const loadProcDefById = (id: string) => {
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_swf_proc_def'
  entityReader.setFields('id,name,initStateId,remark')
  entityReader.addParam('id', 'eq', id)
  return entityApi.queryByEntityReader(entityReader).then(async (res: any) => {
    const procDef: ProcDef = entityApi.getFirstRecordFromRes(res)
    if (procDef) {
      procDef.trans = await loadProcTranDefById(procDef.id).then((tranRes) => {
        return entityApi.getRecordsFromRes(tranRes)
      })
      procDef.states = await loadProcStateDefById(procDef.id).then((tranRes) => {
        return entityApi.getRecordsFromRes(tranRes)
      })
    }
    return procDef
  })
}

/**
 *  获取流程状态转换定义
 * @param procDefId
 */
export const loadProcTranDefById = (procDefId: string) => {
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_swf_proc_tran_def'
  entityReader.setFields('id,name,procDefId,tranCondition,appId,remark,targetStateId,srcStateId')
  entityReader.addParam('procDefId', 'eq', procDefId)
  return entityApi.queryByEntityReader(entityReader)
}

/**
 *  获取流程状态定义
 * @param procDefId
 */
export const loadProcStateDefById = (procDefId: string) => {
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_swf_proc_state_def'
  entityReader.setFields('id,name,procDefId,appId,remark')
  entityReader.addParam('procDefId', 'eq', procDefId)
  return entityApi.queryByEntityReader(entityReader)
}

/**
 *  加载流程实例信息
 */
export const loadProcInstByBizId = (bizId: string) => {
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_swf_proc_inst'
  entityReader.setFields('id,name,procDefId,bizId,currentStateId,startedAt,endedAt')
  entityReader.addParam('bizId', 'eq', bizId)
  return entityApi.queryByEntityReader(entityReader)
}

/**
 *  工作流信息提交，做以下操作：
 *  1、保存流程实例主表
 *  2、保存流程审批记录
 *  3、更新业务表中的流程审批状态等信息
 */
export const submitProcInst = (procInst: ProcInst, procTask: ProcTask,bizEntitySaver:EntitySaver) => {
  const entitySaver = new EntitySaver()
  entitySaver.id = submitFormResult.value.id
  entitySaver.entity = 'platform_swf_proc_inst'
  if (procInst.id) {
    // 修改
    entitySaver.record = {
      id: procInst.id,
      name: procInst.name,
      currentStateId: procInst.currentStateId,
      endAt: procInst.endA
    }
  } else {
    // 新增
    entitySaver.record = {
      id: procInst.id,
      bizId: procInst.bizId,
      name: procInst.name,
      currentStateId: procInst.currentStateId,
      startedAt: procInst.startedAt || utils.dateFormat(new Date()),
      endAt: procInst.endAt || undefined,
      appId: procInst.appId,
      procDefId: procInst.procDefId
    }
  }

  entitySaver.children = []

  const taskEntitySaver = new EntitySaver()
  taskEntitySaver.id = submitFormResult.value.id
  taskEntitySaver.entity = 'platform_swf_proc_task'
  taskEntitySaver.record = {...procTask}
  taskEntitySaver.record.procInstId = '$parent.id'

  // const bizEntitySaver = new EntitySaver()
  // bizEntitySaver.id = submitFormResult.value.id
  // bizEntitySaver.entity = submitFormResult.value.entity
  // bizEntitySaver.record = {
  //   id: submitFormResult.value.id,
  //   wfApprovalStatus: approvalStatus.value || '1'
  // }

  entitySaver.children.push(taskEntitySaver)
  entitySaver.children.push(bizEntitySaver)
  entityApi.saveEntity(entitySaver).then((res: any) => {
    console.log('submitProcess res', res)
  })
}
