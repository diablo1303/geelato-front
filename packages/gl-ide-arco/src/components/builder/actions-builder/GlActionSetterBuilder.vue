<template>
  <table class="gl-table">
    <tr>
      <td class="gl-table-cell gl-label" style="width: 8em" title="显示名称，用于配置触发组件动作时显示">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        动作标题
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.title"></a-input>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="">
        动作描述
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.description" placeholder="description"></a-input>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
export default {
  name:'GlActionSetterBuilder'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import {type PropType, ref, watch} from 'vue'
import {ActionSetterMeta} from "@geelato/gl-ui-schema";

const props = defineProps({
  modelValue: {
    type: Object as PropType<ActionSetterMeta>,
    default() {
      return new ActionSetterMeta()
    }
  }
})
const emits = defineEmits(['updateSetter'])

const mv = ref(props.modelValue)

watch(mv, (val, oval) => {
  emits('updateSetter', mv.value)
}, {immediate: true, deep: true})

</script>

<style scoped>

</style>
