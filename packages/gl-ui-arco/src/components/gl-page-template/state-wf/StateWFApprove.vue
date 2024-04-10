<script lang="ts">
export default {
  name: 'StateWFApprove'
}
</script>
<script lang="ts" setup>
import { type PropType, ref, watch } from 'vue'
import type {  ProcTranDef } from './stateWfApi'
const emits = defineEmits(['update:tran', 'update:remark'])
const props = defineProps({

  tran: Object as PropType<ProcTranDef>,
  nextTrans: {
    type: Array as PropType<Array<ProcTranDef>>,
    required: true,
    default() {
      return []
    }
  },
  remark: String,
  remarkLabel:String,
})
const form = ref({ tranId: '', remark: '' })
// 默认选择第一个
watch(
  () => {
    return props.nextTrans
  },
  () => {
    form.value.tranId = props.nextTrans?.length > 0 ? props.nextTrans[0].id : ''
  },
  { deep: true, immediate: true }
)

watch(
  () => {
    return form.value.tranId
  },
  (val) => {
    const newTran = props.nextTrans.find((tran: ProcTranDef) => {
      return tran.id === val
    })
    emits('update:tran', newTran)
  }
)
watch(
  () => {
    return form.value.remark
  },
  () => {
    emits('update:remark', form.value.remark)
  }
)
const myForm = ref()
const validate = () => {
  // { values, errors }
  return myForm.value.validate()
}
defineExpose({validate})
</script>

<template>
  <a-form ref="myForm" :model="form">
    <a-form-item field="tranId" label="选择步骤" :rules="[{ required: true, message: '必填' }]">
      <a-radio-group v-model="form.tranId">
        <a-radio v-for="tran in nextTrans" :value="tran.id">{{ tran.name }}</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item field="remark" :label="remarkLabel||'描述'" :rules="[{ required: true, message: '必填' }]">
      <a-textarea
        v-model="form.remark"
        placeholder="申请描述/审批意见"
      />
<!--      style="background-color: rgba(145, 203, 253, 0.23)"-->
    </a-form-item>
  </a-form>
</template>

<style scoped></style>
