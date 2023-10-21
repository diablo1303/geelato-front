<script lang="ts">
export default {
  name: 'GlImport'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
  <div>
    <div><a-upload draggable action="/" /></div>
    <div>
      为了保证数据导入顺利，推荐您下载使用<a>导入模版</a>，并按照规范示例录入数据。
    </div>
    <div>
      上传的 Excel 表符合以下规范:

      • 文件大小不超过10M，且单个sheet页数据量不超过5000行。当触发校验规则、关联业务规则和第三方服务回调时，单个sheet页数据量不超过 5000 行

      • 仅支持 (*.xls 和 *.xlsx)文件

      • 请确保您需要导入的sheet表头中不包含空的单元格，否则该sheet页数据系统将不做导入

      • 批量导入的数据不支持以“内置变量”作为条件的过滤

      • 导入文件不支持Excel公式计算，如SUM，=H2*J2等

      • 目前导入图片/附件会转存，占用一定附件容量
    </div>
  </div>
</template>

<style scoped>

</style>
