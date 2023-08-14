<template>
  <a-select size="small" v-model="mv" allow-search allow-clear>
    <a-option v-for="method in componentMeta?.methods" :value="method.name">{{
        method.title + ' ' + method.name
      }}
    </a-option>
  </a-select>
</template>
<script lang="ts">
/**
 *  组件方法选择
 */
export default {
  name: 'GlComponentMethodSelect'
}
</script>
<script lang="ts" setup>
import {inject, onUnmounted, ref, watch} from "vue";
import  {ComponentSetterProvideKey,ComponentSetterProvideProxy} from "@geelato/gl-ide";
import {ComponentMeta} from "@geelato/gl-ui-schema";


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
// const componentMeta = ref({})
const componentMeta = ref(new ComponentMeta())
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