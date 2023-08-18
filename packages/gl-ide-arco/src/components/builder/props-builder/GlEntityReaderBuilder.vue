<template>
  <table class="gl-table">
    <tr>
      <td class="gl-table-cell gl-label" style="width: 3em"
          title="可选择的字段别名，如对于用于timeline组件时，需要设置label、content等,在这里可以定义这些字段便于配置时直接选择">
        别名
      </td>
      <td class="gl-table-cell">
        <GlOptions v-model="mv.options"
                   :columns="[{dataIndex: 'label',title:'名'},{dataIndex: 'value',title:'值'}]"></GlOptions>
      </td>
    </tr>
  </table>
</template>
<script lang="ts">
export default {
  name: "GlEntityReaderBuilder"
}
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue'
import GlOptions from "../../setters/GlOptions.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default() {
      return {
        options: []
      }
    }
  }
})
const emits = defineEmits(['update'])
const mv = ref(props.modelValue)
watch(
    () => mv,
    (val: any) => {
      emits('update', val)
    },
    {deep: true}
)

const items = ref(props.modelValue.options)
const update = () => {
}

</script>

<style scoped>

</style>
