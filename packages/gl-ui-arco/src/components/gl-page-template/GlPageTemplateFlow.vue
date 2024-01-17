<script lang="ts">
/**
 *  工作流审批流程模板
 */
export default {
  name: 'GlPageTemplateFlow'
}
</script>
<script lang="ts" setup>
import {type PropType, ref, watch} from 'vue'
import GlPageTemplateFlowApprove from './GlPageTemplateFlowApprove.vue'
import { mixins } from '@geelato/gl-ui'
import type {TabsPosition} from "@arco-design/web-vue/es/tabs/interface";

const LayoutMode = {
  collapse: 'collapse',
  tabs: 'tabs'
}
const Status = {
  none: 'none',
  underway: 'underway',
  approved: 'approved',
  rejected: 'rejected',
  canceled: 'canceled'
}
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
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

const layout = ref(props.layoutMode)
const status = ref(Status.underway)
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
</script>

<template>
  <div class="gl-page-template-flow">
    <a-affix :offsetTop="65" style="margin-bottom: 10px">
      <div class="gl-header" :class="{ 'gl-not-rt-fix': !glIsRuntime }">
        <a-page-header title="订单费用补录申请流程" subtitle="" :show-back="false">
          <template #extra>
            <a-button-group size="small" shape="round">
              <a-button>
                <GlIconfont type="gl-save" text="暂存"></GlIconfont>
              </a-button>
              <a-button type="primary">
                <GlIconfont
                  type="gl-start-event-none"
                  text="同意"
                  @click="showApproveModal"
                ></GlIconfont>
              </a-button>
              <a-button type="primary">
                <GlIconfont type="gl-arrow-left" text="退回"></GlIconfont>
              </a-button>
              <a-button>
                <GlIconfont type="gl-deliver" text="转交"></GlIconfont>
              </a-button>
              <a-button>
                <GlIconfont type="gl-pass-for-read" text="传阅"></GlIconfont>
              </a-button>
              <a-button>
                <GlIconfont type="gl-add-approval" text="加签"></GlIconfont>
              </a-button>
              <a-button>
                <GlIconfont type="gl-press-to-do" text="催办"></GlIconfont>
              </a-button>
              <a-button status="warning">
                <a-popconfirm content="是否撤回?">
                  <GlIconfont type="gl-revocation" text="撤回"></GlIconfont>
                </a-popconfirm>
              </a-button>
            </a-button-group>
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
            <component
              :is="'GlInsts' + glRuntimeFlag"
              :glComponentInst="glComponentInst"
              :glIsRuntime="glIsRuntime"
              :glLoopItem="glLoopItem"
              :glLoopIndex="glLoopIndex"
              :glRuntimeFlag="glRuntimeFlag"
            />
            <!--            <slot></slot>-->
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
            <a-empty></a-empty>
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
    <a-modal width="auto" v-model:visible="visibleApprove" @ok="handleOk" @cancel="handleCancel">
      <template #title> 流程处理</template>
      <div>
        <GlPageTemplateFlowApprove></GlPageTemplateFlowApprove>
      </div>
      <template #footer>
        <a-space>
          <a-button size="small" @click="visibleApprove = false"> 取消</a-button>
          <a-button type="primary" size="small">
            <GlIconfont type="gl-send" text="发送"></GlIconfont>
          </a-button>
        </a-space>
      </template>
    </a-modal>
  </div>
</template>

<style lang="less">
.gl-page-template-flow .background-svg-container {
  width: 120px;
  height: 120px;
  position: absolute;
  top: 0;
  right: 50px;
  z-index: 1;
  background-repeat: no-repeat; /* 不重复 */
  background-size: contain; /* 保持图片完整性，可能会有留白 */
  background-position: center center; /* 居中放置 */

  &.background-svg-rejected {
    background-image: url('../../assets/rejected.svg');
  }

  &.background-svg-approved {
    background-image: url('../../assets/approved.svg');
  }

  &.background-svg-underway {
    background-image: url('../../assets/underway.svg');
  }

  &.background-svg-canceled {
    background-image: url('../../assets/canceled.svg');
  }
}

.gl-page-template-flow {
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
