<script lang="ts">
export default {
  name: 'GlDict'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import { inject, type Ref, ref, watch } from 'vue'
import { entityApi, mixins, PageProvideKey, type PageProvideProxy } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue', 'onOptionChange'])
type OptionType = { value: string; label: string }
const props = defineProps({
  modelValue: {
    type: [String, Number, Array<String | Number>],
    default() {
      return undefined
    }
  },
  /**
   *  数据字典名称，即数据选择集名称
   */
  dictId: {
    type: String
  },
  /**
   *  选择的名称绑定的组件id
   *  在选择字典时，同时将名称值绑定到另一个组件中，如果不设置，则不需绑定
   *  可以有多个id，多个id之间用“,”分隔
   */
  nameFieldBindComponentId: {
    type: String,
    default() {
      return ''
    }
  },
  valueFieldBindComponentId: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   * 升序降序
   */
  dictAscOrDesc: {
    type: String,
    default() {
      return '+'
    }
  },
  /**
   *  下拉单选select|展开单选radio|展开复选checkbox
   */
  displayType: {
    type: String,
    default() {
      return 'radio'
    }
  },
  /**
   * 可以选择的最大项数，displayType为checkbox才有效
   */
  maxCount: {
    type: Number,
    default() {
      return 1000
    }
  },
  showValueInLabel: {
    type: Boolean,
    default() {
      return false
    }
  },
  disabled: Boolean,
  readonly: Boolean,
  ...mixins.props
})

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
// console.log('props.modelValue', props.modelValue, props.dictId)
const mv = ref(props.modelValue)
let selectedOption: Ref<OptionType | undefined> = ref({ value: '', label: '' })
watch(
  () => {
    return props.displayType
  },
  (val) => {
    if (val === 'checkbox') {
      mv.value = []
    } else {
      mv.value = undefined
    }
  }
)
watch(
  () => {
    return props.modelValue
  },
  () => {
    mv.value = props.modelValue
  },
  { deep: true }
)

let options: Ref<Array<OptionType>> = ref([])

const callBackToSetValue = () => {
  // 下拉列表还没有加载完成之前不执行
  if (options.value.length === 0) return
  // 回写名称
  const foundOption = options.value.find((option: OptionType) => {
    return option.value === mv.value
  })
  const label = foundOption?.label || ''
  if (props.nameFieldBindComponentId) {
    const ids = props.nameFieldBindComponentId.split(',')
    ids.forEach((id: string) => {
      pageProvideProxy.setComponentValue(id, label)
    })
  }
  // 回写值
  if (props.valueFieldBindComponentId) {
    const ids = props.valueFieldBindComponentId.split(',')
    ids.forEach((id: string) => {
      pageProvideProxy.setComponentValue(id, mv.value)
    })
  }
  selectedOption.value = foundOption
  emits('onOptionChange', selectedOption.value)
}

watch(
  mv,
  () => {
    callBackToSetValue()
    emits('update:modelValue', mv.value)
  },
  { deep: true }
)

const onClear = () => {
  mv.value = undefined
}

const loadData = () => {
  // TODO 增加多租户支持
  if (props.dictId) {
    entityApi
      .query('platform_dict_item', 'id,itemCode value,itemName label', {
        dictId: props.dictId,
        enableStatus: 1,
        delStatus: 0,
        '@p': '1,2000',
        '@order': 'seqNo|' + props.dictAscOrDesc
      })
      .then((resp: any) => {
        options.value = resp.data
        callBackToSetValue()
      })
  }
}

watch(
  () => {
    return props.dictId
  },
  () => {
    loadData()
  },
  { immediate: true }
)
/**
 *  注意，需在onOptionChange之后调用
 */
const getSelectedOption = () => {
  return selectedOption.value
}

defineExpose({ getSelectedOption })
</script>

<template>
  <div class="gl-dict">
    <template v-if="displayType === 'select'">
      <a-select
        placeholder="请选择"
        v-model="mv"
        allow-clear
        allow-search
        @clear="onClear"
        :disabled="disabled || readonly"
        :readonly="readonly"
      >
        <a-option v-for="opt in options" :value="opt.value">
          {{ opt.label + (showValueInLabel ? '(' + opt.value + ')' : '') }}
        </a-option>
      </a-select>
    </template>
    <template v-else-if="displayType === 'checkbox'">
      <template v-if="options && options.length === 0">
        <div>{{ dictId ? '【暂无数据】' : '【未配置字典】' }}</div>
      </template>
      <a-checkbox-group v-model="mv" :max="maxCount" :disabled="disabled" :readonly="readonly">
        <a-checkbox v-for="opt in options" :value="opt.value">
          {{ opt.label + (showValueInLabel ? '(' + opt.value + ')' : '') }}
        </a-checkbox>
      </a-checkbox-group>
    </template>
    <template v-else>
      <template v-if="options && options.length === 0">
        <div>{{ dictId ? '【暂无数据】' : '【未配置字典】' }}</div>
      </template>
      <a-radio-group v-model="mv" :disabled="disabled" :readonly="readonly">
        <a-radio v-for="opt in options" :value="opt.value">
          {{ opt.label + (showValueInLabel ? '(' + opt.value + ')' : '') }}
        </a-radio>
      </a-radio-group>
    </template>
  </div>
</template>

<style scoped></style>
