<template>
  <div class="gl-command-block" :class="{ 'gl-disabled': glComponentInst?._disabled }">
    <div class="gl-command-block-start">
      <div class="gl-left">
        <GlIconfont :type="blockMeta.iconType"></GlIconfont>
      </div>
      <div class="gl-right">
        <div class="gl-title">
          <span class="gl-forbidden">{{ glComponentInst._disabled ? '【已停用】' : '' }}</span>
          <span>{{ blockMeta.title }}</span>
          <span v-if="blockMeta.blockContentLanguage" style="float: right; margin-right: 2em">
            <span @click="expandBlockContentWhenIsLanguage = !expandBlockContentWhenIsLanguage">
              {{ expandBlockContentWhenIsLanguage ? '隐藏代码' : '显示代码' }}
            </span>
          </span>
        </div>
        <div class="gl-description" :class="{ 'gl-annotation': blockMeta.title === '注释' }">
          <!-- 代码块进行特殊展示 -->
          <template v-if="blockMeta.blockContentLanguage">
            <div>
              <span v-if="!props.glComponentInst.props?.description&&!props.glComponentInst.propsExpressions?.description&&props.glComponentInst.props?.code" class="gl-text-singe-line gl-var">
                {{props.glComponentInst.props?.code}}
              </span>
              <div v-else class="gl-annotation">
                {{
                  props.glComponentInst.props?.description ||
                  props.glComponentInst.propsExpressions?.description ||
                  ''
                }}
              </div>
            </div>
            <GlMonacoEditor
              v-if="expandBlockContentWhenIsLanguage"
              ref="monacoEditor"
              :modelValue="highlightedStr"
              :language="blockMeta.blockContentLanguage"
              :style="{ height: '300px' }"
              :readOnly="true"
            ></GlMonacoEditor>
          </template>
          <span v-else v-html="highlightedStr"></span>
        </div>
      </div>
    </div>
    <div class="gl-command-block-callback" v-if="foundInvokeBlocksMeta && invokeBlocks.length > 0">
      <div class="gl-title">
        <span>调用指令</span>
      </div>
      <div class="gl-items">
        <div class="gl-item" v-for="(invokeBlock, invokeBlockIndex) in invokeBlocks">
          <div class="gl-description">
            <span v-html="invokeBlock.label" class="gl-annotation"></span>
          </div>
          <GlInsts
            :glComponentInst="glComponentInst?.children[invokeBlockIndex]"
            :componentStoreId="componentStoreId"
          ></GlInsts>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onUnmounted, type PropType, ref, watch } from 'vue'
import type { ComponentMeta, IPropertySetterMeta } from '@geelato/gl-ui-schema'
import { useComponentMaterialStore } from '@geelato/gl-ui-schema-arco'
import { mixins, PageProvideKey, PageProvideProxy, utils } from '@geelato/gl-ui'
import BlockUtils from './BlockUtils'
import GlInsts from '../../dnd/GlInsts.vue'
import './style.css'

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
// 注意，需在组件元数据中配置了属性invokeBlocks，本组件的回调组件设置才生效
const INVOKE_BLOCK_NAME = 'invokeBlocks'
const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  ...mixins.props
})

// 如果是代码块，可设置是否展开显示
const expandBlockContentWhenIsLanguage = ref(false)
// 如果是代码块，描述信息试着取描述字段description
const componentMaterialStore = useComponentMaterialStore()
const blockMeta =
  props.componentMeta || componentMaterialStore.findMetaByName(props.glComponentInst.componentName)
const blockInfoVarStr = blockMeta.blockContent
// 如果是代码块，则不需要变量高亮展示，在编辑器中渲染即可
const highlightedVarStr =
  (blockMeta.blockContentLanguage
    ? blockInfoVarStr
    : BlockUtils.highlightVariables(blockInfoVarStr)) || ''
// 在新的窗口打开页面地址<span style='color: blue'>${url}</span>
const highlightedStr = ref('')

const foundInvokeBlocksMeta = blockMeta.properties.find((p: IPropertySetterMeta) => {
  return p.name === INVOKE_BLOCK_NAME
})

const invokeBlocks = computed(() => {
  const items: Array<{ key: string; label: string }> = []
  if (foundInvokeBlocksMeta && props.glComponentInst.props.invokeBlocks) {
    props.glComponentInst.props.invokeBlocks.forEach((invokeBlockKey: string, index: number) => {
      items.push({ key: invokeBlockKey, label: getInvokeBlockLabel(invokeBlockKey) })
      // 如果
      if (props.glComponentInst.children.length < props.glComponentInst.props.invokeBlocks.length) {
        props.glComponentInst.children.push({
          componentName: 'GlVirtual',
          id: utils.gid('v'),
          props: {},
          slots: {},
          children: [
            {
              componentName: 'GlDndPlaceholder',
              id: utils.gid('pHolder'),
              props: {},
              slots: {},
              children: [],
              actions: [],
              style: {}
            }
          ],
          actions: [],
          style: {}
        })
      }
    })
  }
  return items
})

const getInvokeBlockLabel = (invokeBlockKey: string) => {
  if (foundInvokeBlocksMeta) {
    const foundOption = foundInvokeBlocksMeta.setterComponentProps.options.find(
      (option: { label: string; value: string }) => {
        return option.value === invokeBlockKey
      }
    )
    if (foundOption) {
      return foundOption.label
    }
  }
  return invokeBlockKey
}

watch(
  props.glComponentInst,
  () => {
    highlightedStr.value = BlockUtils.replaceVariables(
      highlightedVarStr,
      props.glComponentInst.props,
      props.glComponentInst.propsExpressions
    )
  },
  { immediate: true, deep: true }
)

onUnmounted(() => {
  // 在退出时，才最终设置invokeBlocks的children，配置过程不删减，避免误操作
})
</script>
