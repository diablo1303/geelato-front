import {ref} from "vue";
import {Notification} from "@arco-design/web-vue";

// 允许上传的类型
export const IMAGE_MIME = ref<string[]>([
  'image/pict', 'image/x-pict',
  'image/bmp', 'image/x-bmp',
  'image/ico', 'image/x-icon',
  'image/jpeg', 'image/jpg',
  'image/tiff', 'image/x-tiff',
  'image/xbm', 'image/x-xbm',
  'image/gif',
  'image/png',
  'image/webp',
  'image/svg+xml'
]);

// 裁剪组件需要使用到的参数
export interface CropperOptions {
  img: string | ArrayBuffer | null // 裁剪图片的地址
  info: true // 裁剪框的大小信息
  outputSize: number // 裁剪生成图片的质量 [1至0.1]
  outputType: string // 裁剪生成图片的格式
  canScale: boolean // 图片是否允许滚轮缩放
  autoCrop: boolean // 是否默认生成截图框
  autoCropWidth: number // 默认生成截图框宽度
  autoCropHeight: number // 默认生成截图框高度
  fixedBox: boolean // 固定截图框大小 不允许改变
  fixed: boolean // 是否开启截图框宽高固定比例
  fixedNumber: Array<number> // 截图框的宽高比例  需要配合centerBox一起使用才能生效
  full: boolean // 是否输出原图比例的截图
  canMove: boolean // 能否拖动图片
  canMoveBox: boolean // 截图框能否拖动
  original: boolean // 上传图片按照原始比例渲染
  centerBox: boolean // 截图框是否被限制在图片里面
  infoTrue: boolean // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  accept: string // 上传允许的格式
}

export interface CropperControllerData {
  type: string;
  icon: string;
  title: string;
  enabled: boolean;
}

// 选择单个文件
export const uploadFile = (uploadSuccess?: any) => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = IMAGE_MIME.value.join(',');
  fileInput.onchange = (event) => {
    // @ts-ignore
    const files = event && event.target && event.target.files;
    if (files && files.length > 0) {
      const URL = window.URL || window.webkitURL;
      const fileUrl = URL.createObjectURL(files[0]);
      // 上传图片前置钩子，用于判断限制类型用
      if (IMAGE_MIME.value.includes(files[0].type)) {
        if (typeof (uploadSuccess) === "function") {
          uploadSuccess(files[0], fileUrl);
        }
      } else {
        Notification.warning(`仅支持${IMAGE_MIME.value.join('、')}格式的图片`);
      }
    }
  };
  fileInput.click();
}