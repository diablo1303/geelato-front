import {computed} from 'vue';
import type {SelectOptionData} from "@arco-design/web-vue";

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '启用', value: 1,},
  {label: "禁用", value: 0,},
]);

const approvalNeedOptions = computed<SelectOptionData[]>(() => [
  {label: '是', value: true,},
  {label: '否', value: false,},
]);

const approvalStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '待审批', value: 'draft', other: {'color': 'rgb(22,93,255)'}},
  {label: '审批', value: 'verify', other: {'color': 'rgb(255,125,0)'}},
  {label: '同意', value: 'agree', other: {'color': 'rgb(0,180,42)'}},
  {label: '拒绝', value: 'reject', other: {'color': 'rgb(245,63,63)'}},
]);

export {enableStatusOptions, approvalNeedOptions, approvalStatusOptions};