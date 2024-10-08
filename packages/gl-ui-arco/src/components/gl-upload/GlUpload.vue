<script lang="ts">
export default {
  name: 'GlUpload'
}
</script>
<script lang="ts" setup>
import {inject, type Ref, ref, watch} from 'vue'
import type {FileItem} from '@arco-design/web-vue'
import {Modal, Message} from '@arco-design/web-vue'
import {entityApi, fileApi, PageProvideKey, PageProvideProxy, useGlobal, utils} from '@geelato/gl-ui'
import type {AttachmentForm, UploadFileParams} from '@geelato/gl-ui'
import GlUploadClipboard from './clipboard.vue'

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
  limit: Number,
  tableType: String,
  objectId: String,
  genre: String,
  clipboard: Boolean,
  readonly: Boolean,
  disabled: Boolean
})
const global = useGlobal()
const mv = ref(props.modelValue)
const uploadRef = ref();

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
    if (fileItem.uid.length < 19) {
      let index = -1;
      for (let i = 0; i < fileList.value.length; i++) {
        if (fileItem.uid === fileList.value[i].uid) {
          index = i;
          break;
        }
      }
      if (index > -1) fileList.value.splice(index, 1);
      resolve(true)
    } else {
      fileApi.deleteAttachment(fileItem.uid)
          .then(() => {
            clearLocalFileItem(fileList.value, fileItem.uid)
            Message.success('删除成功')
            resolve(true)
          })
          .catch((e) => {
            Message.error('删除失败')
            reject(false)
          })
    }
  })
}

const uploadError = (fileItem: FileItem) => {
  console.error('上传失败', fileItem)
  Message.error('上传失败，请重试！')
}

const uploadSuccess = (fileItem: FileItem) => {
  fileItem.uid = fileItem.response.data.id
  fileList.value.push(fileItem)
  resetMv()
  Message.success('上传成功')
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
  fileApi.getAttachments(mv.value).then((value) => {
    const attaches = value.data as unknown as AttachmentForm[];
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

const formParams = ref<Record<string, any>>({visible: false, id: ''});

const clipboardSuccess = (fileItem: FileItem) => {
  mv.value = fileItem.uid;
  fileList.value.push(fileItem)
}

const customUploadFile = () => {
  utils.uploadFile().then((result) => {
    const file = result as File;
    uploadRef.value.upload([file]);
    uploadRef.value.submit();
  }, (errorMessage) => {
    Message.error(errorMessage)
  });
}

const buttonClick = async (event: Event, ok?: any, cancel?: any) => {
  const result = await utils.readClipboardImage();
  if (result && result.length > 0) {
    formParams.value.id = result[0]
    formParams.value.visible = true;
  } else {
    customUploadFile();
  }
}

const uploadButtonClick = (event: Event): void | Promise<FileList> => {
  if (props.clipboard) {
    event.stopPropagation();
    return new Promise((resolve, reject) => {
      buttonClick(event);
    });
  }
}

// 初始化，加载文件
watch(() => props, () => {
  actionUrl.value = fileApi.getUploadUrl(generateUploadParams());
}, {deep: true, immediate: true});

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

const isRead = pageProvideProxy?.isPageStatusRead() || props.readonly || props.disabled
</script>

<template>
  <a-upload
      ref="uploadRef"
      :accept="accept"
      :action="actionUrl"
      :disabled="disabled"
      :file-list="fileList"
      :headers="entityApi.getHeader()"
      :limit="limit"
      :on-button-click="uploadButtonClick"
      :readonly="readonly"
      :show-remove-button="!isRead"
      class="gl-upload"
      @error="uploadError"
      @success="uploadSuccess"
      @before-remove="beforeRemove"
  >
  </a-upload>

  <GlUploadClipboard v-if="formParams.visible"
                     v-model:visible="formParams.visible"
                     :action="actionUrl"
                     :model-value="formParams.id"
                     @cancel="customUploadFile"
                     @success="clipboardSuccess"/>
</template>
