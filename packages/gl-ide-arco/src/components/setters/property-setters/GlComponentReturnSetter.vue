<template>
  <div class="gl-component-return-setter" style="margin-left: 1em">
    <div v-if="returnInfo">
      <div>
        <div style="font-weight: 600; padding: 8px 0">返回类型：</div>
        {{ returnInfo.returnType || '无' }}
      </div>
      <div>
        <div style="font-weight: 600; padding: 8px 0">返回描述</div>
        {{ returnInfo.description || '无' }}
      </div>
      <div v-if="returnInfo.docId" style="padding: 8px 0; color: #165dff">
        <GlPageHelp :pageHelpId="pageHelpId" text="查看更多"></GlPageHelp>
      </div>
    </div>
    <div v-else>无</div>
  </div>
</template>
<script lang="ts">
/**
 *  组件方法返回结果信息
 */
export default {
  name: 'GlComponentReturnSetter'
}
</script>
<script lang="ts" setup>
import { inject, onUnmounted, type Ref, ref } from 'vue'
import { ComponentSetterProvideKey, ComponentSetterProvideProxy } from '@geelato/gl-ide'
import { MethodMeta, ReturnInfoMeta } from '@geelato/gl-ui-schema'

/**
 *  返回信息描述不需要在实体中体现，这下不需要用到modelValue双向绑定
 */
const props = defineProps({
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

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!
const returnInfo: Ref<ReturnInfoMeta> = ref(new ReturnInfoMeta())
const pageHelpId: Ref<string | undefined> = ref('')
const setData = () => {
  try {
    const methodMeta: MethodMeta = componentSetterProvideProxy.getVarValue(
      props.dependVarMethodMeta
    )
    pageHelpId.value = methodMeta?.returnInfo?.docId
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

setData()
</script>
