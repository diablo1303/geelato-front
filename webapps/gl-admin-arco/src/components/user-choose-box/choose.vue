<script lang="ts">
export default {
  name: 'UserSelect'
}
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import {QueryOrgForm, QueryUserForm} from "@/api/security";
import OrgTree from "../org-choose-box/tree.vue";
import UserList from "./list.vue";

type QueryForm = QueryUserForm;
type PageParams = { appId?: string; tenantCode?: string; }

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<QueryForm>, default: []},
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  visible: {type: Boolean, default: false},// 控制弹窗隐显
  disabled: {type: Boolean, default: false},// 是否禁用
  maxCount: {type: Number, default: 0},// 取值数量
  height: {type: Number, default: 420}
});

// 标签的滚动条
const scrollbar = ref({height: '406px', overflow: 'auto'});
// 标签数据
const rightData = ref<QueryForm[]>([]);
// 选中数据
const selectedKeys = ref<Array<string | number>>([]);
// 组织id
const selectedOrgIds = ref<string>('');

/**
 * 删除选中的数据
 * @param data
 */
const deleteClick = (data: QueryForm) => {
  rightData.value = rightData.value.filter(item => item.id !== data.id);
}
/**
 * 选中添加、取消移除
 * @param isSelected
 * @param data
 */
const selectChange = (isSelected: boolean, data: QueryOrgForm) => {
  selectedOrgIds.value = data && data.id || '';
}

/**
 * 数组添加，去重
 * @param source
 * @param target
 */
const arrayDataToData = (source: QueryUserForm[], target: QueryUserForm[]) => {
  const ids: string[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of source) {
    if (!ids.includes(item.id)) {
      ids.push(item.id);
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const form of target) {
    if (!ids.includes(form.id)) {
      source.push(form);
      ids.push(form.id);
    }
  }
}
/**
 * 选择添加，取消删除
 * @param isSelected
 * @param data
 */
const userChooseChange = (isSelected: boolean, data: QueryUserForm[]) => {
  if (props.maxCount !== 1) {
    if (data && data.length > 0) {
      if (isSelected) {
        arrayDataToData(rightData.value, data);
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const form of data) {
          rightData.value = rightData.value.filter(item => item.id !== form.id);
        }
      }
    }
  } else {
    rightData.value = data;
  }
}

/**
 * 输入数据
 */
watch(() => props.modelValue, () => {
  rightData.value = props.modelValue;
}, {deep: true, immediate: true});
/**
 * 高度调整
 */
watch(() => props.height, () => {
  scrollbar.value.height = `${props.height - 14}px`;
}, {immediate: true});
/**
 * 标签变更
 * 1，选中值的变化
 * 2，更新待输出值
 */
watch(() => rightData, () => {
  const ids: string[] = [];
  if (rightData.value && rightData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of rightData.value) {
      ids.push(item.id);
    }
  }
  // 选中值
  selectedKeys.value = ids || [];
  // 返回值
  emits('update:modelValue', rightData.value);
}, {deep: true, immediate: true});

</script>
<template>
  <a-layout :style="{height:`${props.height}px`}" class="choose-layout">
    <a-layout class="layout-content">
      <a-layout-content :style="{height:`${props.height+24}px`}" class="content-left">
        <OrgTree :has-root="true"
                 :height="props.height"
                 :max-count="1"
                 :parameter="props.parameter"
                 :root-selected="true"
                 :visible="visible"
                 @change="selectChange"/>
      </a-layout-content>
      <a-divider :style="{height:`${props.height+48}px`}" class="content-divider" direction="vertical"/>
      <a-layout-content :style="{height:`${props.height+24}px`}" class="content-centre">
        <UserList v-model="selectedKeys"
                  :height="props.height"
                  :max-count="props.maxCount"
                  :org-id="selectedOrgIds"
                  :visible="visible"
                  :parameter="props.parameter"
                  @change="userChooseChange"/>
      </a-layout-content>
      <a-divider :style="{height:`${props.height+48}px`}" class="content-divider" direction="vertical"/>
      <a-layout-content :style="{height:`${props.height+24}px`}" class="content-right">
        <div style="width:100%;display: inline-flex;flex-direction: column;">
          <div style="width:100%;display: inline-flex;align-items: center;justify-content: space-between;">
            <span>已选择 {{ rightData.length }}</span>
            <a-button style="padding-right: 0px;" type="text" @click="ev => {rightData = []}">
              <icon-delete/>
              &nbsp;清空
            </a-button>
          </div>
          <a-divider style="margin: 1px 0;border-bottom: 1px solid var(--color-neutral-5);"/>
          <a-scrollbar :style="scrollbar">
          <span class="box-inner">
            <span v-for="(item,index) of rightData" :key="index" :title="item.name" class="box-data">
              {{ item.name }}
              <icon-close :title="$t('userChooseBox.choose.delete')"
                          class="data-close" @click="deleteClick(item)"/>
            </span>
          </span>
          </a-scrollbar>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<style lang="less" scoped>
.choose-layout {
  width: 100%;

  .layout-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .content-left {
      width: 20%;
      margin-top: -24px;
      flex: auto;
    }

    .content-divider {
      margin: 0 5px;
      margin-top: -24px;
    }

    .content-centre {
      width: 60%;
      margin-top: -24px;
      flex: auto;
    }

    .content-right {
      flex: auto;
      width: 20%;
      margin-top: -24px;
      display: inline-flex;
      box-sizing: border-box;
      padding-right: 5px;
      padding-left: 5px;
      color: var(--color-text-1);
      background-color: var(--color-fill-2);
      font-size: 14px;
      border: 1px solid transparent;
      border-radius: var(--border-radius-small);
      cursor: text;
      transition: color 0.1s cubic-bezier(0, 0, 1, 1), border-color 0.1s cubic-bezier(0, 0, 1, 1), background-color 0.1s cubic-bezier(0, 0, 1, 1);

      .box-inner {
        padding-top: 2px;
        padding-bottom: 2px;
        flex: 1;
        overflow: hidden;
        line-height: 0;

        .box-data {
          height: auto;
          min-height: 24px;
          margin-top: 4px;
          margin-bottom: 1px;
          line-height: 22px;
          vertical-align: middle;
          display: inline-flex;
          align-items: center;
          margin-right: 4px;
          color: var(--color-text-1);
          font-size: 12px;
          white-space: pre-wrap;
          word-break: break-word;
          background-color: var(--color-bg-2);
          border-color: var(--color-fill-3);
          box-sizing: border-box;
          padding: 0 8px;
          font-weight: 500;
          border-radius: var(--border-radius-small);
          overflow: hidden;
          text-overflow: ellipsis;

          .data-close {
            margin-left: 4px;
            font-size: 12px;
            position: relative;
            display: inline-block;
            cursor: pointer;
            line-height: 12px;
          }
        }
      }
    }
  }
}
</style>