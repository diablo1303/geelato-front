<template>
  <table class="gl-table">
    <tr>
      <td class="gl-table-cell gl-label" style="width: 7em" title="该值应和Props中表示“页面extendId”的属性名称一致">
        页面属性名
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.pageExtendIdName" placeholder="该值应和Props中表示“页面extendId”的属性名称一致"/>
      </td>
    </tr>
  </table>
</template>
<script lang="ts">
export default {
  name: "GlPageComponentSelectBuilder"
}
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object,
    default() {
      return {
        pageExtendIdName: ''
      }
    }
  }
})
const mv = ref(props.modelValue)

watch(mv, () => {
  emits('update:modelValue', mv.value)
}, {deep: true, immediate: true})
</script>

<style scoped>

</style>
