<script lang="ts">
/**
 *  图片的展示及上传
 *  依赖上传组件
 */
export default {
  name: 'GlImage'
}
</script>
<script lang="ts" setup>
import {computed, inject, type Ref, ref, watch} from 'vue'
import {
  type AttachmentForm,
  entityApi,
  fileApi,
  PageProvideKey,
  type PageProvideProxy,
  type UploadFileParams,
  useGlobal
} from '@geelato/gl-ui'
import type {FileItem} from '@arco-design/web-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  srcType: String,
  width: [String, Number],
  height: [String, Number],
  defaultStyle: {
    type: Object,
    default() {
      return {
        'min-width': '1em',
        'min-height': '1em'
      }
    }
  },
  tableType: String,
  objectId: String,
  genre: String,
  readonly: Boolean
})

const global = useGlobal()
const emits = defineEmits(['update:modelValue'])
const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const isPageRead = ref(pageProvideProxy?.isPageStatusRead())
const isRead = computed(() => {
  return isPageRead.value || props.readonly === true
})

const generateUploadParams = (): UploadFileParams => {
  return {
    tableType: props.tableType || '',// 类型
    isRename: true,// 文件重命名，默认：true
    objectId: props.objectId || '',// 文件所属对象id
    genre: props.genre || '',// 类型
    appId: global.$gl.app.id || '',// 所属应用
    tenantCode: global.$gl.app.tenantCode || '',// 所属租户
  }
};
const actionUrl = ref<string>(fileApi.getUploadUrl(generateUploadParams()));// 上传的url

const mv = ref(props.modelValue)
const isIDMode = ref(props.srcType === 'ID')
const isBase64Mode = ref(props.srcType === 'Base64')
const src = computed(() => {
  mv.value = props.modelValue
  isIDMode.value = props.srcType === 'ID' || !props.srcType
  isBase64Mode.value = props.srcType === 'Base64'
  if (isIDMode.value) {
    return mv.value ? fileApi.getDownloadUrlById(mv.value) : ''
  } else if (isBase64Mode.value) {
    mv.value = mv.value || fileBase64.value
    return mv.value
  }
})

watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const fileList: Ref<FileItem[]> = ref([])
const fileId = ref('')
const fileBase64 = ref('')

const setFileItem = (fileItem?: FileItem) => {
  if (fileItem) {
    fileList.value = [fileItem]
    fileId.value = fileItem.uid

    switch (props.srcType) {
      case 'ID':
        mv.value = fileId.value
        break
      case 'Base64':
        mv.value = fileBase64.value
        break
      default:
        mv.value = fileId.value
    }
  } else {
    fileList.value = []
    fileId.value = ''
    fileBase64.value = ''
  }
}

/**
 * 在删除前端文件数据之前，先删除后端相应的文件
 * @param fileItem
 */
const beforeRemove = (fileItem: FileItem): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fileApi
        .deleteAttachment(fileItem.uid)
        .then(() => {
          setFileItem()
          global.$notification.success('删除成功')
          resolve(true)
        })
        .catch((e) => {
          global.$notification.success('删除失败')
          console.error('删除失败', e)
          reject(false)
        })
  })
}

const uploadError = (fileItem: FileItem) => {
  console.error('上传失败', fileItem)
  global.$notification.error('上传失败，请重试！')
}

const uploadSuccess = (fileItem: FileItem) => {
  fileItem.uid = fileItem.response.data.id
  setFileItem(fileItem)
  const reader = new FileReader()
  reader.readAsDataURL(fileItem.file!)
  reader.onload = () => {
    // @ts-ignore
    fileBase64.value = reader.result
    if (isIDMode.value) {
      mv.value = fileId.value
    } else if (isBase64Mode.value) {
      mv.value = fileBase64.value
    }
    console.log('uploadSuccess fileItem', fileItem)
    global.$notification.success('上传成功')
  }
}

/**
 *  依据文件ids，从服务端加载文件
 */
const loadFiles = () => {
  // mv.value like id1,id2,id3,id4...
  if (!isIDMode.value || !fileId.value) return
  fileApi.getAttachments(fileId.value).then((value) => {
    const attaches = value.data as unknown as AttachmentForm[];
    if (attaches && attaches.length > 0) {
      setFileItem({
        uid: attaches[0].id,
        name: attaches[0].name,
        url: fileApi.getDownloadUrlById(attaches[0].id)
      })
    }
  })
}

// 初始化，加载文件
watch(() => props, () => {
  actionUrl.value = fileApi.getUploadUrl(generateUploadParams());
}, {deep: true, immediate: true});
</script>

<template>
  <a-space>
    <a-image
        v-if="!(fileId && fileBase64)"
        class="gl-image"
        :style="defaultStyle"
        :width="width"
        :height="height"
        :src="src"
    >
    </a-image>
    <a-upload
        v-if="!isRead"
        list-type="picture-card"
        accept="image/*"
        :limit="1"
        image-preview
        :file-list="fileList"
        :action="actionUrl"
        :headers="entityApi.getHeader()"
        @error="uploadError"
        @success="uploadSuccess"
        @before-remove="beforeRemove"
        title="上传替换"
    >
    </a-upload>
  </a-space>
</template>

<style scoped></style>
