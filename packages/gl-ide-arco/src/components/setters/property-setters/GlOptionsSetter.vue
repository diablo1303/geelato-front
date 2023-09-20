<template>
  <GlOptions v-if="columns" v-model="mv" :columns="columns"></GlOptions>
</template>
<script lang="ts">
export default {
  name: "GlOptionsSetter"
}
</script>
<script lang="ts" setup>
import {type PropType, ref, watch} from 'vue'
import GlOptions from "../GlOptions.vue";
import type {ColumnType} from "../Types";

const props = defineProps({
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  columns: {
    type: Array as PropType<Array<ColumnType>>,
    default() {
      return [{dataIndex: 'label', title: '名'}, {dataIndex: 'value', title: '值'}]
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

</script>
