<template>
  <a-select v-model="mv" allow-clear allow-search>
    <a-option v-for="item in selectOptions" :value="item[valueFiledName]">{{ item[labelFieldName] }}</a-option>
  </a-select>
</template>
<script lang="ts">
/**
 *  基于数据库实体的动态数据选项设置器
 */
export default {
  name: "GlOptionsDynamicSetter"
}
</script>
<script lang="ts" setup>
import {defineComponent, ref, watch} from 'vue'
import GlOptions from "../GlOptions.vue";
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
  }
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
  entityApi.query(props.entityName, `${props.valueFiledName},${props.labelFieldName}`, {}).then((resp: any) => {
    selectOptions.value = resp.data?.data || []
  })
}
loadData()
</script>

<style scoped>

</style>
