<script lang="ts">
export default {
  name: 'GlOrgSelect'
}
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import {QueryOrgForm, securityApi, utils} from "@geelato/gl-ui";
import OrgSelect from "./choose.vue";

type QueryForm = QueryOrgForm;

const layoutHeight = ref<number>(420);
const layoutWidth = ref<number>(514);

const emits = defineEmits([
  'update:modelValue',
  'update:orgNames',
  'update:data',
  'update:visible',
  'change',
  'deleteAll', 'delete', 'openModal',
  'cancelModal', 'confirmModal'
]);
const props = defineProps({
  modelValue: {type: String, default: ''},// 组织id
  orgNames: {type: String, default: ''},// 组织name
  data: {type: Array<QueryForm>, default: []},// {id:,name:}
  disabled: {type: Boolean, default: false},// 是否禁用
  maxCount: {type: Number, default: 0},// 取值数量
  hasRoot: {type: Boolean, default: true},// 是否存在根节点
  onlyModal: {type: Boolean, default: false},// 仅使用弹窗
  visible: {type: Boolean, default: false},// 控制弹窗隐显
  onlySelect: {type: Boolean, default: true},// 仅选择，不可输入
});

const selectKey = ref(utils.gid());
const key = ref(utils.gid());
const modalVisible = ref(props.visible);
// 输入框数据
const tagData = ref<QueryForm[]>([]);
// 弹出数据
const modalData = ref<QueryForm[]>([]);
// 手动输入
const tagInput = ref<string>('');
const tagInputWidth = ref<number>(12);

/**
 * 数组对象值传递，防止引用相同地址
 * @param source
 * @param target
 */
const arrayDataToData = (source: QueryForm[], target: QueryForm[]) => {
  if (source && source.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of source) {
      target.push(item);
    }
  }
}

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
  if (props.data && props.data.length) {
    tagData.value = props.data;
  } else {
    const ids = props.modelValue ? props.modelValue.split(",") : [];
    const names = props.orgNames ? props.orgNames.split(",") : [];
    if (ids && ids.length > 0) {
      if (names && names.length > 0) {
        for (let i = 0; i < ids.length; i += 1) {
          if (ids[i]) {
            if (i < names.length && names[i]) {
              tagData.value.push({id: ids[i], name: names[i]} as QueryForm);
            } else {
              tagData.value.push({id: ids[i], name: ids[i]} as QueryForm);
            }
          }
        }
      } else {
        try {
          const {data} = await securityApi.queryOrgsByParams({ids: props.modelValue});
          for (let i = 0; i < ids.length; i += 1) {
            let isQuery = false;
            if (data && data.length > 0) {
              // eslint-disable-next-line no-restricted-syntax
              for (const item of data) {
                if (item.id === ids[i]) {
                  tagData.value.push(item);
                  isQuery = true;
                  break;
                }
              }
            }
            if (!isQuery) {
              tagData.value.push({id: ids[i], name: ids[i]} as QueryForm);
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
  emits('update:orgNames', names.join(','));
  emits('update:data', tagData.value);
}

/**
 * 打开选择页面
 * 1，重新加载弹窗
 * 2，将标签 加载至 弹窗
 * @param ev
 */
const editClick = (ev?: MouseEvent) => {
  key.value = utils.gid();
  modalData.value = [];
  arrayDataToData(tagData.value, modalData.value);
  modalVisible.value = true;

  emits('openModal', tagData.value);
}
/**
 * 删除全部
 * 1，清理标签
 * 2，处理props数据
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
  arrayDataToData(modalData.value, tagData.value);
  tagDataFormat();

  emits('confirmModal', tagData.value);
  emits('change', tagData.value);
}
/**
 * 取消
 * @param ev
 */
const modalCancelClick = (ev?: MouseEvent) => {
  modalVisible.value = false;

  emits('cancelModal', tagData.value);
}

/* ******************** watch 监听 *********************** */
/**
 * 监听input输入，修改input宽度
 */
watch(() => tagInput, () => {
  setTimeout(() => {
    // @ts-ignore
    const width = document.querySelector(`#tag-${selectKey.value}>.box-mirror`).offsetWidth;
    tagInputWidth.value = width > 12 ? width : 12;
  }, 10);
}, {deep: true, immediate: true});

/**
 * 数据输入
 */
watch(() => props, async () => {
  // 解析数据
  await dataFormat();
  // 仅显示弹窗
  if (props.onlyModal) {
    key.value = utils.gid();
    arrayDataToData(tagData.value, modalData.value);
    modalVisible.value = props.visible;
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
        <GlIconfont type="gl-wrong" v-if="!props.disabled" title="删除"
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
      <a-button title="选择"
                class="button-primary" type="dashed"
                @click="editClick($event)">
        <GlIconfont type="gl-edit-square"/>
      </a-button>
      <a-button title="删除"
                class="button-delete" type="dashed"
                @click="deleteAllClick($event)">
        <GlIconfont type="gl-delete"/>
      </a-button>
    </span>
  </span>
  <a-modal
      v-model:visible="modalVisible"
      cancel-text="关闭" ok-text="确定" title="组织选择"
      :width="`${layoutWidth}px`"
      title-align="start"
      @cancel="modalCancelClick($event)"
      @ok="modalOkClick($event)">
    <OrgSelect :key="key"
               v-model="modalData"
               :has-root="props.hasRoot"
               :height="layoutHeight"
               :max-count="props.maxCount"/>
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
        color: red;
        background-color: white;
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