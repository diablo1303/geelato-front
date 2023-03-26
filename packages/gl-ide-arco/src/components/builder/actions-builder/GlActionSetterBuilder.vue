<template>
  <table class="gl-table">
    <tr>
      <td class="gl-table-cell gl-label" title="显示名称。显示在设计器中">
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
import {PropType, ref, watch} from 'vue'
import {ActionSetterMeta} from "@geelato/gl-ui-schema";
import {IActionSetterMeta} from "@geelato/gl-ui-schema";

const props = defineProps({
  modelValue: {
    type: Object as PropType<IActionSetterMeta>,
    default() {
      return new ActionSetterMeta()
    }
  }
})
const emits = defineEmits(['updateSetter'])

const mv = ref(props.modelValue)
// onBeforeUpdate(() => {
//   mv.value = props.modelValue
// })

watch(mv, (val, oval) => {
  console.log('mv:', val, oval)
  emits('updateSetter', mv)
}, {immediate: true, deep: true})

</script>

<style scoped>

</style>
