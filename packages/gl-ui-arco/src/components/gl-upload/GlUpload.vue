<script lang="ts">
export default {
  name: 'GlUpload'
}
</script>
<script lang="ts" setup>
import {inject, type Ref, ref, watch} from 'vue'
import type {FileItem} from '@arco-design/web-vue'
import {Notification} from '@arco-design/web-vue'
import {entityApi, fileApi, PageProvideKey, PageProvideProxy} from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  /**
   *  文件ids，如：id1,id2,id3,id4...
   */
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  acceptArray: Array,
  readonly: Boolean,
  disabled: Boolean
})
const mv = ref(props.modelValue)

watch(mv, () => {
  emits('update:modelValue', mv.value)
})
// console.log('GlUpload props.modelValue:', props.modelValue)
// 转成字符串格式，并去掉空项
const accept = ref(
    props.acceptArray &&
    JSON.stringify(
        props.acceptArray?.filter((acceptItem) => {
          return !acceptItem
        }) || []
    )
)

const fileList: Ref<FileItem[]> = ref([])

/**
 * 从前端中清除指定的文件
 * @param fileList
 * @param delUid
 */
const clearLocalFileItem = (fileList: FileItem[], delUid: string) => {
  if (fileList && fileList.length > 0) {
    let delIndex = fileList.findIndex((fileItem) => {
      return fileItem.uid === delUid
    })
    if (delIndex > -1) {
      fileList.splice(delIndex, 1)
    }
  }
  resetMv()
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
          clearLocalFileItem(fileList.value, fileItem.uid)
          Notification.success('删除成功')
          resolve(true)
        })
        .catch((e) => {
          Notification.success('删除失败')
          console.error('删除失败', e)
          reject(false)
        })
  })
}

const uploadError = (fileItem: FileItem) => {
  console.error('上传失败', fileItem)
  Notification.error('上传失败，请重试！')
}

const uploadSuccess = (fileItem: FileItem) => {
  fileItem.uid = fileItem.response.data.id
  fileList.value.push(fileItem)
  resetMv()
  Notification.success('上传成功')
}

const resetMv = () => {
  if (fileList.value && fileList.value.length > 0) {
    const ids: string[] = []
    fileList.value.forEach((fileItem) => {
      ids.push(fileItem.uid)
    })
    mv.value = ids.join(',')
  } else {
    mv.value = ''
  }
}

/**
 *  依据文件ids，从服务端加载文件
 */
const loadFiles = () => {
  // mv.value like id1,id2,id3,id4...
  if (!mv.value) return
  // console.log('loadFiles() > mv.value:', mv.value)
  fileApi.getAttachmentByIds(mv.value).then((value) => {
    const attaches = value.data
    if (attaches && attaches.length > 0) {
      attaches.forEach((value, index, array) => {
        if (value.delStatus === 0) {
          // 本地已存在的，则不放入
          const foundItem = fileList.value.find((fileItem: FileItem) => {
            return fileItem.uid === value.id
          })
          if (!foundItem) {
            const isPreview = value.type && (value.type.startsWith('image') || value.type === 'application/pdf');
            fileList.value.push({
              uid: value.id,
              name: value.name,
              url: fileApi.getDownloadUrlById(value.id, false, isPreview === true)
            })
          }
        }
      })
    } else if (attaches && attaches.length === 0) {
      fileList.value.length = 0
    }
    resetMv()
    // console.log('getAttachmentByIds() > fileList:', fileList.value)
  })
}

// 初始化，加载文件
watch(
    () => {
      return props.modelValue
    },
    () => {
      mv.value = props.modelValue
      loadFiles()
    },
    {immediate: true}
)

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const isRead = pageProvideProxy.isPageStatusRead() || props.readonly || props.disabled
</script>

<template>
  <a-upload
      class="gl-upload"
      :action="fileApi.getUploadUrl()"
      :file-list="fileList"
      :accept="accept"
      :headers="entityApi.getHeader()"
      :show-remove-button="!isRead"
      :readonly="readonly"
      :disabled="disabled"
      @error="uploadError"
      @success="uploadSuccess"
      @before-remove="beforeRemove"
  >
  </a-upload>
</template>
