<template>
  <a-modal v-model:visible="visible"
           :title="$t('account.user.cropper.modal.title')"
           title-align="start"
           width="600px"
           @cancel="cancelModalClick($event)">
    <a-layout class="vue-cropper-layout">
      <a-layout>
        <a-layout-content>
          <vueCropper
              ref="cropperRef"
              :auto-crop="options.autoCrop"
              :can-move="options.canMove"
              :can-move-box="options.canMoveBox"
              :can-scale="options.canScale"
              :center-box="options.centerBox"
              :fixed="options.fixed"
              :fixed-box="options.fixedBox"
              :fixed-number="[1, 1]"
              :full="options.full"
              :img="options.img"
              :info="true"
              :info-true="options.infoTrue"
              @real-time="previewHandle"/>
        </a-layout-content>
        <a-layout-sider :width="150" class="vue-cropper-sider">
          <div class="vue-cropper-preview">
            <div :style="previewFileStyle" class="vue-cropper-preview-round">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
          <div class="vue-cropper-preview">
            <div :style="previewFileStyle" class="vue-cropper-preview-block">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
          <div> {{ $t('account.user.cropper.preview.title') }}</div>
        </a-layout-sider>
      </a-layout>
      <a-layout-footer>
        <a-space class="vue-cropper-footer">
          <a-button v-for="item in cropperConData"
                    v-show="item.enabled"
                    :key="item.type"
                    class="vue-cropper-footer-button"
                    size="mini"
                    type="outline"
                    @click="cropperController(item.type)">
            <template #icon>
              <GlIconfont :type="item.icon" class="vue-cropper-footer-icon"/>
            </template>
            {{ $t(item.title) }}
          </a-button>
        </a-space>
      </a-layout-footer>
    </a-layout>
    <template #footer>
      <a-space>
        <a-button type="outline" @click="cancelModalClick($event)">
          {{ $t('account.user.cropper.button.cancel') }}
        </a-button>
        <a-button :loading="buttonLoading" type="primary" @click="okModalClick($event)">
          {{ $t('account.user.cropper.button.ok') }}
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useUserStore} from "@/store";
import 'vue-cropper/dist/index.css'
import {VueCropper} from "vue-cropper";
import {CropperControllerData, CropperOptions, IMAGE_MIME, uploadFile} from "@/components/vue-cropper/type";
import {uploadAvatar} from "@/api/user";

const props = defineProps({modelValue: {type: Boolean, default: false}, imgSrc: {type: String, default: ''}});
const emits = defineEmits(['update:modelValue', 'completeEvent']);
const {t} = useI18n();
const userStore = useUserStore();
const visible = ref(false);
const buttonLoading = ref(false);
// 裁剪组件Ref
const cropperRef: any = ref({});
// 裁剪组件需要使用到的参数
const options = reactive<CropperOptions>({
  img: '', // 需要剪裁的图片
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 150, // 默认生成截图框的宽度
  autoCropHeight: 150, // 默认生成截图框的长度
  fixedBox: false, // 是否固定截图框的大小 不允许改变
  info: true, // 裁剪框的大小信息
  outputSize: 1, // 裁剪生成图片的质量 [1至0.1]
  outputType: 'png', // 裁剪生成图片的格式
  canScale: true, // 图片是否允许滚轮缩放
  fixed: true, // 是否开启截图框宽高固定比例
  fixedNumber: [1, 1], // 截图框的宽高比例 需要配合centerBox一起使用才能生效 1比1
  full: true, // 是否输出原图比例的截图
  canMove: true, // 截图框能否拖动
  canMoveBox: false, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  accept: IMAGE_MIME.value.join(',')
});
// 裁剪后的预览样式信息
const previews: any = ref({});
const previewFileStyle = ref({});

const previewHandle = (data: any) => {
  previews.value = data // 预览img图片
  previewFileStyle.value = {width: `${data.w}px`, height: `${data.h}px`, zoom: 120 / data.w}
}

const cropperConData = ref<CropperControllerData[]>([
  {type: 'upload', icon: 'gl-upload', title: 'account.user.cropper.button.upload', enabled: true},
  {type: 'refresh', icon: 'gl-reset', title: 'account.user.cropper.button.refresh', enabled: true},
  {type: 'scaleUp', icon: 'gl-plus-square', title: 'account.user.cropper.button.scaleUp', enabled: true},
  {type: 'scaleDown', icon: 'gl-minus-square', title: 'account.user.cropper.button.scaleDown', enabled: true},
  {type: 'rotateLeft', icon: 'gl-undo', title: 'account.user.cropper.button.rotateLeft', enabled: true},
  {type: 'rotateRight', icon: 'gl-redo', title: 'account.user.cropper.button.rotateRight', enabled: true},
]);
const cropperController = (type: string) => {
  switch (type) {
    case 'upload':
      uploadFile((file: File, url: string) => {
        options.img = url;
      });
      break;
    case 'refresh':
      cropperRef.value.refresh();
      break;
    case 'rotateRight':
      cropperRef.value.rotateRight();
      break;
    case 'rotateLeft':
      cropperRef.value.rotateLeft();
      break;
    case 'scaleUp':
      cropperRef.value.changeScale(1);
      break;
    case 'scaleDown':
      cropperRef.value.changeScale(-1);
      break;
    default:
      break;
  }
}

/**
 * base64转图片文件
 * @param dataUrl
 * @param filename
 */
const dataURLtoFile = (dataUrl: string, filename: string) => {
  const arr = dataUrl.split(',');
  // @ts-ignore
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1])
  let len = bstr.length
  const u8arr = new Uint8Array(len)
  // eslint-disable-next-line no-plusplus
  while (len--) {
    u8arr[len] = bstr.charCodeAt(len)
  }
  return new File([u8arr], filename, {type: mime})
}

const cancelModalClick = (ev?: MouseEvent) => {
  emits('update:modelValue', false);
}

const okModalClick = async (ev?: MouseEvent) => {
  cropperRef.value.getCropData(async (data: string) => {
    buttonLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', dataURLtoFile(data, 'images.png'));
      await uploadAvatar(userStore.userInfo.id as string, formData);
      emits('update:modelValue', false);
      emits('completeEvent');
    } catch (err) {
      console.log(err);
    } finally {
      buttonLoading.value = false;
    }
  });
}

watch(
  () => props.modelValue,
  (newValue) => {
    visible.value = newValue;
  }
)
watch(
  () => props.imgSrc,
  (newValue) => {
    options.img = newValue;
  }
)
</script>
<script lang="ts">
export default {
  name: 'VueCropping',
};
</script>

<style lang="less" scoped>
.vue-cropper {
  &-layout {
    height: 360px;
  }

  &-sider {
    text-align: center;
    box-shadow: none;
  }

  &-preview {
    width: 120px;
    height: 120px;
    margin-left: 15px;
    margin-bottom: 15px;
  }

  &-preview-block {
    margin: 0;
    overflow: hidden;
    position: relative;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
  }

  &-preview-round {
    margin: 0;
    overflow: hidden;
    position: relative;
    border: 1px solid #e8e8e8;
    border-radius: 1000px;
  }

  &-footer {
    margin-top: 15px;
  }

  &-footer-button {
    border-radius: 6px;
  }

  &-footer-icon {
    font-size: 14px;
  }
}
</style>