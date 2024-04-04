<template>
  <div class="gl-table gl-page-params-setter">
    <GlArrayBaseSetter
      v-slot:default="slotProps"
      v-model="mv"
      :card-mode="true"
      title-field="name"
      :defaultItemForAdd="defaultItemForAdd"
      :wrapperStyle="{ 'border-top': '#dedede 4px solid' }"
      @addItem="update"
      @removeItem="update"
    >
      <table class="gl-table">
        <tr>
          <td class="gl-table-cell gl-label" style="width: 8em">
            <span
              class="gl-tips"
              :title="`在页面脚本编排中，可以通过$gl.fn.getPageParam('${slotProps.item.name}')`"
              >参数名</span
            >
          </td>
          <td class="gl-table-cell">
            <a-input v-model="slotProps.item.name" placeholder="英文"></a-input>
          </td>
        </tr>
        <tr>
          <td class="gl-table-cell gl-label">
            <span>参数标题</span>
          </td>
          <td class="gl-table-cell">
            <a-input v-model="slotProps.item.title" placeholder="中文"></a-input>
          </td>
        </tr>
        <tr>
          <td class="gl-table-cell gl-label">
            <span class="gl-tips" title="在打开该页面时，是否必须传入该参数值">是否必需</span>
          </td>
          <td class="gl-table-cell">
            <a-switch v-model="slotProps.item.required"></a-switch>
          </td>
        </tr>
        <tr>
          <td class="gl-table-cell gl-label">参数类型</td>
          <td class="gl-table-cell">
            <a-select v-model="slotProps.item.type" :options="options"></a-select>
          </td>
        </tr>
        <!--          <tr>-->
        <!--            <td class="gl-table-cell gl-label">参数默认值</td>-->
        <!--            <td class="gl-table-cell">-->
        <!--              <a-input v-model="slotProps.item.defaultValue"></a-input>-->
        <!--            </td>-->
        <!--          </tr>-->
        <tr>
          <td class="gl-table-cell gl-label">参数说明</td>
          <td class="gl-table-cell">
            <a-textarea v-model="slotProps.item.description"></a-textarea>
          </td>
        </tr>
      </table>
    </GlArrayBaseSetter>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlPageParamsSetter'
}
</script>
<script lang="ts" setup>
import { type PropType, ref, watch } from 'vue'
import { useValueTypeOptions } from '@geelato/gl-ui-schema'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<Record<string, any>>>,
    default() {
      return []
    }
  }
})
const emits = defineEmits(['update:modelValue'])

const mv = ref(props.modelValue || [])

watch(
  mv,
  (val, oval) => {
    emits('update:modelValue', mv.value)
  },
  { immediate: true, deep: true }
)
const options = useValueTypeOptions()
const defaultItemForAdd = () => {
  return {
    name: '',
    type: 'String'
  }
}

const update = () => {}
</script>

<style>
.gl-page-params-setter .arco-card-body {
  padding: 0 !important;
}

.gl-page-params-setter .arco-card-header {
  height: 30px;
  padding: 0 8px;
}
</style>
