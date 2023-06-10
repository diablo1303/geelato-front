<template>
  <a-select v-if="componentMeta&&componentMeta.actions" size="small" v-model="mv" allow-search allow-clear>
    <a-option v-for="action in componentMeta.actions" :value="action.name">{{
        action.title + ' ' + action.name
      }}
    </a-option>
  </a-select>
</template>
<script lang="ts">
/**
 *  组件动作选择
 */
export default {
  name: 'GlComponentActionSelect'
}
</script>
<script lang="ts" setup>
import {inject, onUnmounted, ref, watch} from "vue";
import ComponentSetterProvideProxy, {ComponentSetterProvideKey} from "../ComponentSetterProvideProxy";

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  /**
   *  应用页面节点id
   */
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  依赖于inject进来的componentSetterProvideProxy中的变量
   *  一般不需要配置，当在同一个ComponentSetter中有多个entityMeta时，需要明确依赖哪一个
   */
  dependVarComponentMeta: {
    type: String,
    default() {
      return 'componentMeta'
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!
const componentMeta = ref({})
const setData = () => {
  componentMeta.value = componentSetterProvideProxy.getVarValue(props.dependVarComponentMeta)
}
const token = componentSetterProvideProxy.addVarValueChangeCallback(props.dependVarComponentMeta, setData)
onUnmounted(() => {
  componentSetterProvideProxy.removeVarValueChangeCallback(token)
})
setData()
</script>

<style scoped>

</style>