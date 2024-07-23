<script lang="ts">
/**
 *  基于状态机实现的审批模板
 *
 *  打开时，若页面参数中传入了业务表单id，则基于业务表单id加载流程实例及流程处理过程数据
 *
 *  对内嵌入的组件，可以调和如下方法：
 *  pageProvideProxy.pageTemplate?.onBeforeSubmit
 */
export default {
  name: 'GlPageTemplateStateWF'
}
</script>
<script lang="ts" setup>
import { type PropType, type Ref, ref, watch, inject, computed } from 'vue'
import {
  mixins,
  PageProvideKey,
  PageProvideProxy,
  entityApi,
  GetEntitySaversResult,
} from '@geelato/gl-ui'
import type { TabsPosition } from '@arco-design/web-vue/es/tabs/interface'
import {
  getGraphStateByApprovalStatus,
  getProcInstEntitySaver,
  GraphState,
  isEndApprovalStatus,
  loadProcDefById,
  loadProcInstByBizId,
  ProcDef,
  ProcInst,
  ProcTask,
  ProcTranDef
} from './stateWfApi'
import StateWFApprove from './StateWFApprove.vue'
import type { PageTemplate } from '@geelato/gl-ui'
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import type { WorkflowPageTemplate } from '@geelato/gl-ui/src/components/PageProvideProxy'

const LayoutMode = {
  collapse: 'collapse',
  tabs: 'tabs'
}

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  /**
   *  流程定义ID
   */
  procDefId: {
    type: String,
    required: true
  },
  /**
   *  流程实例任ID
   *  创建流程时，该值为空
   */
  procInstId: String,
  /**
   *  当前流程实例任务节点ID
   *  用于获取当前环节的处理信息
   *  为空的场景：创建流程时、处理无明确处理人的公共任务时，从业务表单列表进入
   *  不为空的场景：处理有明确处理人的公共任务时，从待办、已办列表进入
   */
  procTaskId: String,
  /**
   *  业务表ID
   */
  bizId: String,
  /**
   *  插槽模式，可用于打开页面时将页面内容分发到插槽中
   */
  slotMode: Boolean,

  label: String,
  subLabel: String,
  /**
   *  布局模式
   *  折叠：collapse
   *  标签：tabs
   */
  layoutMode: {
    type: String,
    default() {
      return 'tabs'
    }
  },
  tabsPosition: {
    type: String as PropType<TabsPosition>,
    required: true
  },
  /**
   *  是否启用印章状态图片
   */
  enabledStatusImage: {
    type: Boolean,
    default: true
  },

  // /**
  //  *  当前节点的处理人ID
  //  */
  // userId: String,
  // /**
  //  *  当前节点的处理人名称
  //  */
  // userName: String
  ...mixins.props
})

// console.log('打开基于状态机的流程模板，传入props：',props)

// 检查输入的参数
const hasReady = computed(() => {
  // 有模板ID
  // 无模拟ID，但有流程实例
  // 都需要有标题label
  return (props.procDefId || props.bizId) && props.label
})

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const isRead = !!pageProvideProxy?.isPageStatusRead()

const procInst = ref(new ProcInst())

// 是否开始状态
const isStart = ref(false)
// 是否新建流程，isStart不一定isNew
const isNew = ref(false)
// 图标状态
const graphState = ref(GraphState.none)
// 流程定义
const procDef: Ref<ProcDef> = ref(new ProcDef())
const procDefId = ref(props.procDefId)
// 打开页面时，当前流程实例的状态
const lastState = ref('')
// 下一步可选的环节 [{id,name,xxx}]
const nextTrans = ref(<any>[])
// 当前的任务
const procTask = ref(new ProcTask())
// 当前选中的步骤
const selectedTran: Ref<ProcTranDef | undefined> = ref()
// 详细审批意见、申请意见
const remark = ref('')
// 附件 ids
const attachIds = ref('')
const remarkLabel = ref('')


/**
 *  业务表单的组件id
 *  由于
 */
// const bizFormId = computed(() => {
//   const findEntityForm = (inst: ComponentInstance): ComponentInstance | undefined => {
//     if (inst.componentName === 'GlEntityForm') {
//       return inst
//     }
//     let found
//     for (let subInst of inst.children) {
//       found = findEntityForm(subInst)
//       if (found) {
//         return found
//       }
//     }
//     return undefined
//   }
//   return findEntityForm(props.glComponentInst)?.id
// })
/**
 *  初始化加载工作流定义、状态定义、状态转换定义、工作流实例
 */
const loadData = async () => {
  // 通过业务ID加载流程实例
  if (props.bizId) {
    await loadProcInstByBizId(props.bizId).then((res) => {
      const result = entityApi.getFirstRecordFromRes(res)
      if (result) {
        procInst.value = result
        procDefId.value = procInst.value.procDefId
      }
    })
    console.log(`通过业务ID（${props.bizId}），加载流程实例数据，procInst:`,procInst.value)
  }

  // 通过流程定义ID，加载流程定义
  if (procDefId.value) {
    await loadProcDefById(procDefId.value).then((procDefRes: any) => {
      procDef.value = procDefRes
    })
    console.log(`通过流程定义ID（${procDefId.value}），加载流程定义数据，procDef:`,procDef.value)
  }

  if(procInst.value.id){
    if(!procInst.value.currentStateId){
      console.error(`当前已存在流程实例，但流程实例的currentStateId为空（${procInst.value.currentStateId}）`)
    }
  }
  // 服务端流程实例的当前状态，是最新的状态
  lastState.value = procInst.value?.currentStateId || procDef.value.initStateId
  isNew.value = !procInst.value?.id
  isStart.value = isNew.value || procDef.value.initState === procInst.value?.currentStateId
  remarkLabel.value = isStart.value ? '申请说明' : '审批意见'
  // 从procDef.value.trans中找出，下一步可能的状态
  // 如果lastState值为空，即为新创建流程状态
  nextTrans.value = procDef.value.trans?.filter((tran: ProcTranDef) => {
    return tran.srcStateId === lastState.value
  })
  console.log('当前流程定义最新状态', procInst)

  // 图标状态
  graphState.value = getGraphStateByApprovalStatus(procInst.value.approvalStatus)
}

// 是否审批环节，如果有流程实例ID
const layout = ref(props.layoutMode)

const changeLayout = () => {
  if (layout.value === LayoutMode.collapse) {
    layout.value = LayoutMode.tabs
  } else {
    layout.value = LayoutMode.collapse
  }
}
watch(
  () => {
    return props.layoutMode
  },
  () => {
    layout.value = props.layoutMode
  }
)
const visibleApprove = ref(false)
const showApproveModal = () => {
  visibleApprove.value = true
}

/**
 * 通过业务状态ID获取标准审批状态(所有业务流程的标准审批状态是一样的，但业务状态ID不一样，如多个业务状态对应标准审批状态的“审批中”)
 * @param stateId
 */
const getApprovalStatus = (stateId: string) => {
  return (
      procDef.value.states.find((state) => {
      return state.id === stateId
    })?.approvalStatus || '0'
  )
}

/**
 *  构建工作流信息保存信息：
 *  1、保存流程实例主表
 *  2、保存流程审批记录
 *  3、保存附件
 */
const getEntitySaver = () => {
  // 在onCreatingEntitySaver中已对selectedTran先进行了检查
  // 新增时，bizId为空
  procInst.value.bizId = props.bizId || '$parent.id'
  procInst.value.name = procInst.value.name || props.label || '未设置流程名称'
  procInst.value.appId = procDef.value.appId
  procInst.value.procDefId = procDefId.value!
  procInst.value.currentStateId = selectedTran.value?.targetStateId!
  procInst.value.approvalStatus = getApprovalStatus(selectedTran.value?.targetStateId!)
  procInst.value.startedAt = procInst.value.startedAt || '$fn.now'
  procInst.value.endAt = isEndApprovalStatus(selectedTran.value?.targetStateId!)
    ? '$fn.now'
    : undefined

  procTask.value.procDefId = procDefId.value!
  procTask.value.procInstId = procInst.value.id || '$parent.id'
  procTask.value.handlerId = '$ctx.userId'
  procTask.value.handlerName = '$ctx.userName'
  procTask.value.name = selectedTran.value?.name!
  procTask.value.remark = remark.value
  procTask.value.srcStateId = selectedTran.value?.srcStateId!
  procTask.value.targetStateId = selectedTran.value?.targetStateId!
  procTask.value.attachIds = attachIds.value
  console.log('getEntitySaver', procInst.value)
  return getProcInstEntitySaver(procInst.value, procTask.value)
}

/**
 * 模板内的组件，提交表单之后触发
 * @param result {id:props.glComponentInst.id,success:true,record:formProvideProxy.getForm()}
 */
// const onSubmitForm = (result: any) => {
//   console.log('onSubmitForm', result)
  // if (result?.success) {
  //   submitFormResult.value = result
  //   submitProcess()
  // }
// }

loadData()

const stateWFApprove = ref()

/**
 * 找到主表单
 * 从嵌入的页面中，找到第一个GlEntityForm
 */
const findMasterEntityForm = () => {
  function findNodeFromTree(nodeName: string, nodes: Array<any>): any {
    for (let index in nodes) {
      let node: ComponentInstance = nodes[index]
      // console.log('compare node.id,componentId', node.id, componentId, node.id === componentId)
      if (node.componentName === nodeName) {
        return node
      } else if (node.children && node.children.length > 0) {
        // 从子节点查找
        const foundNode = findNodeFromTree(nodeName, node.children)
        if (foundNode) return foundNode
      }
    }
  }
 return findNodeFromTree('GlEntityForm', [props.glComponentInst]) || {}
}
const masterEntityForm = findMasterEntityForm()

/**
 * 表单在构建保存对象时，可以获取表单的值，并设置业务表的工作流相关状态信息
 * 将流程信息作为子表单一起保存
 * 注意：这个方法不能是异步的，否则该模板内嵌的表单提交事件不会等模板自身的表单验证结果
 * @param args {id:来源的组件标识，如表单组件id;data: GetEntitySaversResult}
 */
const createdEntitySavers = (args: {id:string, data:GetEntitySaversResult }) => {
  console.log('createdEntitySavers args:', args,'masterEntityForm:',masterEntityForm)
  // 检查是否为工作流的主表单，主表单才触发工作流
  if(masterEntityForm.id !== args.id){
    return;
  }

  // 检查工作流模板中的录入
  const result: GetEntitySaversResult = args.data
  // 注意：这个方法不能是异步的，否则该模板内嵌的表单提交事件不会等模板自身的表单验证结果
  stateWFApprove.value.validate()
  // 上面只是调用了异常验证，确保整个onCreatedEntitySavers不是异步的
  // 错误信息通过惧下的验证来返回到表单result中
  if (!selectedTran.value) {
    result.error = true
    result.validateResult = result.validateResult || {}
    result.validateResult._selectedTran = { label: '选择步骤' }
  }
  if (!remark.value) {
    result.error = true
    result.validateResult = result.validateResult || {}
    result.validateResult._remark = { label: remarkLabel.value }
  }

  // 2、不通过则返回
  if (result.error) return

  // 将工作流信息，作为业务子表一起保存
  result.values[0].children.push(getEntitySaver())
  // 设置业务表的工作流相关状态信息，依赖于getEntitySaver()，中的procTask，在其它执行
  // 对于状态机的工作流场景，不设置wfProcId的值result.values[0].record.wfProcId
  result.values[0].record.wfApprovalStatus = getApprovalStatus(selectedTran.value?.targetStateId!)
  result.values[0].record.wfExtInfo = procTask.value.targetStateId
}


// 模板数据，用于注入到表单等组件中，如可在提交表单时，表单获取到该template对象，清楚下一步是审批通过还是审批不通过
const pageTemplate: Ref<WorkflowPageTemplate> = ref({ type: 'GlPageTemplateStateWF',onBeforeSubmit: createdEntitySavers,isReject:false })
pageProvideProxy.setPateTemplate(pageTemplate.value)

watch(
    [selectedTran, remark, attachIds],
    () => {
      // 是否为退回步骤
      pageTemplate.value.isReject = selectedTran.value?.isReject == 1
      pageTemplate.value.selectedTran = selectedTran.value
      pageTemplate.value.remark = remark.value
      pageTemplate.value.attachIds = attachIds.value
      console.log('watch selectedTran, remark, attachIds isReject', pageTemplate.value.isReject)

    },
    { deep: true, immediate: true }
)

const pageParams = computed(() => {
  return [
    {
      name: 'query.bizId',
      value: props.bizId
    },
    {
      name: 'query.procInstId',
      value: procInst.value?.id
    },
    {
      name: 'query.procDefId',
      value: procDefId.value
    },
    {
      name: 'query.procDefId',
      value: procDefId.value
    }
  ]
})

// // emitter.on(UiEventNames.EntityForm.createdEntitySavers, createdEntitySavers)
// emitter.on(UiEventNames.EntityForm.onSubmitted, onSubmitForm)
// onUnmounted(() => {
//   // emitter.off(UiEventNames.EntityForm.createdEntitySavers, createdEntitySavers)
//   emitter.off(UiEventNames.EntityForm.onSubmitted, onSubmitForm)
// })
</script>

<template>
  <div class="gl-page-template-state-wf" style="width: 100%">
    <div v-if="hasReady">
      <a-affix :offsetTop="65" style="margin-bottom: 10px">
        <div class="gl-header" :class="{ 'gl-not-rt-fix': !glIsRuntime }">
          <a-page-header :title="label" :subtitle="subLabel" :show-back="false">
            <template #extra>
              <!--                          <a-button-group size="small" shape="round">-->
              <!--                            <a-button>-->
              <!--                              <GlIconfont type="gl-save" text="暂存"></GlIconfont>-->
              <!--                            </a-button>-->
              <!--                            <a-button type="primary">-->
              <!--                              <GlIconfont-->
              <!--                                  type="gl-start-event-none"-->
              <!--                                  text="同意"-->
              <!--                                  @click="showApproveModal"-->
              <!--                              ></GlIconfont>-->
              <!--                            </a-button>-->
              <!--                            <a-button type="primary">-->
              <!--                              <GlIconfont type="gl-arrow-left" text="退回"></GlIconfont>-->
              <!--                            </a-button>-->
              <!--                            <a-button>-->
              <!--                              <GlIconfont type="gl-deliver" text="转交"></GlIconfont>-->
              <!--                            </a-button>-->
              <!--                            <a-button>-->
              <!--                              <GlIconfont type="gl-pass-for-read" text="传阅"></GlIconfont>-->
              <!--                            </a-button>-->
              <!--                            <a-button>-->
              <!--                              <GlIconfont type="gl-add-approval" text="加签"></GlIconfont>-->
              <!--                            </a-button>-->
              <!--                            <a-button>-->
              <!--                              <GlIconfont type="gl-press-to-do" text="催办"></GlIconfont>-->
              <!--                            </a-button>-->
              <!--                            <a-button graphState="warning">-->
              <!--                              <a-popconfirm content="是否撤回?">-->
              <!--                                <GlIconfont type="gl-revocation" text="撤回"></GlIconfont>-->
              <!--                              </a-popconfirm>-->
              <!--                            </a-button>-->
              <!--                          </a-button-group>-->
<!--              <a-button-->
<!--                size="small"-->
<!--                shape="circle"-->
<!--                title="切换页面布局"-->
<!--                @click="changeLayout"-->
<!--                style="margin-left: 5px"-->
<!--              >-->
<!--                &lt;!&ndash;<GlIconfont :type="'gl-' + layout"></GlIconfont>&ndash;&gt;-->
<!--                <GlIconfont type="gl-transfer"></GlIconfont>-->
<!--              </a-button>-->
            </template>
          </a-page-header>
        </div>
      </a-affix>
      <div class="gl-body" style="position: relative; display: flex">
        <div style="overflow: auto; flex: 1; margin-right: 0.5em">
          <div
            v-if="enabledStatusImage"
            class="background-svg-container"
            :class="{ ['background-svg-' + graphState]: true }"
          ></div>
          <a-tabs v-if="layout === LayoutMode.tabs" :position="tabsPosition">
            <a-tab-pane key="1">
              <template #title>
                <GlIconfont type="gl-form" text="流程表单"></GlIconfont>
              </template>
              <div style="padding: 0 2em">
                <!--  作为模板时，用slot-->
                <template v-if="slotMode">
                  <slot></slot>
                </template>
                <template v-else>
                  <!--  作为组件时，用component，这里的inst一般为GlPage-->
                  <component
                    style="overflow: auto"
                    :pageTemplate="pageTemplate"
                    v-if="!slotMode"
                    :is="'GlInsts' + glRuntimeFlag"
                    :glComponentInst="glComponentInst"
                    :glIsRuntime="glIsRuntime"
                    :glLoopItem="glLoopItem"
                    :glLoopIndex="glLoopIndex"
                    :glRuntimeFlag="glRuntimeFlag"
                  />
                </template>
              </div>
            </a-tab-pane>
            <!--              <a-tab-pane key="2">-->
            <!--                <template #title>-->
            <!--                  <GlIconfont type="gl-affix" text="表单附件"></GlIconfont>-->
            <!--                </template>-->
            <!--                <div>-->
            <!--                  <GlPageViewer-->
            <!--                      pageId="5064173938314186753"-->
            <!--                      :pageProps="{ params: pageParams}"-->
            <!--                      :glIsRuntime="true"-->
            <!--                      glRuntimeFlag="Runtime"-->
            <!--                  ></GlPageViewer>-->
            <!--                </div>-->
            <!--              </a-tab-pane>-->
            <a-tab-pane key="3">
              <template #title>
                <GlIconfont type="gl-timeline" text="审批记录"></GlIconfont>
              </template>
              <div>
                <GlPageViewer
                  v-if="procInst?.id"
                  pageId="5037920844148510721"
                  :pageProps="{ params: pageParams }"
                  :glIsRuntime="true"
                  glRuntimeFlag="Runtime"
                ></GlPageViewer>
                <a-empty v-else></a-empty>
              </div>
            </a-tab-pane>
            <!--          <a-tab-pane key="4">-->
            <!--            <template #title>-->
            <!--              <GlIconfont type="gl-flow" text="关联流程"></GlIconfont>-->
            <!--            </template>-->
            <!--            <div>-->
            <!--              <a-empty></a-empty>-->
            <!--            </div>-->
            <!--          </a-tab-pane>-->
          </a-tabs>
          <a-collapse v-else-if="layout === LayoutMode.collapse" :default-active-key="['1']">
            <a-collapse-item header="流程表单" key="1" class="gl-flow-form">
              <template #expand-icon="{ active }">
                <GlIconfont type="gl-form"></GlIconfont>
              </template>
              <div>
                <slot></slot>
              </div>
            </a-collapse-item>
            <a-collapse-item header="审批记录" key="3" class="gl-flow-timeline">
              <template #expand-icon="{ active }">
                <GlIconfont type="gl-timeline"></GlIconfont>
              </template>
              <div>
                <GlPageViewer
                  v-if="procInst.id"
                  pageId="5037920844148510721"
                  :pageProps="{ params: pageParams }"
                  :glIsRuntime="true"
                  glRuntimeFlag="Runtime"
                ></GlPageViewer>
                <a-empty v-else></a-empty>
              </div>
            </a-collapse-item>
            <!--          <a-collapse-item header="关联流程" key="4" class="gl-flow-process">-->
            <!--            <template #expand-icon="{ active }">-->
            <!--              <GlIconfont type="gl-flow"></GlIconfont>-->
            <!--            </template>-->
            <!--            <div>-->
            <!--              <a-empty></a-empty>-->
            <!--            </div>-->
            <!--          </a-collapse-item>-->
          </a-collapse>
        </div>
        <div v-if="!isRead" style="width: 400px">
          <a-card size="small" style="box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1)">
            <template #title>
              <GlIconfont type="gl-right" :text="isStart ? '申请' : '审批'"></GlIconfont>
            </template>
            <StateWFApprove
              ref="stateWFApprove"
              v-model:tran="selectedTran"
              v-model:remark="remark"
              v-model:attachIds="attachIds"
              :remarkLabel="remarkLabel"
              :next-trans="nextTrans"
            ></StateWFApprove>
          </a-card>
        </div>
      </div>
    </div>
    <template v-else>
      在打开页面组件的页面参数中，如果是新流程发起，则不需传入业务表单ID(bizId)，如果是审批环节，则需要传入业务表单ID(bizId)。
      <br />
      当前业务表单ID(bizId)为：{{ bizId }}
    </template>
  </div>
</template>

<style lang="less">
.gl-page-template-state-wf .background-svg-container {
  width: 120px;
  height: 120px;
  position: absolute;
  top: -20px;
  right: 400px;
  z-index: 999;
  background-repeat: no-repeat; /* 不重复 */
  background-size: contain; /* 保持图片完整性，可能会有留白 */
  background-position: center center; /* 居中放置 */

  &.background-svg-rejected {
    background-image: url('../../../assets/rejected.svg');
  }

  &.background-svg-approved {
    background-image: url('../../../assets/approved.svg');
  }

  &.background-svg-underway {
    background-image: url('../../../assets/underway.svg');
  }

  &.background-svg-canceled {
    background-image: url('../../../assets/canceled.svg');
  }
}

.gl-page-template-state-wf {
  .gl-header {
    margin: -18px -16px;
    line-height: 3em;
    //background-color: rgba(231, 231, 231);
    padding-left: 1.5em;
    font-weight: 600;
    background: linear-gradient(90deg, #000851 0%, #1cb5e0 100%);

    .arco-page-header-title {
      color: #fff;
    }

    .arco-btn-size-small {
      padding: 0 10px;
    }
  }

  .arco-collapse-item-content {
    padding-left: 13px;
  }

  .gl-header {
    &.gl-not-rt-fix {
      // 优化设计时下的展示
      margin: 0;
    }
  }

  .gl-flow-form {
    .arco-collapse-item-header {
      .arco-collapse-item-header-title {
        font-weight: 600;
      }
    }
  }

  .gl-flow-timeline {
    .arco-collapse-item-header {
      .arco-collapse-item-header-title {
        font-weight: 600;
      }
    }
  }
}
</style>
