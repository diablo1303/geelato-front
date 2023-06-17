<script lang="ts">
export default {
  name: 'GlDict'
}
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {entityApi} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
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
  displayType: {
    type: String,
    default() {
      return 'radio'
    }
  },
  showValueInLabel: {
    type: Boolean,
    default() {
      return false
    }
  }
})

const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

let options = ref<Array<{ itemCode: string, itemText: string }>>([])

const loadData = () => {
  // TODO 增加多租户支持
  if (props.dictId) {
    entityApi.query('platform_dict_item', 'id,itemCode,itemText', {
      dictId: props.dictId,
      enableStatus: 1,
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
    <a-select placeholder="请选择" v-model="mv" allow-clear @clear="mv=''">
      <a-option v-for="opt in options" :value="opt.itemCode">
        {{ opt.itemText + (showValueInLabel ? '(' + opt.itemCode + ')' : '') }}
      </a-option>
    </a-select>
  </template>
  <template v-else>
    <template v-if="options&&options.length===0">
      <div>{{dictId?'暂无数据':'未配置字典名'}}</div>
    </template>
    <a-radio-group v-model="mv">
      <a-radio v-for="opt in options" :value="opt.itemCode">{{ opt.itemText + (showValueInLabel ? '(' + opt.itemCode + ')' : '') }}</a-radio>
    </a-radio-group>
  </template>

</template>

<style scoped>

</style>
