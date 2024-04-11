/**
 *  基于状态机的工作流api
 */
import { entityApi, EntityReader, EntitySaver, utils } from '@geelato/gl-ui'

export const GraphState = {
  // 拟搞编辑
  none: 'none',
  // 审批中
  underway: 'underway',
  // 已审批（已通过）
  approved: 'approved',
  // 已拒绝（不通过）
  rejected: 'rejected',
  // 已取消
  canceled: 'canceled'
}

export const getGraphStateByApprovalStatus = (status: string) => {
  switch (status) {
    // 0 拟稿编制
    case '0':
      return GraphState.none
    // 1 审批中
    case '1':
      return GraphState.underway
    // 2 已通过
    case '2':
      return GraphState.approved
    // 4 不通过
    case '4':
      return GraphState.rejected
  }
  // 5 已挂起
  // 6 中断关闭
  // 7 不需审批
  return GraphState.none
}

/**
 * 是否为流程的审批结束状态
 * @param status
 */
export const isEndApprovalStatus = (status: string) => {
  switch (status) {
      // 2 已通过
    case '2':
      return true
      // 4 不通过
    default:
      return false
  }
}

export class ProcDef {
  [key: string]: any

  appId: string = ''
  initState: string = ''
  states: Array<ProcStateDef> = []
  trans: Array<ProcTranDef> = []
}

export class ProcStateDef {
  [key: string]: any

  id: string = ''
  procDefId: string = ''
  // 该状态对应的标准审批状态
  approvalStatus: string = ''
  appId: string = ''
  remark: string = ''
  name: string = ''
}

export class ProcTranDef {
  [key: string]: any

  id: string = ''
  procDefId: string = ''
  tranCondition: string = ''
  appId: string = ''
  remark: string = ''
  targetStateId: string = ''
  srcStateId: string = ''
  name: string = ''
}

export class ProcInst {
  id = ''
  name = ''
  currentStateId = ''
  approvalStatus = ''
  appId = ''
  procDefId = ''
  bizId = ''
  startedAt?: string
  endAt?: string
}

/**
 *  流程任务实例
 */
export class ProcTask {
  id = ''
  procDefId = ''
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
  entityReader.setFields('id,name,procDefId,approvalStatus,appId,remark')
  entityReader.addParam('procDefId', 'eq', procDefId)
  return entityApi.queryByEntityReader(entityReader)
}

/**
 *  加载流程实例信息
 */
export const loadProcInstByBizId = (bizId: string) => {
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_swf_proc_inst'
  entityReader.setFields('id,name,procDefId,bizId,currentStateId,approvalStatus,startedAt,endedAt')
  entityReader.addParam('bizId', 'eq', bizId)
  return entityApi.queryByEntityReader(entityReader)
}

/**
 *  工作流信息提交，做以下操作：
 *  1、保存流程实例主表
 *  2、保存流程审批记录
 *  3、更新业务表中的流程审批状态等信息
 */
export const getProcInstEntitySaver = (procInst: ProcInst, procTask: ProcTask) => {
  const instEntitySaver = new EntitySaver()
  instEntitySaver.entity = 'platform_swf_proc_inst'
  if (procInst.id) {
    // 修改
    instEntitySaver.record = {
      id: procInst.id,
      name: procInst.name,
      approvalStatus: procInst.approvalStatus,
      currentStateId: procInst.currentStateId,
      endAt: procInst.endAt
    }
  } else {
    // 新增
    instEntitySaver.record = procInst
  }

  instEntitySaver.children = []

  const taskEntitySaver = new EntitySaver()
  taskEntitySaver.entity = 'platform_swf_proc_task'
  taskEntitySaver.record = procTask

  instEntitySaver.children.push(taskEntitySaver)

  console.log('entitySaver', instEntitySaver)
  return instEntitySaver
}
