<script lang="ts">
export default {
  name: 'GlRowColLayout'
}
</script>
<script setup lang="ts">
import { nextTick, onUpdated, type PropType, toRaw } from 'vue'
import { mixins, utils } from '@geelato/gl-ui'
import type { I18nItem } from '@geelato/gl-ui-schema'
import type { ComponentInstance } from '@geelato/gl-ui-schema'

const props = defineProps({
  spans: {
    type: Array as PropType<Array<number>>,
    default() {
      return [8, 8, 8]
    }
  },
  label: String,
  /**
   *  显否显示label，用于在表单中
   */
  showLabel: Boolean,
  offsets: {
    type: Array as PropType<Array<number>>,
    default() {
      return [0, 0, 0]
    }
  },
  gutter: {
    type: Number,
    default() {
      return 4
    }
  },
  /**
   * 通过 justify 来进行水平布局。
   */
  justify: {
    type: String
  },
  /**
   * 通过 align 来进行垂直布局
   */
  align: {
    type: String
  },
  /**
   * Col 是否支持换行
   */
  wrap: {
    type: String
  },
  ...mixins.props
})

const colTemplate = () => {
  return {
    id: utils.gid('virtual'),
    componentName: 'GlVirtual',
    title: '项',
    props: {},
    slots: {},
    children: [
      {
        id: utils.gid('ph'),
        componentName: 'GlDndPlaceholder',
        title: '占位符',
        props: {},
        slots: {},
        children: []
      }
    ]
  }
}

const updateInst = () => {
  if (
    props.glComponentInst.children &&
    props.glComponentInst.children.length != props.spans.length
  ) {
    // console.log('colSpans:', colSpans)
    while (props.glComponentInst.children.length < props.spans.length) {
      props.glComponentInst.children.push(JSON.parse(JSON.stringify(colTemplate())))
    }
    props.glComponentInst.children.length = props.spans.length
    nextTick(() => {})
  }
}
onUpdated(() => {
  updateInst()
})

updateInst()

const defaultLocal = 'zh-CN'
const i18nConvert = (value?: string, i18n?: Array<I18nItem>) => {
  const currentLocaleValue = localStorage.getItem('gl-locale') || defaultLocal
  // 如果是默认语言（zh-CN），则直接返回
  if (currentLocaleValue === defaultLocal) {
    return value
  }
  if (i18n) {
    for (let i18nKey in i18n) {
      if (i18n[i18nKey]['zh-CN'] === value) {
        return i18n[i18nKey][currentLocaleValue]
      }
    }
  }
  // 如果没有匹配的字典信息，则直接返回
  return value
}

/**
 *  数据输入组件作为表单项，除了表单组件本身
 */
const showFormItem = (inst: ComponentInstance) => {
  // 排除特定的组件，如表单组件
  if (inst.componentName === 'GlEntityForm') {
    return false
  }
  if (inst.componentName === 'GlRowColLayout' && inst.props.showLabel === true) {
    return true
  }
  return inst.group === 'dataEntry'
}

/**
 * 控制台输出实体对象，便于调试
 * @param inst
 */
const consoleLog = (inst: ComponentInstance) => {
  console.log(
    `onClickFormItem > ${inst.props.label}     字段：${inst.props.bindField?.fieldName}    值：${inst.value}`
  )
  console.log(`onClickFormItem > inst:`, toRaw(inst))
}
</script>

<template>
  <div class="gl-row-col-layout">
    <a-row :gutter="gutter" v-if="glIsRuntime">
      <a-col v-for="(span, index) in spans" :key="index" :span="span">
        <!-- glComponentInst.children[index]就虚拟节点
          注意，label-col-flex的百分比为整数，如6%，若为6.9%有小数的则无效
        -->
        <template v-for="childComponentInst in glComponentInst?.children[index].children">
          <a-form-item
            v-if="childComponentInst && childComponentInst.props.unRender !== true"
            v-show="childComponentInst.props._hidden !== true"
            class="gl-form-item"
            :class="{
              'gl-hidden':
                childComponentInst.props.hideLabel === true || !showFormItem(childComponentInst)
            }"
            :label-col-flex="childComponentInst.props._labelColFlex"
            :field="childComponentInst.props?.bindField?.fieldName"
            :tooltip="i18nConvert(childComponentInst.props?.tooltip, childComponentInst.i18n)"
            :label="i18nConvert(childComponentInst.props?.label, childComponentInst.i18n)"
            :rules="childComponentInst.props?.rules"
            :validate-trigger="[]"
            @click="consoleLog(childComponentInst)"
          >
            <GlComponent
              v-if="childComponentInst"
              :glComponentInst="childComponentInst"
              :glIsRuntime="glIsRuntime"
              :glRuntimeFlag="glRuntimeFlag"
            ></GlComponent>
            <template v-if="childComponentInst.props?.extra" #extra>
              <div>{{ i18nConvert(childComponentInst.props?.extra, childComponentInst.i18n) }}</div>
            </template>
            <template v-if="childComponentInst.props?.description" #help>
              <div>
                {{ i18nConvert(childComponentInst.props?.description, childComponentInst.i18n) }}
              </div>
            </template>
          </a-form-item>
        </template>
      </a-col>
    </a-row>
    <a-row :gutter="gutter" v-else>
      <a-col v-for="(span, index) in spans" :key="index" :span="span">
        <div v-show="glComponentInst?.props._hidden !== true">
          <GlInsts
            :glComponentInst="glComponentInst?.children[index]"
            :glIsRuntime="glIsRuntime"
            :glRuntimeFlag="glRuntimeFlag"
          />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style>
.gl-row-col-layout {
  flex: auto;
}

.gl-row-col-layout > .arco-col {
  overflow-x: auto;
}

.gl-row-col-layout .gl-hidden > .arco-form-item-label-col {
  display: none;
}

.gl-form-item .gl-hidden .arco-form-item-wrapper-col {
  flex: auto;
}
</style>
