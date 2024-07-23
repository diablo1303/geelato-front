import {computed} from "vue";
import type {SelectOptionData} from "@arco-design/web-vue";

const packageSourceOptions = computed<SelectOptionData[]>(() => [
  {label: '当前环境打包', value: 'packet', other: '打包'},
  {label: "版本仓库下载", value: 'sync', other: '仓库'},
  {label: "版本包上传", value: 'upload', other: '上传'},
]);

const packageStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '未发布', value: 'draft'},
  {label: "已发布", value: 'release'},
  {label: "未使用", value: 'unused'},
  {label: "已使用", value: 'deployed'},
]);

const getPackageSourceMark = (packageSource: string) => {
  const packageSourceMark = packageSourceOptions.value.find((item) => item.value === packageSource);
  return packageSourceMark?.other || '其他';
};

export {packageSourceOptions, packageStatusOptions, getPackageSourceMark};