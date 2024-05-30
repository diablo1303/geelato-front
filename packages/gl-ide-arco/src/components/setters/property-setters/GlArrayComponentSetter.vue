<template>
  <GlArrayBaseSetter v-slot:default="slotProps" v-model="mv" :defaultItemForAdd="getTemplateInst" @addItem="update"
                     @removeItem="update">
    <GlComponentSelect :key="mv[slotProps.index].id" v-model="mv[slotProps.index]"></GlComponentSelect>
  </GlArrayBaseSetter>
</template>
<script lang="ts">
export default {
  name: "GlArrayComponentSetter"
}
</script>
<script lang="ts" setup>
import {type PropType, ref} from 'vue'
import {ComponentInstance} from "@geelato/gl-ui-schema";
import {utils} from "@geelato/gl-ui";
import GlComponentSelect from "./GlComponentSelect.vue";
import GlArrayBaseSetter from "./GlArrayBaseSetter.vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<ComponentInstance>>,
    default() {
      return []
    }
  }
})
const mv = ref(props.modelValue)
// 处理历史数据，确保都有id
mv.value.forEach((item: any) => item.id = item.id ? item.id : utils.gid('id', 20))

const getTemplateInst = () => {
  const inst = new ComponentInstance();
  inst.id = utils.gid('id', 20)
  return inst
}
const update = () => {
  emits('update:modelValue', mv.value)
}
</script>

<style scoped>

</style>
