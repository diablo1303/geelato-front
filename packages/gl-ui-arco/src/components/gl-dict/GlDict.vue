<script lang="ts">
export default {
  name: 'GlDict'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import {ref, watch} from "vue";
import {entityApi} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue'])
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
  }
})
// console.log('props.modelValue', props.modelValue, props.dictId)
const mv = ref(props.modelValue)
watch(() => {
  return props.displayType
}, (val) => {
  if (val === 'checkbox') {
    mv.value = []
  } else {
    mv.value = undefined
  }
})
watch(() => {
  return props.modelValue
}, () => {
  mv.value = props.modelValue
}, {deep: true})

watch(mv, () => {
  emits('update:modelValue', mv.value)
}, {deep: true})

const onClear = () => {
  mv.value = undefined
}

let options = ref<Array<{ itemCode: string, itemName: string }>>([])

const loadData = () => {
  // TODO 增加多租户支持
  if (props.dictId) {
    entityApi.query('platform_dict_item', 'id,itemCode,itemName', {
      dictId: props.dictId,
      enableStatus: 1,
      delStatus: 0,
      '@order': 'seqNo|' + props.dictAscOrDesc
    }).then((resp: any) => {
      options.value = resp.data.data
    })
  }
}

watch(() => {
  return props.dictId
}, () => {
  loadData()
}, {immediate: true})

</script>

<template>
  <template v-if="displayType==='select'">
    <a-select placeholder="请选择" v-model="mv" allow-clear allow-search @clear="onClear">
      <a-option v-for="opt in options" :value="opt.itemCode">
        {{ opt.itemName + (showValueInLabel ? '(' + opt.itemCode + ')' : '') }}
      </a-option>
    </a-select>
  </template>
  <template v-else-if="displayType==='checkbox'">
    <template v-if="options&&options.length===0">
      <div>{{ dictId ? '【暂无数据】' : '【未配置字典】' }}</div>
    </template>
    <a-checkbox-group v-model="mv" :max="maxCount">
      <a-checkbox v-for="opt in options" :value="opt.itemCode">
        {{ opt.itemName + (showValueInLabel ? '(' + opt.itemCode + ')' : '') }}
      </a-checkbox>
    </a-checkbox-group>
  </template>
  <template v-else>
    <template v-if="options&&options.length===0">
      <div>{{ dictId ? '【暂无数据】' : '【未配置字典】' }}</div>
    </template>
    <a-radio-group v-model="mv">
      <a-radio v-for="opt in options" :value="opt.itemCode">
        {{ opt.itemName + (showValueInLabel ? '(' + opt.itemCode + ')' : '') }}
      </a-radio>
    </a-radio-group>
  </template>

</template>

<style scoped>

</style>
