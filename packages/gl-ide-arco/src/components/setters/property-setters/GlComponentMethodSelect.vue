<template>
  <a-tooltip :content="currentMethodMeta?.description||'该方法无描述信息'"  background-color="#3491FA">
    <a-select size="small" v-model="mv" allow-search allow-clear>
      <a-option v-for="methodMeta in componentMeta?.methods" :value="methodMeta.name"
        >{{ methodMeta.title + ' ' + methodMeta.name }}
      </a-option>
    </a-select>
<!--    <a-alert :show-icon="false">{{ currentMethodMeta?.description?'【描述】'+currentMethodMeta?.description:''}}</a-alert>-->

  </a-tooltip>
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
import { inject, onUnmounted, type Ref, ref, watch } from 'vue'
import { ComponentSetterProvideKey, ComponentSetterProvideProxy } from '@geelato/gl-ide'
import { ComponentMeta, MethodMeta } from '@geelato/gl-ui-schema'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  /**
   *  方法name
   */
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  依赖于inject进来的componentSetterProvideProxy中的变量
   *  一般不需要配置，当在同一个ComponentSetter中有多个componentMeta时，需要明确依赖哪一个
   */
  dependVarComponentMeta: {
    type: String,
    default() {
      return 'componentMeta'
    }
  },
  /**
   *  将选择的组件设置到变量中
   */
  exposeVarMethodMeta: {
    type: String,
    default() {
      return 'methodMeta'
    }
  }
})

const mv = ref(props.modelValue)
watch(mv, () => {
  setMeta()
  emits('update:modelValue', mv.value)
})

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!
const currentMethodMeta: Ref<MethodMeta | undefined> = ref(new MethodMeta())
// const componentMeta = ref({})
const componentMeta = ref(new ComponentMeta())
const setMeta = () => {
  if (!componentMeta.value) return
  // 设置方法元数据
  const foundMethodMeta = componentMeta.value.methods?.find((method: MethodMeta) => {
    return method.name === mv.value
  })
  componentSetterProvideProxy.setVarValue(props.exposeVarMethodMeta, foundMethodMeta)
  currentMethodMeta.value = foundMethodMeta
}
const setData = () => {
  componentMeta.value = componentSetterProvideProxy.getVarValue(props.dependVarComponentMeta)
  setMeta()
}
const token = componentSetterProvideProxy.addVarValueChangeCallback(
  props.dependVarComponentMeta,
  setData
)
onUnmounted(() => {
  componentSetterProvideProxy.removeVarValueChangeCallback(token)
})
setData()
</script>

<style scoped></style>
