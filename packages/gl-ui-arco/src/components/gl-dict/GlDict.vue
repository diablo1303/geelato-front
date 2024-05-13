<script lang="ts">
export default {
  name: 'GlDict'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import {inject, onUnmounted, type Ref, ref, watch} from 'vue'
import {entityApi, mixins, PageProvideKey, type PageProvideProxy, useLogger} from '@geelato/gl-ui'

const logger = useLogger('GlDict')
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
  /**
   *  在label中，同时展示值
   */
  showValueInLabel: Boolean,
  /**
   * 在label中，同时展示描述信息
   */
  showRemarkInLabel: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  ...mixins.props
})

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
// console.log('props.modelValue', props.modelValue, props.dictId)
const mv = ref(props.modelValue)
let selectedOption: Ref<OptionType | undefined> = ref({ value: '', label: '' })
const isRead = pageProvideProxy?.isPageStatusRead() || props.disabled || props.readonly

// 设计时才需要在切换字典展示类型
if(!props.glIsRuntime){
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
}

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
  try{
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
  }catch (e) {
    logger.error('基于字典值回填组件值时失败',e)
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

/**
 *  最多加载2000条字典项
 */
const loadData = () => {
  if (props.dictId) {
    entityApi
      .query(
        'platform_dict_item',
        'id,enableStatus,itemCode value,itemName label' + (props.showRemarkInLabel ? ',itemRemark remark' : ''),
        {
          dictId: props.dictId,
          // enableStatus: 1,
          delStatus: 0,
          '@p': '1,2000',
          '@order': 'seqNo|' + props.dictAscOrDesc
        }
      )
      .then((resp: any) => {
        options.value = resp.data
        callBackToSetValue()
      })
  }
}

/**
 *  注意，需在onOptionChange之后调用
 */
const getSelectedOption = () => {
  return selectedOption.value
}

/**
 * 将备注、名称展示在下拉项中
 * @param option
 */
const getLabel = (option: Record<string, any>) => {
  return (
    option.label +
    (props.showValueInLabel ? '(' + option.value + ')' : '') +
    (props.showRemarkInLabel && option.remark
      ? '(' +
        (option.remark.length > 8 ? option.remark.substring(0, 8) + '...' : option.remark) +
        ')'
      : '')
  )
}

// 设计时才需要在切换字典时重新加载数据
if(!props.glIsRuntime){
  watch(
      () => {
        return props.dictId
      },
      () => {
        loadData()
      }
  )
}
// 初始加载数据
loadData()
defineExpose({ getSelectedOption })

</script>

<template>
  <div class="gl-dict">
    <template v-if="displayType === 'select'">
      <!--  下拉时，在只读状态才需要展示为文本  -->
      <template v-if="glIsRuntime&&isRead">{{ selectedOption?.label||'无' }}</template>
      <template v-else>
        <a-select
          placeholder="请选择"
          v-model="mv"
          allow-clear
          allow-search
          @clear="onClear"
          :disabled="disabled || readonly"
          :readonly="readonly"
        >
          <a-option v-for="opt in options" :value="opt.value" :disabled="opt.enableStatus=='0'">
            {{ getLabel(opt) }}
          </a-option>
        </a-select>
      </template>
    </template>
    <template v-else-if="displayType === 'checkbox'">
      <template v-if="options && options.length === 0">
        <div>{{ dictId ? '【暂无数据】' : '【未配置字典】' }}</div>
      </template>
      <a-checkbox-group v-model="mv" :max="maxCount" :disabled="disabled" :readonly="readonly">
        <a-checkbox v-for="opt in options" :value="opt.value" :disabled="opt.enableStatus=='0'">
          {{ getLabel(opt) }}
        </a-checkbox>
      </a-checkbox-group>
    </template>
    <template v-else>
      <template v-if="options && options.length === 0">
        <div>{{ dictId ? '【暂无数据】' : '【未配置字典】' }}</div>
      </template>
      <a-radio-group v-model="mv" :disabled="disabled" :readonly="readonly">
        <a-radio v-for="opt in options" :value="opt.value" :disabled="opt.enableStatus=='0'">
          {{ getLabel(opt) }}
        </a-radio>
      </a-radio-group>
    </template>
  </div>
</template>
