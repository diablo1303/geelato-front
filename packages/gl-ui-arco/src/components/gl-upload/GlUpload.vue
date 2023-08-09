<script lang="ts">
export default {
  name: 'GlUpload'
}
</script>
<script lang="ts" setup>

import {onMounted, ref, watch} from "vue";
import type {FileItem} from "@arco-design/web-vue";
import {Notification} from "@arco-design/web-vue";
import {entityApi, fileApi} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  acceptArray: Array
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

// 转成字符串格式，并去掉空项
const accept = ref(props.acceptArray&&JSON.stringify(props.acceptArray?.filter((acceptItem) => {
  return !acceptItem
}) || []))

const fileList = ref<FileItem[]>([]);

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
      fileList.splice(delIndex, 1);
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
    fileApi.deleteAttachment(fileItem.uid).then(() => {
      clearLocalFileItem(fileList.value, fileItem.uid);
      Notification.success("删除成功");
      resolve(true)
    }).catch((e) => {
      Notification.success("删除失败");
      console.error('删除失败', e)
      reject(false)
    })
  })
}

const uploadError = (fileItem: FileItem) => {
  console.error('上传失败', fileItem)
  Notification.error("上传失败，请重试！");
}

const uploadSuccess = (fileItem: FileItem) => {
  fileItem.uid = fileItem.response.data.id;
  fileList.value.push(fileItem)
  console.log('fileList:', fileList)
  resetMv()
  Notification.success("上传成功");
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
  // mv.value like 1,2,3,4...
  if (!mv.value) return
  console.log('loadFiles() > mv.value:', mv.value)
  fileApi.getAttachmentByIds(mv.value).then((value) => {
    const attaches = value.data
    if (attaches && attaches.length > 0) {
      attaches.forEach((value, index, array) => {
        if (value.delStatus === 0) {
          fileList.value.push({
            uid: value.id,
            name: value.name,
            url: fileApi.getDownloadUrlById(value.id)
          });
        }
      });
    } else if (attaches && attaches.length === 0) {
      fileList.value.length = 0
    }
    resetMv()
    console.log('getAttachmentByIds() > fileList:', fileList.value);
  });
}
// 初始化，加载文件
onMounted(() => {
  loadFiles()
})
</script>

<template>
  <a-upload :action="fileApi.getUploadUrl()" :file-list="fileList"
            :accept="accept"
            :headers="entityApi.getHeader()"
            @error="uploadError" @success="uploadSuccess" @before-remove="beforeRemove"/>
</template>

<style scoped>

</style>
