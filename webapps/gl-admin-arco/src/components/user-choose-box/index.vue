<script lang="ts">
export default {
  name: 'UserChooseBox'
}
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import {generateRandom} from "@/utils/strings";
import {QueryUserForm, queryUsersByParams} from '@/api/security';
import UserSelect from "./choose.vue";

type QueryForm = QueryUserForm;
type PageParams = { appId?: string; tenantCode?: string; }

const layoutHeight = ref<number>(445);
const layoutWidth = ref<number>(1285);

const emits = defineEmits([
  'update:modelValue',
  'update:userNames',
  'update:data',
  'update:visible',
  'change',
  'deleteAll', 'delete', 'openModal',
  'cancelModal', 'confirmModal'
]);
const props = defineProps({
  modelValue: {type: String, default: ''},// 组织id
  userNames: {type: String, default: ''},// 组织name
  data: {type: Array<QueryForm>, default: []},
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  disabled: {type: Boolean, default: false},// 是否禁用
  maxCount: {type: Number, default: 0},// 取值数量
  rootOrgId: {type: String, default: ''},// 根节点id
  onlyModal: {type: Boolean, default: false},// 仅使用弹窗
  visible: {type: Boolean, default: false},// 控制弹窗隐显
  onlySelect: {type: Boolean, default: true},// 仅选择，不可输入
});

const selectKey = ref(generateRandom());
const key = ref(generateRandom());
const modalVisible = ref(props.visible);
// 输入框数据
const tagData = ref<QueryForm[]>([]);
// 弹出数据
const modalData = ref<QueryForm[]>([]);
// 手动输入
const tagInput = ref<string>('');
const tagInputWidth = ref<number>(12);

/**
 * 将输入数据转为tag便签，失去焦点或enter
 * @param value
 * @param ev
 */
const tagInputChange = (value: string, ev?: Event) => {
  if (tagInput.value) {
    const values = tagInput.value.split(",") || [];
    for (let i = 0; i < values.length; i += 1) {
      tagData.value.push({id: values[i], name: values[i]} as QueryForm);
    }
    tagInput.value = "";
  }
}

/**
 * 输入数据解析
 */
const dataFormat = async () => {
  tagData.value = [];
  modalData.value = [];
  if (props.data && props.data.length) {
    if (props.onlyModal) {
      modalData.value = props.data;
    } else {
      tagData.value = props.data;
    }
  } else {
    const ids = props.modelValue ? props.modelValue.split(",") : [];
    const names = props.userNames ? props.userNames.split(",") : [];
    if (ids && ids.length > 0) {
      if (names && names.length > 0) {
        for (let i = 0; i < ids.length; i += 1) {
          if (ids[i]) {
            if (i < names.length && names[i]) {
              if (props.onlyModal) {
                modalData.value.push({id: ids[i], name: names[i]} as QueryForm);
              } else {
                tagData.value.push({id: ids[i], name: names[i]} as QueryForm);
              }
            } else if (props.onlyModal) {
              modalData.value.push({id: ids[i], name: ids[i]} as QueryForm);
            } else {
              tagData.value.push({id: ids[i], name: ids[i]} as QueryForm);
            }
          }
        }
      } else {
        try {
          const {data} = await queryUsersByParams({ids: props.modelValue});
          for (let i = 0; i < ids.length; i += 1) {
            let isQuery = false;
            if (data && data.length > 0) {
              // eslint-disable-next-line no-restricted-syntax
              for (const item of data) {
                if (item.id === ids[i]) {
                  if (props.onlyModal) {
                    modalData.value.push(item);
                  } else {
                    tagData.value.push(item);
                  }
                  isQuery = true;
                  break;
                }
              }
            }
            if (!isQuery) {
              if (props.onlyModal) {
                modalData.value.push({id: ids[i], name: ids[i]} as QueryForm);
              } else {
                tagData.value.push({id: ids[i], name: ids[i]} as QueryForm);
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

/**
 * 处理数据并输出
 */
const tagDataFormat = () => {
  const ids: string[] = [];
  const names: string[] = [];
  if (tagData.value && tagData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of tagData.value) {
      ids.push(item.id);
      names.push(item.name);
    }
  }
  emits('update:modelValue', ids.join(','));
  emits('update:userNames', names.join(','));
  emits('update:data', tagData.value);
}
/**
 * 打开选择页面
 * @param ev
 */
const editClick = (ev?: MouseEvent) => {
  key.value = generateRandom();
  modalData.value = [];
  modalData.value = cloneDeep(tagData.value);
  modalVisible.value = true;

  emits('openModal', tagData.value);
}
/**
 * 删除全部
 * @param ev
 */
const deleteAllClick = (ev?: MouseEvent) => {
  tagData.value = [];
  tagDataFormat();

  emits('deleteAll');
  emits('change', tagData.value);
}
/**
 * 单个删除
 * @param data
 */
const deleteClick = (data: QueryForm) => {
  tagData.value = tagData.value.filter(item => item.id !== data.id);
  tagDataFormat();

  emits('delete', data);
  emits('change', tagData.value);
}
/**
 * 选定数据
 * @param ev
 */
const modalOkClick = (ev?: MouseEvent) => {
  modalVisible.value = false;
  tagData.value = [];
  if (!props.onlyModal) {
    tagData.value = cloneDeep(modalData.value);
    tagDataFormat();

    emits('confirmModal', tagData.value);
    emits('change', tagData.value);
  } else {
    emits('confirmModal', modalData.value);
    emits('change', modalData.value);
  }
}
/**
 * 取消
 * @param ev
 */
const modalCancelClick = (ev?: MouseEvent) => {
  modalVisible.value = false;
  modalData.value = [];

  emits('cancelModal', tagData.value);
}

/* ******************** watch 监听 *********************** */
/**
 * 监听input输入，修改input宽度
 */
watch(() => tagInput, () => {
  setTimeout(() => {
    const element = document.querySelector(`#tag-${selectKey.value}>.box-mirror`);
    // @ts-ignore
    const width = element ? element.offsetWidth : 12;
    tagInputWidth.value = width > 12 ? width : 12;
  }, 10);
}, {deep: true, immediate: true});

/**
 * 数据输入
 */
watch(() => props, async () => {
  // 仅显示弹窗
  if (props.onlyModal && props.visible === true) {
    // 解析数据
    await dataFormat();
    key.value = generateRandom();
    modalVisible.value = props.visible;
  } else {
    // 解析数据
    await dataFormat();
  }
}, {deep: true, immediate: true});

/**
 * 弹出显示或隐藏
 */
watch(() => modalVisible, () => {
  emits('update:visible', modalVisible.value);
}, {deep: true, immediate: true});
</script>
<template>
  <span v-if="!onlyModal" :id="`tag-${selectKey}`" class="tag-box">
    <span class="box-inner">
      <span v-for="(item,index) of tagData" :key="index" :title="item.name" class="box-data">
        {{ item.name }}
        <icon-close v-if="!props.disabled" :title="$t('userChooseBox.index.delete')"
                    class="data-close"
                    @click="deleteClick(item)"/>
      </span>
      <a-input v-if="!props.onlySelect" v-model="tagInput"
               :style="{width: `${tagInputWidth}px`}"
               class="box-input"
               size="small"
               @change="tagInputChange"/>
    </span>
    <span class="box-mirror">{{ tagInput }}</span>
    <span v-if="!props.disabled" class="box-button">
      <a-button :title="$t('userChooseBox.index.select')"
                class="button-primary" type="dashed"
                @click="editClick($event)">
        <IconEdit/>
      </a-button>
      <a-button :title="$t('userChooseBox.index.delete')"
                class="button-delete" type="dashed"
                @click="deleteAllClick($event)">
        <IconDelete/>
      </a-button>
    </span>
  </span>
  <a-modal
      v-model:visible="modalVisible"
      :cancel-text="$t('userChooseBox.index.modal.cancel')"
      :ok-text="$t('userChooseBox.index.modal.confirm')"
      :title="$t('userChooseBox.index.modal.title')"
      :width="`${layoutWidth}px`"
      title-align="start"
      @cancel="modalCancelClick($event)"
      @ok="modalOkClick($event)">
    <UserSelect :key="key"
                v-model="modalData"
                :height="layoutHeight"
                :max-count="props.maxCount"
                :root-org-id="rootOrgId"
                :visible="modalVisible"
                :parameter="props.parameter"/>
  </a-modal>
</template>
<style lang="less" scoped>
.tag-box {
  display: inline-flex;
  box-sizing: border-box;
  width: 100%;
  padding-right: 0px;
  padding-left: 6px;
  color: var(--color-text-1);
  font-size: 14px;
  background-color: var(--color-fill-2);
  border: 1px solid transparent;
  border-radius: var(--border-radius-small);
  cursor: text;
  transition: color 0.1s cubic-bezier(0, 0, 1, 1), border-color 0.1s cubic-bezier(0, 0, 1, 1), background-color 0.1s cubic-bezier(0, 0, 1, 1);

  .box-empty {
    padding-top: 2px;
    padding-bottom: 2px;
    flex: 1;
    overflow: hidden;
    line-height: 26px;
  }

  .box-mirror {
    position: absolute;
    top: 0;
    left: 0;
    white-space: pre;
    visibility: hidden;
    pointer-events: none;
  }

  .box-inner {
    padding-top: 2px;
    padding-bottom: 2px;
    flex: 1;
    overflow: hidden;
    line-height: 0;

    .box-data {
      height: auto;
      min-height: 24px;
      margin-top: 1px;
      margin-bottom: 3px;
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

      .data-close::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: gray;
        border-radius: 50%;
      }
    }

    .box-input {
      margin-top: 1px;
      margin-bottom: 1px;
      line-height: 22px;
      vertical-align: middle;
      padding-right: 0;
      padding-left: 0;
      color: inherit;
      background: none;
      border: none;
      border-radius: 0;
      outline: none;
      cursor: inherit;
      -webkit-appearance: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      box-sizing: border-box;
      margin: 0;
      font-size: 100%;
      font-family: inherit;
      background-color: #FFFFFF;
    }
  }

  .box-button {
    .button-primary {
      color: rgb(var(--primary-6));
      background-color: var(--color-bg-1);
    }

    .button-delete {
      color: rgb(var(--danger-6));
      background-color: var(--color-bg-1);
    }
  }
}
</style>