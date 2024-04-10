<script lang="ts">
export default {
  name: 'GlDictionaryEntryLocker'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import type {TableData, TableRowSelection} from "@arco-design/web-vue";
import {securityApi, useGlobal, utils} from "@geelato/gl-ui";
import type {QueryDictItemForm} from "@geelato/gl-ui";
import {enableStatusOptions} from "../searchTable";

// 页面所需 参数
type PageParams = {
  pid: string; // 父级主键
  dictId: string; // 字典主键
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},// 表单 - 主键
  data: {type: Array<QueryDictItemForm>, default: []},
  visible: {type: Boolean, default: false},// 弹层 - 是否显示
  isModal: {type: Boolean, default: true},// 弹层 - 方式，true-弹窗；false-抽屉
  title: {type: String, default: ''},// 弹层 - 标题
  width: {type: String, default: ''},// 弹层 - 高度，为空-自然变化
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 页面状态
  height: {type: [Number, String], default: ''},// 弹层 - 高度，为空-自然变化
  formCol: {type: Number, default: 1},// 表单 - 一行显示个数
});

const global = useGlobal();
const loading = ref<boolean>(false);
const visibleForm = ref<boolean>(false);
const columnData = ref<QueryDictItemForm[]>([]);
const selectedKeys = ref([]);
const rowSelection = ref<TableRowSelection>({
  type: 'checkbox', showCheckedAll: true, onlyCurrent: true
});
const columnTitle = reactive([]);
// 列表 - 滑动条
const resetListHeight = () => {
  return (props.height as number) - 80;
}
const scrollbar = ref(true);
const scroll = ref({x: 1140, y: resetListHeight()});

/**
 * 加载数据
 * @param params
 */
const fetchData = async (params: Record<string, any>) => {
  loading.value = true;
  try {
    const {data} = await securityApi.queryDictItems(params);
    columnData.value = [];
    if (data.length > 0 && !props.parameter.pid) {
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].pid == null || data[i].pid.length <= 0) {
          columnData.value.push(data[i]);
        }
      }
    } else {
      columnData.value = data;
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

/**
 * 校验
 */
const validateForm = async (): Promise<boolean> => {
  let isValid = true;
  if (columnData.value && columnData.value.length > 0) {
    const {data} = await securityApi.queryDictItems({
      dictId: props.parameter.dictId, current: 1, pageSize: 10000
    });
    const dictItemCodes: string[] = [];
    if (data && data.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data) {
        let isRemove = false;
        // eslint-disable-next-line no-restricted-syntax
        for (const ctem of columnData.value) {
          if (item.id === ctem.id) {
            isRemove = true;
            break;
          }
        }
        if (!isRemove) dictItemCodes.push(item.itemCode);
      }
    }
    const itemCodes: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of columnData.value) {
      if (!item.itemCode || !item.itemName) {
        isValid = false;
        global.$message.warning({content: '请补充字典项的必填项！'});
        break;
      }
      if (itemCodes.includes(item.itemCode) || dictItemCodes.includes(item.itemCode)) {
        isValid = false;
        global.$message.warning({content: `字典项的编码不能重复【${item.itemCode}】！`});
        break;
      } else {
        itemCodes.push(item.itemCode);
      }
    }
  }
  return isValid;
}

/* 表单 */
const copyEvent = (value: string) => {
  utils.copyToClipboard(value, (val: string) => {
    global.$message.success({content: '复制成功'});
  }, (val: string) => {
    global.$message.error({content: '复制失败'});
  });
}

const copyFilling = (ev?: MouseEvent) => {
  const copyData: QueryDictItemForm[] = [];
  if (columnData.value.length > 0) {
    for (let i = 0; i < columnData.value.length; i += 1) {
      if (selectedKeys.value.length === 0 ||
          (selectedKeys.value.length > 0 && selectedKeys.value.includes(columnData.value[i].id as never))) {
        copyData.push(columnData.value[i]);
      }
    }
  }
  copyEvent(JSON.stringify(copyData));
}
const codedFilling = (type: string) => {
  if (['name', 'code', 'number', 'letter'].includes(type) && columnData.value.length > 0) {
    for (let i = 0; i < columnData.value.length; i += 1) {
      if (selectedKeys.value.length === 0 ||
          (selectedKeys.value.length > 0 && selectedKeys.value.includes(columnData.value[i].id as never))) {
        switch (type) {
          case 'code':
            columnData.value[i].itemName = columnData.value[i].itemCode;
            break;
          case 'name':
            columnData.value[i].itemCode = columnData.value[i].itemName;
            break;
          case 'number':
            columnData.value[i].itemCode = (i + 1).toString();
            break;
          case 'letter':
            columnData.value[i].itemCode = String.fromCharCode(i + 97);
            break;
          default:
            break;
        }
      }
    }
  }
}
const changeStatusEnable = (status: number) => {
  if ([0, 1].includes(status) && columnData.value.length > 0) {
    for (let i = 0; i < columnData.value.length; i += 1) {
      if (selectedKeys.value.length === 0 ||
          (selectedKeys.value.length > 0 && selectedKeys.value.includes(columnData.value[i].id as never))) {
        columnData.value[i].enableStatus = status;
      }
    }
  }
}
const batchDeletes = (ev?: MouseEvent) => {
  if (columnData.value.length > 0) {
    const indexs = [];
    for (let i = 0; i < columnData.value.length; i += 1) {
      if (selectedKeys.value.length > 0 && selectedKeys.value.includes(columnData.value[i].id as never)) {
        indexs.push(i);
      }
    }
    indexs.sort((a, b) => b - a);
    for (let i = 0; i < indexs.length; i += 1) {
      columnData.value.splice(indexs[i], 1);
    }
    selectedKeys.value = [];
  }
}
const addTable = (e: Event) => {
  validateForm().then((valid: boolean) => {
    if (valid) {
      columnData.value.push({
        id: utils.gid('locker'),
        pid: props.parameter.pid,
        dictId: props.parameter.dictId,
        appId: props.parameter?.appId || '',
        tenantCode: props.parameter?.tenantCode || '',
        itemName: '',
        itemCode: '',
        enableStatus: 1
      } as QueryDictItemForm);
    }
  });
}
const popupVisible = ref(false);
const affixData = ref({itemName: '', itemCode: ''});
const handlePopupCancel = (ev?: MouseEvent) => {
  affixData.value = {itemName: '', itemCode: ''};
  popupVisible.value = false;
}
const handlePopupOk = (ev?: MouseEvent) => {
  const regex = /[\s,]+/g;
  const itemNames = affixData.value.itemName ? affixData.value.itemName.replace(regex, ',').split(',') : [];
  const itemCodes = affixData.value.itemCode ? affixData.value.itemCode.replace(regex, ',').split(',') : [];
  const maxLen = itemCodes.length > itemNames.length ? itemCodes.length : itemNames.length;
  for (let i = 0; i < maxLen; i += 1) {
    columnData.value.push({
      id: utils.gid('locker'),
      pid: props.parameter.pid,
      dictId: props.parameter.dictId,
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || '',
      itemName: itemNames[i] || '',
      itemCode: itemCodes[i] || '',
      enableStatus: 1
    } as QueryDictItemForm);
  }
  handlePopupCancel();
}

const okLoading = ref(false);
const handleModelOk = async (done: any) => {
  okLoading.value = true;
  try {
    console.log(columnData.value);
    if (columnData.value && columnData.value.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of columnData.value) {
        if (item.id && item.id.startsWith('locker')) item.id = '';
      }
      await validateForm().then(async (valid: boolean) => {
        if (valid) {
          await securityApi.batchCreateOrUpdateDictItem(props.parameter.dictId, props.parameter.pid, columnData.value);
          visibleForm.value = false;
          emits('saveSuccess', {}, props.formState);
          done(true);
        } else {
          done(false);
        }
      });
    } else {
      done(false);
      global.$message.warning({content: '请添加字典项！'});
    }
  } catch (err) {
    done(false);
    console.log(err);
  } finally {
    okLoading.value = false;
  }
};
const handleModelCancel = (e: Event) => {
  visibleForm.value = false;
}

const handleChange = (_data: any[]) => {
  columnData.value = _data;
}
const deleteItemColumn = (key: string) => {
  const indexs = [];
  for (let i = 0; i < columnData.value.length; i += 1) {
    if (columnData.value[i].id === key) {
      indexs.push(i);
    }
  }
  indexs.sort((a, b) => b - a);
  for (let i = 0; i < indexs.length; i += 1) {
    columnData.value.splice(indexs[i], 1);
  }
  selectedKeys.value = [];
}

const reset = (ev?: Event) => {
  fetchData({
    pid: props.parameter.pid,
    dictId: props.parameter.dictId,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
    current: 1, pageSize: 10000, order: 'seqNo|asc'
  });
}

watch(() => props, () => {
  if (props.visible === true) {
    scroll.value.y = resetListHeight();

    columnData.value = [];
    if (['edit', 'view'].includes(props.formState) && props.parameter.dictId) {
      reset();
    }
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-if="isModal"
           v-model:visible="visibleForm"
           :footer="formState!=='view'"
           :title="title || ''"
           :width="width || ''"
           cancel-text="取消"
           ok-text="确认" title-align="start"
           @cancel="handleModelCancel($event)" @before-ok="handleModelOk">
    <div class="general-card" :style="{height:`${height}px`}">
      <a-row v-show="formState==='edit'" style="margin-bottom: 10px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="addTable($event)">
              <template #icon>
                <gl-iconfont type="gl-plus-circle"/>
              </template>
              新建
            </a-button>
            <a-trigger
                v-model:popup-visible="popupVisible"
                :popup-translate="[0, 10]"
                :unmount-on-close="false"
                position="bl"
                show-arrow
                trigger="click">
              <a-button type="primary">
                <template #icon>
                  <gl-iconfont type="gl-plus-circle"/>
                </template>
                粘贴
              </a-button>
              <template #content>
                <a-form :label-col-props="{ span: 3 }" :model="affixData" :wrapper-col-props="{ span: 21 }" class="affix-form">
                  <a-form-item field="itemName" label="名称">
                    <a-textarea v-model.t.trim="affixData.itemName" :auto-size="{minRows:1,maxRows:3}" show-word-limit/>
                  </a-form-item>
                  <a-form-item field="itemCode" label="编码">
                    <a-textarea v-model.trim="affixData.itemCode" :auto-size="{minRows:1,maxRows:3}" show-word-limit/>
                  </a-form-item>
                  <a-space style="justify-content: flex-end;">
                    <a-button @click="handlePopupCancel($event)">取消</a-button>
                    <a-button type="primary" @click="handlePopupOk($event)">关闭</a-button>
                  </a-space>
                </a-form>
              </template>
            </a-trigger>
            <a-button type="outline" @click="copyFilling($event)">
              <template #icon>
                <gl-iconfont type="gl-copy"/>
              </template>
              复制(JSON)
            </a-button>
            <a-button type="outline" @click="batchDeletes($event)">
              <template #icon>
                <gl-iconfont type="gl-delete"/>
              </template>
              批量删除
            </a-button>
            <a-dropdown-button>
              字典项填充
              <template #icon>
                <gl-iconfont type="gl-arrow-down-bold"/>
              </template>
              <template #content>
                <a-doption @click="codedFilling('code')">[编码]填入[名称]</a-doption>
                <a-doption @click="codedFilling('name')">[名称]填入[编码]</a-doption>
                <a-doption @click="codedFilling('number')">[编码]数值(从1开始)</a-doption>
                <a-doption @click="codedFilling('letter')">[编码]字母(a-z)</a-doption>
              </template>
            </a-dropdown-button>
            <a-dropdown-button>
              状态变更
              <template #icon>
                <gl-iconfont type="gl-arrow-down-bold"/>
              </template>
              <template #content>
                <a-doption @click="changeStatusEnable(1)">启用</a-doption>
                <a-doption @click="changeStatusEnable(0)">禁用</a-doption>
              </template>
            </a-dropdown-button>
            <a-button type="outline" @click="reset($event)">
              <template #icon>
                <gl-iconfont type="gl-reset"/>
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
          v-model:selectedKeys="selectedKeys"
          :bordered="{cell:true}"
          :columns="columnTitle"
          :data="(columnData as TableData[])"
          :draggable="{ type: 'handle', width: 40 }"
          :loading="loading"
          :pagination="false"
          :row-selection="rowSelection"
          :scroll="scroll"
          :scrollbar="scrollbar"
          :stripe="true"
          column-resizable
          row-key="id"
          size="small" @change="handleChange">
        <template #columns>
          <a-table-column :ellipsis="true" :tooltip="true" :width="210" align="center" data-index="itemName">
            <template #title>
              <strong style="color: rgb(var(--danger-6)); font-size: 12px;line-height: 1;">*</strong>
              名称
            </template>
            <template #cell="{record}">
              <a-input v-model.trim="record.itemName" :max-length="32"/>
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :tooltip="true" :width="240" align="center" data-index="itemCode">
            <template #title>
              <strong style="color: rgb(var(--danger-6)); font-size: 12px;line-height: 1;">*</strong>
              编码
            </template>
            <template #cell="{record}">
              <a-textarea v-model.trim="record.itemCode" :auto-size="{minRows:1,maxRows:4}" :max-length="512" show-word-limit/>
            </template>
          </a-table-column>
          <a-table-column :width="120" align="center" data-index="enableStatus">
            <template #title>
              <strong style="color: rgb(var(--danger-6)); font-size: 12px;line-height: 1;">*</strong>
              状态
            </template>
            <template #cell="{ record }">
              <a-select v-model="record.enableStatus" :options="enableStatusOptions"/>
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="itemRemark" title="备注">
            <template #cell="{record}">
              <a-textarea v-model="record.itemRemark" :auto-size="{minRows:1,maxRows:3}" :max-length="512" show-word-limit/>
            </template>
          </a-table-column>
          <a-table-column :width="180" data-index="createAt" title="创建时间"/>
          <a-table-column :width="70" align="center" data-index="operations" fixed="right" title="操作">
            <template #cell="{record}">
              <a-button status="danger" type="text" @click="deleteItemColumn(record.id)">
                <template #icon>
                  <gl-iconfont type="gl-wrong"/>
                </template>
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
div.arco-form-item-content > span.textarea-span {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.affix-form {
  padding: 18px 10px 10px 5px;
  width: 456px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}
</style>