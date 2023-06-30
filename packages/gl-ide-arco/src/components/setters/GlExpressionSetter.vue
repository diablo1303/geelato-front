<script lang="ts">
/**
 *  表达式编辑器
 */
export default {
  name: 'GlExpressionSetter'
}
</script>
<script lang="ts" setup>

import {ref} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  是否显示Input输入框，显示input时，不显示button，否则显示button
   *  如果某属性的值，可以有自己的配置方式，同时可以支持表达式进行配置，此时不需要显示input
   *  如果某属性的值，本身就是表达式，此时需要显示input
   */
  showInput: {
    type: Boolean,
    default() {
      return false
    }
  }
})
const mv = ref(props.modelValue)
const inputMv = ref(props.modelValue)
// watch(mv, () => {
//   emits('update:modelValue', mv.value)
// })

const valueExpressModalVisible = ref(false)
/**
 * 打开值表达式设置窗口
 * @param propertySetterMeta
 */
const openValueExpressModal = () => {
  valueExpressModalVisible.value = true
}
const clearValueExpress = () => {
  // const propertySetterMeta = currentOpenModalPropertySetterMeta
  mv.value = ''
  // @ts-ignore
  // componentModel[propertySetterMeta.type + 'Expression'][propertySetterMeta.name] = ''
  valueExpressModalVisible.value = false
  inputMv.value = mv.value
  emits('update:modelValue', mv.value)
}
const handleOk = () => {
  inputMv.value = mv.value
  emits('update:modelValue', mv.value)
}

const handleCancel = () => {
  // emits('update:modelValue', mv.value)
  mv.value = props.modelValue
}

</script>

<template>
  <div>
    <a-input v-if="showInput" v-model="inputMv" @click="openValueExpressModal" readonly></a-input>
    <a-button v-if="!showInput" size="mini" @click="openValueExpressModal"
              :type="mv?'primary':''"
              style="padding: 0 0.1em;height: 2.6em;font-weight: 700">{ / }
    </a-button>
    <a-modal title="变量绑定" v-model:visible="valueExpressModalVisible"
             :mask-style="{background:'rgba(0, 0, 0, 0.25)'}"
             @ok="handleOk"
             @cancel="handleCancel">
      <a-textarea v-model="mv" placeholder="在此输入..."></a-textarea>
      <a-button style="float: right" type="outline" size="mini" status="danger"
                @click="clearValueExpress">清除绑定
      </a-button>
      <div>
        <h4 style="font-weight: 600">该属性的值</h4>
        如果设置了该变量绑定，则以该变量绑定计算的结果为优先。
        <h4 style="font-weight: 600">用法</h4>
        输入框内默认支持变量，写法和 JS 写法完全一致。
        <li>变量: $gl.xxx</li>
        <li>字符串: "我是字符串，我有引号"</li>
        <li>数字: 123</li>
        <li>布尔值: true / false</li>
        <li>对象: { name: "王一" }</li>
        <li>数组: ["1", "2"]或[1, 2]</li>
        <li>空值: null</li>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>

</style>
