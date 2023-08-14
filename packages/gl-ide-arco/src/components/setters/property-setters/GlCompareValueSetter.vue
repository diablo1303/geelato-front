<template>
  <template v-if="valueType==ValueTypes.Dict" field="dictValueSelect">
    <table class="gl-table">
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-label" style="width: 5em">字典名</td>
        <td>
          <GlDynamicSelect v-model="dictId" entityName="platform_dict" labelFieldName="dictName" valueFieldName="id"
                           ascOrDesc="+"
                           orderFieldName="seq_no"></GlDynamicSelect>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell gl-label">字典项</td>
        <td>
          <GlDict v-model="mv" :dictId="dictId"/>
        </td>
      </tr>
    </table>
  </template>
  <template v-else field="dictValueSelect">
    <a-input v-model="mv"></a-input>
  </template>
</template>

<script lang="ts">
/**
 *  比较值设置组件
 *  依据选择的值类型可以展示不同的值配置方式
 */
export default {
  name: 'GlCompareValueSetter'
}
</script>
<script lang="ts" setup>

import {inject, ref, watch} from 'vue'
import  {ComponentSetterProvideKey,ComponentSetterProvideProxy} from "@geelato/gl-ide";
import {ValueTypes} from "@geelato/gl-ui-schema";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object]
  },
  /**
   *  依赖于ComponentSetter的上下文的props值，如：props.valueType
   */
  dependPropValueType: {
    type: String,
    default() {
      return 'valueType'
    }
  },
  dependPropDictId: {
    type: String,
    default() {
      return 'dictId'
    }
  }
})

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!


const dictId = ref('')
const valueType = ref('')
watch(() => {
  return componentSetterProvideProxy.getPropsRef()
}, () => {
  valueType.value = componentSetterProvideProxy.getPropValue(props.dependPropValueType)
  dictId.value = componentSetterProvideProxy.getPropValue(props.dependPropDictId)
}, {deep: true, immediate: true})

const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

</script>

<style scoped>

</style>
