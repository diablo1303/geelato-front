<template>
  <div class="gl-command-block" :class="{'gl-disabled':glComponentInst._disabled}">
    <div class="gl-command-block-start">
      <div class="gl-left">
        <GlIconfont :type="blockMeta.iconType"></GlIconfont>
      </div>
      <div class="gl-right">
        <div class="gl-title">
          <span>{{glComponentInst._disabled?'【已停用】':''}}</span>
          <span>{{ blockMeta.title }}</span>
        </div>
        <div class="gl-content">
          <span v-html="highlightedStr"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {PropType, ref, watch} from "vue";
import {ComponentMeta} from "@geelato/gl-ui-schema";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import {mixins} from "@geelato/gl-ui";
import BlockUtils from "./BlockUtils";
import "./style.css"
const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  ...mixins.props
})

const componentMaterialStore = useComponentMaterialStore()
const blockMeta = props.componentMeta||componentMaterialStore.findMetaByName(props.glComponentInst.componentName)
const blockInfoVarStr = blockMeta.blockContent
const highlightedVarStr = BlockUtils.highlightVariables(blockInfoVarStr);
// 在新的窗口打开页面地址<span style='color: blue'>${url}</span>
const highlightedStr = ref('')

watch(props.glComponentInst, () => {
  highlightedStr.value = BlockUtils.replaceVariables(highlightedVarStr, props.glComponentInst.props)
}, {immediate: true, deep: true})
</script>
<style>

</style>