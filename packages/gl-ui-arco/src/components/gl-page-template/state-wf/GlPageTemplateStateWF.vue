<script lang="ts">
/**
 *  基于状态机实现的审批模板
 *
 *  打开时，若页面参数中传入了业务表单id，则基于业务表单id加载流程实例及流程处理过程数据
 */
export default {
  name: 'GlPageTemplateStateWF'
}
</script>
<script lang="ts" setup>
import { onMounted, type PropType, type Ref, ref, watch, inject, onUnmounted, computed } from 'vue'
import {
  emitter,
  mixins,
  PageProvideKey,
  PageProvideProxy,
  entityApi,
  SubmitFormResult,
  useGlobal,
  UiEventNames,
  GetEntitySaversResult
} from '@geelato/gl-ui'
import type { TabsPosition } from '@arco-design/web-vue/es/tabs/interface'
import {
  getProcInstEntitySaver,
  loadProcDefById,
  loadProcInstByBizId,
  ProcDef,
  ProcInst,
  ProcTask,
  ProcTranDef
} from './stateWfApi'
import StateWFApprove from './StateWFApprove.vue'

const global = useGlobal()
const LayoutMode = {
  collapse: 'collapse',
  tabs: 'tabs'
}
const GraphState = {
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
const remarkLabel = ref('')
/**
 *  初始化加载工作流定义、状态定义、状态转换定义、工作流实例
 */
const loadData = async () => {
  // 通过业务ID加载流程实例
  if (props.bizId) {
    await loadProcInstByBizId(props.bizId).then((res) => {
      procInst.value = entityApi.getFirstRecordFromRes(res)
      if (procInst.value) {
        procDefId.value = procInst.value.procDefId
      }
    })
  }

  // 如果传了业务表ID，则从已有的流程实例中加载数据
  if (procDefId.value) {
    await loadProcDefById(procDefId.value).then((procDefRes: any) => {
      procDef.value = procDefRes
    })
  }

  // 服务端流程实例的当前状态，是最新的状态
  lastState.value = procInst.value?.currentStateId || procDef.value.initStateId
  // 有实例时，是否为初始状态；无实例时为true
  isNew.value = procInst.value?.id
    ? procDef.value.initState === procInst.value?.currentStateId
    : true
  remarkLabel.value = isNew.value ? '申请说明' : '审批意见'
  // 从procDef.value.trans中找出，下一步可能的状态
  // 如果lastState值为空，即为新创建流程状态
  console.log('procDef.value.trans', procInst.value?.currentStateId, procDef.value.initStateId)
  nextTrans.value = procDef.value.trans?.filter((tran: ProcTranDef) => {
    return tran.srcStateId === lastState.value
  })
  // 图标状态 TODO 是否为审结
  graphState.value = isNew.value ? GraphState.none : GraphState.underway
}

// 是否审批环节，如果有流程实例ID
const layout = ref(props.layoutMode)
// 审批意见状态
const approvalStatus = ref()

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
const handleOk = () => {}

const handleCancel = () => {}

const changeTran = (tranId: any) => {
  selectedTran.value = nextTrans.value.find((tran: ProcTranDef) => {
    return tran.id === tranId
  })
  console.log('changeTran', tranId)
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

  procTask.value.procDefId = procDefId.value!
  procTask.value.procInstId = procInst.value.id || '$parent.id'
  procTask.value.handlerId = global.$gl.user.id
  procTask.value.handlerName = global.$gl.user.name
  procTask.value.name = selectedTran.value?.name!
  procTask.value.remark = remark.value
  procTask.value.srcStateId = selectedTran.value?.srcStateId!
  procTask.value.targetStateId = selectedTran.value?.targetStateId!
  console.log('getEntitySaver', procInst.value)
  return getProcInstEntitySaver(procInst.value, procTask.value)
}

console.log('global', global)

/**
 * 模板内的组件，提交表单之后触发
 * @param result {id:props.glComponentInst.id,success:true,record:formProvideProxy.getForm()}
 */
const onSubmitForm = (result: any) => {
  console.log('onSubmitForm', result)
  // if (result?.success) {
  //   submitFormResult.value = result
  //   submitProcess()
  // }
}

loadData()
onMounted(() => {})
const stateWFApprove = ref()
/**
 * 表单在构建保存对象时，可以获取表单的值，并设置业务表的工作流相关状态信息
 * 将流程信息作为子表单一起保存
 * 注意：这个方法不能是异步的，否则该模板内嵌的表单提交事件不会等模板自身的表单验证结果
 * @param args GetEntitySaversResult
 */
const onCreatedEntitySavers = (args: any) => {
  // 检查工作流模板中的录入
  const result: GetEntitySaversResult = args.result
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
  result.values[0].children.push( getEntitySaver())
  // 设置业务表的工作流相关状态信息，依赖于getEntitySaver()，中的procTask，在其它执行
  // 对于状态机的工作流场景，不设置wfProcId的值result.values[0].record.wfProcId
  result.values[0].record.wfApprovalStatus = procTask.value.targetStateId
  result.values[0].record.wfApprovalStatus = procTask.value.targetStateId
  result.values[0].record.wfExtInfo = procTask.value.targetStateId

}

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
    }
  ]
})

emitter.on(UiEventNames.EntityForm.onCreatedEntitySavers, onCreatedEntitySavers)
emitter.on(UiEventNames.EntityForm.onSubmitted, onSubmitForm)
onUnmounted(() => {
  emitter.off(UiEventNames.EntityForm.onCreatedEntitySavers, onCreatedEntitySavers)
  emitter.off(UiEventNames.EntityForm.onSubmitted, onSubmitForm)
})
</script>

<template>
  <div class="gl-page-template-simple-approve">
    <template v-if="hasReady">
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
              <a-button
                size="small"
                shape="circle"
                title="切换页面布局"
                @click="changeLayout"
                style="margin-left: 5px"
              >
                <!--<GlIconfont :type="'gl-' + layout"></GlIconfont>-->
                <GlIconfont type="gl-transfer"></GlIconfont>
              </a-button>
            </template>
          </a-page-header>
        </div>
      </a-affix>
      <div class="gl-body" style="position: relative">
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
            <div>
              <!--  作为模板时，用slot-->
              <template v-if="slotMode">
                <slot></slot>
              </template>
              <template v-else>
                <!--  作为组件时，用component，这里的inst一般为GlPage-->
                <component
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
          <a-tab-pane key="2">
            <template #title>
              <GlIconfont type="gl-affix" text="表单附件"></GlIconfont>
            </template>
            <div>
              <a-empty></a-empty>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3">
            <template #title>
              <GlIconfont type="gl-timeline" text="审批记录"></GlIconfont>
            </template>
            <div>
              <GlPageViewer
                pageId="5037920844148510721"
                :pageProps="{ params: pageParams}"
                :glIsRuntime="true"
                glRuntimeFlag="Runtime"
              ></GlPageViewer>
            </div>
          </a-tab-pane>
          <a-tab-pane key="4">
            <template #title>
              <GlIconfont type="gl-flow" text="关联流程"></GlIconfont>
            </template>
            <div>
              <a-empty></a-empty>
            </div>
          </a-tab-pane>
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
          <a-collapse-item header="表单附件" :key="2" class="gl-flow-attachments">
            <template #expand-icon="{ active }">
              <GlIconfont type="gl-affix"></GlIconfont>
            </template>
            <div>
              <a-empty></a-empty>
            </div>
          </a-collapse-item>
          <a-collapse-item header="审批记录" key="3" class="gl-flow-timeline">
            <template #expand-icon="{ active }">
              <GlIconfont type="gl-timeline"></GlIconfont>
            </template>
            <div>
              <a-empty></a-empty>
            </div>
          </a-collapse-item>
          <a-collapse-item header="关联流程" key="4" class="gl-flow-process">
            <template #expand-icon="{ active }">
              <GlIconfont type="gl-flow"></GlIconfont>
            </template>
            <div>
              <a-empty></a-empty>
            </div>
          </a-collapse-item>
        </a-collapse>
      </div>
      <a-affix :offsetBottom="79" v-if="!isRead">
        <!--      <a-card v-if="graphState == GraphState.none" style="margin-top: 1em" size="small">-->
        <!--        <template #title>-->
        <!--          <GlIconfont type="gl-right" text="申请描述"></GlIconfont>-->
        <!--        </template>-->
        <!--        <a-textarea-->
        <!--          v-model="remark"-->
        <!--          placeholder="输入申请描述信息"-->
        <!--          style="background-color: rgba(145, 203, 253, 0.42)"-->
        <!--        >-->
        <!--        </a-textarea>-->
        <!--      </a-card>-->
        <a-card style="margin-top: 1em" size="small">
          <template #title>
            <GlIconfont type="gl-right" :text="isNew ? '提交申请' : '审批信息'"></GlIconfont>
          </template>
          <StateWFApprove
            ref="stateWFApprove"
            v-model:tran="selectedTran"
            v-model:remark="remark"
            :remarkLabel="remarkLabel"
            :next-trans="nextTrans"
          ></StateWFApprove>
        </a-card>
      </a-affix>
    </template>
    <template v-else>
      在打开页面组件的页面参数中，需要传入以下参数：
      <br />
      bizId，当前值为：{{ bizId }}
      <br />
      在打开页面组件的模板页面参数中，需要传入以下参数：
    </template>
  </div>
</template>

<style lang="less">
.gl-page-template-simple-approve .background-svg-container {
  width: 120px;
  height: 120px;
  position: absolute;
  top: -20px;
  right: 180px;
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

.gl-page-template-simple-approve {
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
}
</style>
