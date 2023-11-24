<script lang="ts">
/**
 *  页面布局
 *  不适用于表单内部的元素布局
 */
export default {
  name: 'GlLayoutPage'
}
</script>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { mixins } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  showHeader: Boolean,
  showFooter: Boolean,
  showSiderExtend: Boolean,
  // 侧边属性配置
  siderProps: Object,
  // 扩展侧边属性配置
  siderExtendProps: Object,
  ...mixins.props
})

const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
  <a-layout v-if="glComponentInst">
    <a-layout-header v-if="showHeader">
      <component
        :is="'GlInsts' + glRuntimeFlag"
        :glComponentInst="glComponentInst.children[0]"
        :glIsRuntime="glIsRuntime"
        :glRuntimeFlag="glRuntimeFlag"
      />
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-bind="siderProps">
        <component
          :is="'GlInsts' + glRuntimeFlag"
          :glComponentInst="glComponentInst.children[1]"
          :glIsRuntime="glIsRuntime"
          :glRuntimeFlag="glRuntimeFlag"
        />
      </a-layout-sider>
      <a-layout-sider v-if="showSiderExtend" v-bind="siderExtendProps">
        <component
          :is="'GlInsts' + glRuntimeFlag"
          :glComponentInst="glComponentInst.children[2]"
          :glIsRuntime="glIsRuntime"
          :glRuntimeFlag="glRuntimeFlag"
        />
      </a-layout-sider>
      <a-layout-content>
        <component
          :is="'GlInsts' + glRuntimeFlag"
          :glComponentInst="glComponentInst.children[3]"
          :glIsRuntime="glIsRuntime"
          :glRuntimeFlag="glRuntimeFlag"
        />
      </a-layout-content>
    </a-layout>
    <a-layout-footer v-if="showFooter">
      <component
        :is="'GlInsts' + glRuntimeFlag"
        :glComponentInst="glComponentInst.children[4]"
        :glIsRuntime="glIsRuntime"
        :glRuntimeFlag="glRuntimeFlag"
      />
    </a-layout-footer>
  </a-layout>
</template>

<style scoped></style>
