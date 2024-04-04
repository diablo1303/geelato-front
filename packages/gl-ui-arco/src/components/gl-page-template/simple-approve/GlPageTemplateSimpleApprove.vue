<script lang="ts">
/**
 *  简单审批模板
 *
 *  打开时，若页面参数中传入了业务表单id，则基于业务表单id加载流程实例及流程处理过程数据
 */
export default {
  name: 'GlPageTemplateSimpleApprove'
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
  EntitySaver,
  EntityReader,
  SubmitFormResult
} from '@geelato/gl-ui'
import type { TabsPosition } from '@arco-design/web-vue/es/tabs/interface'

const LayoutMode = {
  collapse: 'collapse',
  tabs: 'tabs'
}
const Status = {
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
  label: String,
  subLabel: String,
  /**
   *  流程处理环节
   */
  nodeCode: String,
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
  /**
   *  流程定义ID
   */
  processDefinedId: {
    type: String,
    required: true
  },
  /**
   *  流程实例任ID
   *  创建流程时，该值为空
   */
  processInstId: {
    type: String
  },
  /**
   *  插槽模式，可用于打开页面时将页面内容分发到插槽中
   */
  slotMode: Boolean,
  /**
   *  当前流程实例任务节点ID
   *  用于获取当前环节的处理信息
   *  创建流程时，该值为空；待办、已办有这个值
   */
  taskId: {
    type: String
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

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const isRead = !!pageProvideProxy?.isPageStatusRead()

// 是否审批环节
const isApproval = ref(false)
const layout = ref(props.layoutMode)
// 图标状态
const status = ref(Status.none)
// 流程实例记录
const procRecord = ref({
  id: '',
  name: ''
})
// 审批意见状态
const approvalStatus = ref()
// 详细审批意见、申请意见
const remark = ref('')
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

const myPage = ref()

const changeApprove = (val: any) => {
  approvalStatus.value = val
  console.log('changeApprove', val)
}

const submitFormResult: Ref<SubmitFormResult | Record<string, any>> = ref({})

console.log('pageProvideProxy.getParams()', pageProvideProxy.getParams())
// 业务表单的id
const bizId = ref(pageProvideProxy.getParamValue('template.bizId'))

/**
 *  加载流程实例信息
 *  加载完成之后加载任务列表
 *  更新审批状态图片
 */
const loadProc = () => {
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_wf_proc_inst'
  entityReader.setFields('id')
  entityReader.setFields('bizId')
  entityReader.setFields('name')
  entityReader.setFields('approvalStatus')
  entityReader.addParam('bizId', 'eq', bizId.value)
  entityApi.queryByEntityReader(entityReader).then((res: any) => {
    procRecord.value = entityApi.getFirstRecordFromRes(res) || {}
    loadTaskByProcId(procRecord.value.id)
    //
    console.log('loadProc', status)
    status.value = Status.underway
  })
}

/**
 * 依据流程ID获取当前的轨道
 * @param procId
 */
const loadTaskByProcId = (procId: string) => {
  if (!procId) return
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_wf_proc_task'
  entityReader.setFields('id')
  entityReader.setFields('name')
  entityReader.setFields('handler')
  entityReader.setFields('handlerName')
  entityReader.setFields('nodeName')
  entityReader.setFields('approvalStatus')
  entityReader.addParam('id', 'eq', procId)
  entityApi.queryByEntityReader(entityReader).then((res: any) => {
    const records = entityApi.getFirstRecordsFromRes(res)
    console.log('records', records)
  })
}

/**
 *  工作流信息提交，做以下操作：
 *  1、保存流程实例主表
 *  2、保存流程审批记录
 *  3、更新业务表中的流程审批状态等信息
 */
const submitProcess = () => {
  const entitySaver = new EntitySaver()
  entitySaver.id = submitFormResult.value.id
  entitySaver.entity = 'platform_wf_proc_inst'
  entitySaver.record = {
    id: procRecord.value.id,
    bizId: bizId.value,
    name: procRecord.value.name || props.label,
    approvalStatus: '1'
  }
  entitySaver.children = []

  const childEntitySaver = new EntitySaver()
  childEntitySaver.id = submitFormResult.value.id
  childEntitySaver.entity = 'platform_wf_proc_task'
  childEntitySaver.record = {
    procId: '$parent.id',
    name: props.nodeCode,
    code: props.nodeCode,
    // 记录当前处理环节的意见
    approvalStatus: approvalStatus.value || '1',
    remark: remark.value
  }

  const bizEntitySaver = new EntitySaver()
  bizEntitySaver.id = submitFormResult.value.id
  bizEntitySaver.entity = submitFormResult.value.entity
  bizEntitySaver.record = {
    id: submitFormResult.value.id,
    wfApprovalStatus: approvalStatus.value || '1'
  }

  entitySaver.children.push(childEntitySaver)
  entitySaver.children.push(bizEntitySaver)
  entityApi.saveEntity(entitySaver).then((res: any) => {
    console.log('submitProcess res', res)
  })
}

/**
 * 模板内的组件，提交表单时触发
 * @param result {id:props.glComponentInst.id,success:true,record:formProvideProxy.getForm()}
 */
const onSubmitForm = (result: any) => {
  console.log('onSubmitForm', result)
  if (result?.success) {
    submitFormResult.value = result
    submitProcess()
  }
}
emitter.on('entityForm.submitForm', onSubmitForm)

// 如果传了业务表ID，则从已有的流程实例中加载数据
if (bizId.value) {
  loadProc()
}

const hasReady = computed(() => {
  return bizId.value && props.nodeCode && props.label
})
onMounted(() => {})
onUnmounted(() => {
  emitter.off('entityForm.submitForm', onSubmitForm)
})
</script>

<template>
  <div class="gl-page-template-simple-approve">
    <template v-if="hasReady">
      <a-affix :offsetTop="65" style="margin-bottom: 10px">
        <div class="gl-header" :class="{ 'gl-not-rt-fix': !glIsRuntime }">
          <a-page-header :title="label" :subtitle="subLabel" :show-back="false">
            <template #extra>
              <!--            <a-button-group size="small" shape="round">-->
              <!--              <a-button>-->
              <!--                <GlIconfont type="gl-save" text="暂存"></GlIconfont>-->
              <!--              </a-button>-->
              <!--              <a-button type="primary">-->
              <!--                <GlIconfont-->
              <!--                    type="gl-start-event-none"-->
              <!--                    text="同意"-->
              <!--                    @click="showApproveModal"-->
              <!--                ></GlIconfont>-->
              <!--              </a-button>-->
              <!--              <a-button type="primary">-->
              <!--                <GlIconfont type="gl-arrow-left" text="退回"></GlIconfont>-->
              <!--              </a-button>-->
              <!--              <a-button>-->
              <!--                <GlIconfont type="gl-deliver" text="转交"></GlIconfont>-->
              <!--              </a-button>-->
              <!--              <a-button>-->
              <!--                <GlIconfont type="gl-pass-for-read" text="传阅"></GlIconfont>-->
              <!--              </a-button>-->
              <!--              <a-button>-->
              <!--                <GlIconfont type="gl-add-approval" text="加签"></GlIconfont>-->
              <!--              </a-button>-->
              <!--              <a-button>-->
              <!--                <GlIconfont type="gl-press-to-do" text="催办"></GlIconfont>-->
              <!--              </a-button>-->
              <!--              <a-button status="warning">-->
              <!--                <a-popconfirm content="是否撤回?">-->
              <!--                  <GlIconfont type="gl-revocation" text="撤回"></GlIconfont>-->
              <!--                </a-popconfirm>-->
              <!--              </a-button>-->
              <!--            </a-button-group>-->
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
          :class="{ ['background-svg-' + status]: true }"
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
                <!--  作为组件时，用component-->
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
        <!--      <a-card v-if="status == Status.none" style="margin-top: 1em" size="small">-->
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
        <a-card v-if="status != Status.none" style="margin-top: 1em" size="small">
          <template #title>
            <GlIconfont type="gl-right" text="审批信息"></GlIconfont>
          </template>
          <div style="padding: 0 0 1em 0">
            <a-radio-group type="button" @change="changeApprove">
              <a-radio value="1">同意</a-radio>
              <a-radio value="2">不同意</a-radio>
              <a-radio value="3">结束</a-radio>
            </a-radio-group>
          </div>
          <a-textarea
            v-model="remark"
            placeholder="输入意见"
            style="background-color: rgba(145, 203, 253, 0.23)"
          >
          </a-textarea>
        </a-card>
      </a-affix>
    </template>
    <template v-else>
      在打开页面组件的页面参数中，需要传入以下参数：
      <br />
      template.bizId，当前值为：{{ bizId }}
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
