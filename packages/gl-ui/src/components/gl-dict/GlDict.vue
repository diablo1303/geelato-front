<script lang="ts" setup>
import {ref, watch} from "vue";
import {entityApi} from "../../m/datasource/EntityApi";

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
  dictGroup: {
    type: String
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

let options = ref([])

const loadData = () => {
  // TODO 增加多租户支持
  entityApi.query('platform_dict', 'id,dicCode,dicName', {dicCode: '', enableStatus: 1}).then((resp: any) => {
    options.value = resp.data.data
  })
}
</script>
<script lang="ts">
export default {
  name: 'GlDict'
}
</script>
<template>
  <a-select placeholder="请选择" v-model="mv" allow-clear>
    <a-option v-for="opt in options" :value="opt.dicCode">{{ opt.dicName }}</a-option>
  </a-select>
</template>

<style scoped>

</style>
