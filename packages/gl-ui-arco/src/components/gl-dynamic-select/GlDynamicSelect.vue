<template>
  <a-select v-model="mv"
            :allow-clear="allowClear"
            :allow-search="allowSearch"
            :readonly="readonly"
            :size="size"
            :disabled="disabled"
            :placeholder="placeholder"
  >
    <a-option v-for="item in selectOptions" :value="item[valueFiledName]">{{ item[labelFieldName] }}</a-option>
  </a-select>
</template>
<script lang="ts">
/**
 *  基于数据库实体的动态数据选择器
 */
export default {
  name: "GlDynamicSelect"
}
</script>
<script lang="ts" setup>
import {type PropType, ref, watch} from 'vue'
import {entityApi} from "@geelato/gl-ui";

const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  entityName: {
    type: String,
    required: true
  },
  labelFieldName: {
    type: String,
    required: true
  },
  valueFiledName: {
    type: String,
    default() {
      return 'id'
    }
  },
  orderFiledName: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   * asc or desc
   */
  ascOrDesc: {
    type: String,
    default() {
      return '+'
    }
  },
  allowClear: {
    type: Boolean,
    default() {
      return false
    }
  },
  allowSearch: {
    type: Boolean,
    default() {
      return true
    }
  },
  readonly: Boolean,
  size: String as PropType<"medium" | "small" | "mini" | "large" | undefined>,
  placeholder: String,
  disabled: Boolean
})
const emits = defineEmits(['update:modelValue'])
const mv = ref(props.modelValue)
watch(mv,
    (val: any) => {
      emits('update:modelValue', val)
    },
    {deep: true}
)
const selectOptions = ref([])
const loadData = () => {
  if (props.entityName && props.valueFiledName && props.labelFieldName) {
    const params = props.orderFiledName ? {'@order': props.orderFiledName + '|' + props.ascOrDesc} : {}
    Object.assign(params, {'delStatus|eq': '0'})
    console.log('GlDynamicSelect > loadData() > entityName:', props.entityName,'params:', params)
    entityApi.query(props.entityName, `${props.valueFiledName},${props.labelFieldName}`, params).then((resp: any) => {
      selectOptions.value = resp.data?.data || []
    })
  }
}
watch(() => {
  return props.entityName + props.valueFiledName + props.labelFieldName
}, () => {
  loadData()
}, {immediate: true})
</script>

<style scoped>

</style>
