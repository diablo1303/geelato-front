<script lang="ts">
export default {
  name: 'GlImport'
}
</script>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { fileApi, useGlobal } from '@geelato/gl-ui'
import { template } from 'lodash'

const global = useGlobal()
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  templateId: {
    type: String,
    required: true
  },
  importType: String
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
const fileId = ref('')
const uploadProps = {
  label: '上传',
  hideLabel: true,
  bindField: {
    appCode: '',
    entityName: 'platform_file',
    fieldName: 'id'
  },
  acceptArray: ['.pdf,.doc,.docx,xls,xlsx'],
  limit: 1,
  draggable: true,
  showFileList: true,
  showRemoveButton: true
}

const downloadTemplate = () => {
  if (!props.templateId) {
    global.$notification.error({ content: '未配置模板ID（templateId），无法下载' })
    return
  }
  fileApi.downloadImportTemplateFile(props.templateId)
}

/**
 *  基于已上传的文件，执行导入操作
 */
const importFile = () => {
  // 检查是否已上传
  if (!fileId.value) {
    global.$notification.error({ content: '请先上传需导入的文件' })
    return
  }
  if (!props.templateId) {
    global.$notification.error({ content: '未配置上传文件对应的模板ID（templateId）' })
    return
  }
  let result = null
  // 目前暂只支持导入Excel
  try {
    result = fileApi.importFile(props.templateId, fileId.value, props.importType)
  } catch (e) {
    console.log('e', e, result)
  }
  return result
}

defineExpose({
  importFile,
  getFileId: () => {
    return fileId.value
  }
})
</script>

<template>
  <div>
    <div>
      <GlUpload v-model="fileId" v-bind="uploadProps">
        <template #upload-button>
          <div
            style="
              background-color: var(--color-fill-2);
              color: var(--color-text-1);
              border: 1px dashed var(--color-fill-4);
              height: 100px;
              width: 100%;
              line-height: 100px;
              text-align: center;
            "
          >
            <div>
              <GlIconfont type="gl-upload"></GlIconfont>
              <span style="color: #3370ff; margin-left: 1em">先点击上传文件，再点击右下角的【导入】</span>
            </div>
          </div>
        </template>
      </GlUpload>
    </div>
    <div>
      <p></p>
      <div>
        为了保证数据导入顺利，推荐您下载使用<a
          @click="downloadTemplate"
          style="color: royalblue; cursor: pointer; font-weight: bold"
          title="下载导入模板"
          >导入模版</a
        >，并按照规范示例录入数据。
      </div>
      <ul>
        上传的 Excel 表符合以下规范:
      </ul>
      <ul>
        <li>文件大小不超过10M，且单个sheet页数据量不超过5000行。</li>
        <li>仅支持 (*.xls 和 *.xlsx)文件</li>
        <li>请确保您需要导入的sheet表头中不包含空的单元格</li>
        <li>导入文件不支持Excel公式计算，如SUM，=H2*J2等</li>
      </ul>
    </div>
  </div>
</template>
