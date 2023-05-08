<script lang="ts">
export default {
  name: 'GlValidateRulesSetter'
}
</script>
<script setup lang="ts">
import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  /**
   * fieldRules
   */
  modelValue: {
    type: Array,
    default() {
      return []
    }
  }
})

type ruleType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url' | 'ip'
// ruleOption中，将name改成了value，是为了在下拉选择时，能选择中ruleOption对象的值，取的是ruleOption对象的value字段
const ruleOptions = [
  {
    label: '验证长度（字符串）',
    value: 'length',
    message: '长度不符合',
    type: 'string',
    setter: 'AInputNumber',
    props: {placeholder: '长度值'}
  },
  {
    label: '最大长度（字符串）',
    value: 'maxLength',
    message: '最大长度不符合',
    type: 'string',
    setter: 'AInputNumber',
    props: {placeholder: '长度值'}
  },
  {
    label: '最小长度（字符串）',
    value: 'minLength',
    message: '最小长度不符合',
    type: 'string',
    setter: 'AInputNumber',
    props: {placeholder: '长度值'}
  },
  {
    label: '正则校验（字符串）',
    value: 'match',
    message: 'XX校验不通过',
    type: 'string',
    setter: 'AInput',
    props: {placeholder: '正则'}
  },
  {
    label: '大写（字符串）',
    value: 'uppercase',
    message: '需大写',
    type: 'string',
    setter: 'ASwitch',
    props: {placeholder: ''},
    defaultValue: true,
    showSetter: false
  },
  {
    label: '小写（字符串）',
    value: 'lowercase',
    message: '需小写',
    type: 'string',
    setter: 'ASwitch',
    props: {placeholder: ''},
    defaultValue: true,
    showSetter: false
  },
  {
    label: '最小值（数值）',
    value: 'min',
    message: '不符合最小值要求',
    type: 'number',
    setter: 'AInputNumber',
    props: {placeholder: '最小值'}
  },
  {
    label: '最大值（数值）',
    value: 'max',
    message: '不符合最大值要求',
    type: 'number',
    setter: 'AInputNumber',
    props: {placeholder: '最大值'}
  },
  {
    label: '校验数值（数值）',
    value: 'equal',
    message: '不符合数值要求',
    type: 'number',
    setter: 'AInputNumber',
    props: {placeholder: '校验数值', title: '校验数值'}
  },
  {
    label: '正数（数值）',
    value: 'positive',
    message: '不是正数',
    type: 'number',
    setter: 'ASwitch',
    props: {placeholder: '数值', title: '数值'},
    defaultValue: true,
    showSetter: false
  },
  {
    label: '负数（数值）',
    value: 'negative',
    message: '不是负数',
    type: 'number',
    setter: 'ASwitch',
    props: {placeholder: '数值', title: '数值'},
    defaultValue: true,
    showSetter: false
  },
  {
    label: '值需为true',
    value: 'true',
    message: '值需为true',
    type: 'boolean',
    setter: 'ASwitch',
    props: {placeholder: '', title: ''},
    defaultValue: true,
    showSetter: false
  },
  {
    label: '值需为false',
    value: 'false',
    message: '值需为false',
    type: 'boolean',
    setter: 'ASwitch',
    props: {placeholder: '', title: ''},
    defaultValue: true,
    showSetter: false
  }
]

// TODO 数组等规则
// includes
// 数组中是否包含给定值（array）
// any[]
// -
// deepEqual
// 数组元素是否相等（array）
// any
// -
// empty
// 是否为空（object）
// boolean
// false
// hasKeys
// 对象是否包含给定属性（object）
// string[]
// -
// validator
// 自定义校验规则


const requiredRule = ref<Array<any>>([])
const items = ref<Array<any>>([])

if (props.modelValue.length === 0) {
  requiredRule.value.push({required: false, message: '必填', ruleName: 'required', type: 'boolean'})
} else {
  props.modelValue.forEach((rule: any) => {
    if (rule.ruleName === 'required') {
      // required 规则
      requiredRule.value.push(rule)
    } else {
      // 非required规则
      let ruleOption = ruleOptions.find((option: any) => {
        console.log(option.value, rule.ruleName, option.value === rule.ruleName)
        return option.value === rule.ruleName
      })
      if (ruleOption) {
        items.value.push({
          label: ruleOption!.label,
          name: ruleOption!.value,
          setter: ruleOption!.setter,
          showSetter: ruleOption.showSetter,
          props: ruleOption!.props,
          type: ruleOption!.type,
          message: rule.message,
          value: rule[ruleOption!.value] || ruleOption.defaultValue
        })
      }
    }
  })
}
const update = () => {

}
const emit = (val: any) => {
  let result = []
  result.push(...requiredRule.value)
  items.value.forEach((item: any) => {
    result.push({
      type: item.type,
      [item.name]: item.value,
      message: item.message,
      ruleName: item.name
    })
  })
  emits('update:modelValue', result)
}

watch(requiredRule, emit, {deep: true})
watch(items, emit, {deep: true})

const addRule = (ruleOption: any) => {
  // console.log('try to add rule:', ruleOption)
  const foundRule = items.value.find((rule: any) => {
    return rule.name === ruleOption.value
  })
  // 避免重复加同一规则
  if (!foundRule) {
    items.value.push({
      label: ruleOption.label,
      name: ruleOption.value,
      setter: ruleOption.setter,
      showSetter: ruleOption.showSetter,
      props: ruleOption.props,
      type: ruleOption.type,
      message: ruleOption.message,
      value: ruleOption.defaultValue
    })
  }
}

const selectedRule = ref()
watch(selectedRule, (val) => {
  if (val.value) {
    addRule(val)
    selectedRule.value = {label: '', value: ''}
  }
})

const removeRule = (args: any) => {

}
</script>

<template>
  <div>
    <div class="gl-table">
      <template v-for="item in requiredRule">
        <div class="gl-table-row" v-if="item.required!==undefined">
          <div class="gl-table-cell gl-label" style="width: 4em">必填</div>
          <div class="gl-table-cell">
            <a-switch v-model="item.required"></a-switch>
            <a-input v-model="item.message"/>
          </div>
        </div>
      </template>
    </div>
    <div>
      <GlArrayBaseSetter v-slot:default="slotProps" v-model="items" :addAble="false" @addItem="update"
                         @removeItem="removeRule">
        <div style="margin-bottom: 4px">
          <span>{{ items[slotProps.index].label }}</span>
          <component v-if="items[slotProps.index].showSetter!==false" size="small"
                     :is="items[slotProps.index].setter"
                     v-model="items[slotProps.index].value"
                     v-bind="items[slotProps.index].props"
          >
            <template #prefix>
              <span title="验证比较的值">比值</span>
            </template>
          </component>
          <div style="margin-top: 8px">
            <a-input size="small" v-model="items[slotProps.index].message" placeholder="验证失败时的提示信息">
              <template #prepend>
                <span title="验证失败时的提示信息">提醒</span>
              </template>
            </a-input>
          </div>
        </div>
      </GlArrayBaseSetter>
      <a-divider>添加规则</a-divider>
      <a-select v-model="selectedRule">
        <a-option v-for="ruleOption in ruleOptions" :value="ruleOption" :label="ruleOption.label"/>
      </a-select>
    </div>
  </div>
</template>

<style scoped>

</style>
