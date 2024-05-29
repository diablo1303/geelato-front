import {computed} from "vue";
import type {SelectOptionData} from "@arco-design/web-vue";

const packageSourceOptions = computed<SelectOptionData[]>(() => [
  {label: '当前环境打包', value: 'current environment packet', other: '打包'},
  {label: "版本仓库下载", value: 'version repository download', other: '仓库'},
  {label: "版本包上传", value: 'version pack upload', other: '上传'},
]);

const getPackageSourceMark = (packageSource: string) => {
  const packageSourceMark = packageSourceOptions.value.find((item) => item.value === packageSource);
  return packageSourceMark?.other || '其他';
};

export {packageSourceOptions, getPackageSourceMark};