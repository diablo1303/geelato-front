<template>
  <div class="gl-component-param-setter">
    <div v-if="methodMeta?.params?.length === 0">
      <span style="margin-left: 1em">无参数</span>
    </div>
    <div v-else-if="methodMeta">
      <a-collapse :default-active-key="[1]" accordion>
        <a-collapse-item
          v-for="(paramMeta, index) in methodMeta.params"
          :key="index"
          style="width: 100%"
        >
          <template #header>
            <div style="display: flex">
              <div style="flex: auto">
                <span style="color: red" v-if="paramMeta.required" title="必需">*</span>
                {{ paramMeta.title + ' ' + paramMeta.name }}
              </div>
              <div style="width: 120px;text-align: right">
                <a-tag color="blue"> {{ paramMeta.type }}</a-tag>
              </div>
            </div>
          </template>
          <GlExpressionSetter
            v-model="paramInsts[index].valueExpression"
            show-input
            placeholder="值"
          ></GlExpressionSetter>
          {{paramMeta.description}}
        </a-collapse-item>
      </a-collapse>
    </div>
  </div>
</template>
<script lang="ts">
/**
 *  组件方法的参数配置
 */
export default {
  name: 'GlComponentParamSetter'
}
</script>
<script lang="ts" setup>
import { inject, onUnmounted, type Ref, ref, watch } from 'vue'
import { ComponentSetterProvideKey, ComponentSetterProvideProxy } from '@geelato/gl-ide'
import { MethodMeta, ParamMeta } from '@geelato/gl-ui-schema'
import type { Param } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  /**
   *  参数数组
   */
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  /**
   *  dependVar*，是命名规范，便于看出需要依赖其它变量
   *  依赖于inject进来的componentSetterProvideProxy中的变量
   *  一般不需要配置，当在同一个ComponentSetter中有多个methodMeta时，需要明确依赖哪一个
   */
  dependVarMethodMeta: {
    type: String,
    default() {
      return 'methodMeta'
    }
  }
})

const paramInsts: Ref<Param[]> = ref([])
watch(
  paramInsts.value,
  () => {
    console.log('update:modelValue')
    emits('update:modelValue', paramInsts.value)
  },
  { deep: true }
)

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!

const methodMeta: Ref<MethodMeta> = ref(new MethodMeta())
const setData = () => {
  try {
    methodMeta.value = componentSetterProvideProxy.getVarValue(props.dependVarMethodMeta)
    methodMeta.value?.params?.forEach((paramMeta: ParamMeta) => {
      // 初始传入的值
      const foundParamInst: any = props.modelValue?.find((paramInst: any) => {
        return paramInst.name === paramMeta.name
      })
      paramInsts.value.push({
        name: paramMeta.name,
        value: undefined,
        valueExpression: foundParamInst?.valueExpression
      })
    })
  } catch (e) {
    console.error(e)
  }
}
const token = componentSetterProvideProxy.addVarValueChangeCallback(
  props.dependVarMethodMeta,
  setData
)
onUnmounted(() => {
  componentSetterProvideProxy.removeVarValueChangeCallback(token)
})

const update = () => {}
setData()
</script>

<style>
.gl-component-param-setter .arco-collapse-item-header-title {
  width: 100%;
}
</style>
