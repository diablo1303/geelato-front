<script lang="ts">
export default {
  name: 'StateWFApprove'
}
</script>
<script lang="ts" setup>
import {inject, type PropType, ref, watch} from 'vue'
import type { ProcTranDef } from './stateWfApi'
import {PageProvideKey, PageProvideProxy} from "@geelato/gl-ui";

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const isRead = !!pageProvideProxy?.isPageStatusRead()

const emits = defineEmits(['update:tran', 'update:remark','update:attachIds'])
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
  remarkLabel: String,
  attachIds: String
})
const form = ref({ tranId: '', remark: '', attachIds: '' })
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
watch(
    () => {
      return form.value.attachIds
    },
    () => {
      emits('update:attachIds', form.value.attachIds)
    }
)
const myForm = ref()
const validate = () => {
  // { values, errors }
  return myForm.value.validate()
}
defineExpose({ validate })
</script>

<template>
  <a-form ref="myForm" :model="form" layout="vertical" :disabled="isRead">
    <a-form-item field="tranId" label="选择操作" :rules="[{ required: true, message: '必填' }]">
      <a-select v-model="form.tranId" placeholder="请选择">
        <a-option v-for="tran in nextTrans" :value="tran.id">{{ tran.name }}</a-option>
      </a-select>
    </a-form-item>
    <a-form-item
      field="remark"
      :label="remarkLabel || '描述'"
      :rules="[{ required: true, message: '必填' }]"
    >
      <a-textarea v-model="form.remark" style="height: 240px" placeholder="申请描述/审批意见" />
      <!--      style="background-color: rgba(145, 203, 253, 0.23)"-->
    </a-form-item>
    <a-form-item field="attachIds" label="附件">
      <gl-upload v-model="form.attachIds" :clipboard="true"></gl-upload>
    </a-form-item>
  </a-form>
</template>
