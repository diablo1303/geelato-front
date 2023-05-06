<script lang="ts">
export default {
  name: 'GlComponentI18nSetter'
}
</script>
<script setup lang="ts">
import {PropType, ref, watch} from "vue";
import {ComponentInstance, ComponentMeta} from "@geelato/gl-ui-schema";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  componentInstance: {
    type: ComponentInstance
  }
})

const mv = ref(props.componentInstance!.i18n)

watch(mv, (val) => {
  props.componentInstance!.i18n = val
}, {deep: true})
// const update = () => {
//   emits('update:modelValue', mv.value)
// }
</script>

<template>
  <div>
    <GlArrayBaseSetter v-slot:default="slotProps" v-model="mv" :defaultItemForAdd="{'zh-CN':'','en-US':''}"
                       @addItem="update"
                       @removeItem="update">
      <table style="width: 100%">
        <tr>
          <td>
            <a-input placeholder="简体zh-CN" v-model="mv[slotProps.index]['zh-CN']" @change="update"></a-input>
          </td>
          <td>
            <a-input placeholder="英文en-US" v-model="mv[slotProps.index]['en-US']" @change="update"></a-input>
          </td>
        </tr>
      </table>
    </GlArrayBaseSetter>
  </div>
</template>

<style scoped>

</style>
