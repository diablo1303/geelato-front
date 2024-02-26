<template>
  <div class="gl-command-block"
       :class="{'gl-disabled':glComponentInst._disabled,'gl-hover':componentStore.currentDragComponentId===glComponentInst.id}">
    <div class="gl-command-block-start">
      <div class="gl-left">
        <GlIconfont :type="blockMeta.iconType"></GlIconfont>
      </div>
      <div class="gl-right">
        <div class="gl-title" title="点击折叠/展开">
          <span @click="show=!show" style="cursor: pointer" >{{ glComponentInst._disabled ? '【已停用】' : '' }}</span>
          <span @click="show=!show" style="cursor: pointer" >{{ convertTitle(blockMeta.title) }}</span>
          <span @click="show=!show" v-if="!show" style="color: #8f19ff;float: right">【点击展开】</span>
        </div>
        <div class="gl-description">
          <span v-html="highlightedStr"></span>
        </div>
      </div>
    </div>
    <div class="gl-command-block-children" v-show="show">
      <GlInsts :glComponentInst="glComponentInst" :componentStoreId="componentStoreId"></GlInsts>
    </div>
    <div class="gl-command-block-end">
      <div class="gl-left">
        <GlIconfont :type="blockMeta.iconType"></GlIconfont>
      </div>
      <div class="gl-right">
        <div class="gl-title">
          <span>{{ glComponentInst._disabled ? '【已停用】' : '' }}</span>
          <span>结束 {{ convertTitle(blockMeta.title) }}</span>
        </div>
        <div class="gl-description">
          <span>&nbsp;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {inject, type PropType, ref, watch} from "vue";
import type {ComponentMeta} from "@geelato/gl-ui-schema";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import {mixins, PageProvideKey, PageProvideProxy} from "@geelato/gl-ui";
import BlockUtils from "./BlockUtils";
import "./style.css"
import {componentStoreFactory} from "@geelato/gl-ide";

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  ...mixins.props
})
const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)
// const message: string = '在新的窗口打开页面地址${url}，输入参数为：{url}';
// const params: Params = { url: 'https://www.baidu.com' };
// const replaced: string = replaceVariables(message, params);
// console.log(replaced); // 在新的窗口打开页面地址https://www.baidu.com，输入参数为：{"url":"https://www.baidu.com"}
const componentMaterialStore = useComponentMaterialStore()
const findBlockMeta = (componentName: string) => {
  return componentMaterialStore.findMetaByName(componentName)
}

const blockMeta = props.componentMeta || componentMaterialStore.findMetaByName(props.glComponentInst.componentName)
const blockInfoVarStr = blockMeta.blockContent
const highlightedVarStr = BlockUtils.highlightVariables(blockInfoVarStr);
// 在新的窗口打开页面地址<span style='color: blue'>${url}</span>
const highlightedStr = ref('')

/**
 * 处理IF-IF ELSE特殊的命令
 * @param title
 */
const convertTitle = (title: string) => {
  if (props.glComponentInst.props.mode === 'else if') {
    // ELSE IF
    return title.replace('IF', 'ELSE IF')
  }
  return title
}

watch(props.glComponentInst, () => {
  highlightedStr.value = BlockUtils.replaceVariables(highlightedVarStr, props.glComponentInst.props, props.glComponentInst.propsExpressions)
}, {immediate: true, deep: true})

const show = ref(true)

</script>
<style>
</style>