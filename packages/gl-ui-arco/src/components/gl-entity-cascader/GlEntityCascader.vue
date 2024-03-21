<script lang="ts">
export default {
  name: 'GlEntityCascader'
}
</script>
<script lang="ts" setup>

import {type PropType, type Ref, ref, watch} from "vue";
import {entityApi, EntityReader, utils} from "@geelato/gl-ui";
import type {CascaderOption} from "@arco-design/web-vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   * 数据实体
   */
  entityReader: {
    type: Object as PropType<EntityReader>,
    required: true
  },
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
const options: Ref<CascaderOption[]> = ref([])
const fetchData = () => {
  entityApi.queryByEntityReader(props.entityReader).then((res: any) => {
    options.value = utils.listToTree2(res?.data)
  })
}

if (props.entityReader?.immediate) {
  fetchData()
}

</script>

<template>
  <a-cascader class="gl-entity-cascader" v-model="mv" :options="options" expand-trigger="hover"/>
</template>

<style>

</style>
