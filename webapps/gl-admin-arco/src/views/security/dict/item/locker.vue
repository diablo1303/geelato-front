<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('security.dictItem.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('security.dictItem.index.model.ok.text')"
      :title="$t(`security.dictItem.index.model.title.${pageData.formState}`)"
      width="60%"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <template #footer>
      <a-space style="float: left;">
        <a-button type="primary" @click="addTable($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
      </a-space>
      <a-space>
        <a-button @click="handleModelCancel($event)">{{ $t('model.connect.index.model.cancel.text') }}</a-button>
        <a-button type="primary" :loading="okLoading" @click="handleModelOk($event)">{{ $t('model.connect.index.model.ok.text') }}</a-button>
      </a-space>
    </template>
    <a-table
        :bordered="{cell:true}"
        :columns="columnTitle"
        :data="(columnData as TableData[])"
        :pagination="false"
        :stripe="true"
        size="small"
        :draggable="{ type: 'handle', width: 30 }"
        column-resizable
        row-key="id" @change="handleChange">
      <template #columns>
        <a-table-column :title="$t('security.dictItem.index.form.itemName')" data-index="itemName" :ellipsis="true" :tooltip="true" :width="140">
          <template #cell="{record}">
            <a-input v-model="record.itemName" :max-length="32" placeholder="必填项"/>
          </template>
        </a-table-column>
        <a-table-column :title="$t('security.dictItem.index.form.itemCode')" data-index="itemCode" :ellipsis="true" :tooltip="true" :width="140">
          <template #cell="{record}">
            <a-input v-model="record.itemCode" :max-length="32" placeholder="必填项" @blur="itemCodeValidate($event)"/>
          </template>
        </a-table-column>
        <a-table-column :title="$t('security.dictItem.index.form.enableStatus')" data-index="enableStatus" :width="70">
          <template #cell="{ record }">
            <a-select v-model="record.enableStatus">
              <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
            </a-select>
          </template>
        </a-table-column>
        <a-table-column :title="$t('model.column.index.form.operations')" data-index="operations" :width="40"
                        align="center" fixed="right">
          <template #cell="{record}">
            <a-button type="text" status="danger" @click="deleteItemColumn(record.itemCode)">
              <template #icon>
                <IconClose/>
              </template>
            </a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {Notification} from "@arco-design/web-vue";
import {ListUrlParams, PageQueryRequest} from '@/api/base';
import {batchCreateOrUpdateDictItem, pageQueryDictItem as pageQueryList, QueryDictForm as QueryModel, QueryDictItemForm} from "@/api/security";
import {TableData} from "@arco-design/web-vue/es/table/interface";
import {enableStatusOptions} from "@/views/security/dict/item/searchTable";

// 表单
const columnData = ref<QueryDictItemForm[]>([]);
const pageData = ref({
  formState: 'add', button: true, pId: '', pName: '', okBack: (data: QueryModel) => {
  }
});
const columnTitle = reactive([
  {title: '名称', dataIndex: 'itemName',},
  {title: '编码', dataIndex: 'itemCode',},
  {title: '状态', dataIndex: 'enableStatus',},
  {title: '操作', dataIndex: 'operations'}
]);
// 显示隐藏
const visibleModel = ref(false);
const fetchData = async (params: PageQueryRequest) => {
  try {
    const {data} = await pageQueryList(params);
    columnData.value = data.items as unknown as QueryDictItemForm[];
  } catch (err) {
    console.log(err);
  }
};

const validateForm = (): boolean => {
  let isValid = true;
  if (columnData.value && columnData.value.length > 0) {
    const itemCodes: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of columnData.value) {
      if (!item.itemCode || !item.itemName) {
        isValid = false;
        Notification.warning("请补充字典项的必填项！");
        break;
      }
      if (itemCodes.includes(item.itemCode)) {
        isValid = false;
        Notification.warning(`字典项的编码不能重复【${item.itemCode}】！`);
        break;
      } else {
        itemCodes.push(item.itemCode);
      }
    }
  }
  return isValid;
}
const itemCodeValidate = (ev: KeyboardEvent) => {
  validateForm();
}
/* 表单 */
const addTable = (e: Event) => {
  if (validateForm()) {
    columnData.value.push({dictId: pageData.value.pId, itemName: '', itemCode: '', enableStatus: 1} as QueryDictItemForm);
  }
}

const okLoading = ref(false);
const handleModelOk = async (done: any) => {
  okLoading.value = true;
  try {
    console.log(columnData.value);
    if (columnData.value && columnData.value.length > 0) {
      if (validateForm()) {
        await batchCreateOrUpdateDictItem(pageData.value.pId, columnData.value);
        visibleModel.value = false;
        pageData.value.okBack({} as unknown as QueryModel);
      }
    } else {
      Notification.warning("请添加字典项！");
    }
  } catch (err) {
    console.log(err);
  } finally {
    okLoading.value = false;
  }
};
const handleModelCancel = (e: Event) => {
  visibleModel.value = false;
}

const handleChange = (_data: any[]) => {
  columnData.value = _data;
}
const deleteItemColumn = (itemCode: string) => {
  const indexs = [];
  for (let i = 0; i < columnData.value.length; i += 1) {
    if (columnData.value[i].itemCode === itemCode) {
      indexs.push(i);
    }
  }
  for (let i = 0; i < indexs.length; i += 1) {
    columnData.value.splice(indexs[i], 1);
  }
}

const openForm = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.pId = urlParams.params?.pId || "";
  pageData.value.pName = urlParams.params?.pName || "";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  urlParams.loadFailBack = () => {
    pageData.value.button = false;
  }
  urlParams.loadSuccessBack = (data: QueryModel) => {
    // eslint-disable-next-line no-console
    console.log(data);
  }
  if (pageData.value.pId) {
    fetchData({dictId: pageData.value.pId, current: 1, pageSize: 10000} as unknown as PageQueryRequest);
  }
  // 显示
  visibleModel.value = true;
  pageData.value.okBack = urlParams.closeBack ? urlParams.closeBack : pageData.value.okBack;
}

// 将方法暴露出去
defineExpose({openForm});
</script>

<style lang="less" scoped>
div.arco-form-item-content > span.textarea-span {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>