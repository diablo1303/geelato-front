<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      :cancel-text="$t('security.dictItem.index.model.cancel.text')"
      :footer="pageData.button&&!draggableData.sort"
      :ok-text="$t('security.dictItem.index.model.ok.text')"
      :title="$t(`security.dictItem.index.model.title.${pageData.formState}`)"
      width="64%"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <template #footer>
      <!-- <a-space style="float: left;">
              <a-button type="primary" @click="addTable($event)">
                <template #icon>
                  <icon-plus/>
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
            </a-space>-->
      <a-space>
        <a-button @click="handleModelCancel($event)">{{ $t('model.connect.index.model.cancel.text') }}</a-button>
        <a-button :loading="okLoading" type="primary" @click="handleModelOk($event)">{{ $t('model.connect.index.model.ok.text') }}</a-button>
      </a-space>
    </template>
    <a-row v-show="pageData.formState==='edit'" style="margin-bottom: 10px">
      <a-col :span="12">
        <a-space>
          <a-button v-show="!draggableData.sort" type="primary" @click="addTable($event)">
            <template #icon>
              <icon-plus/>
            </template>
            {{ $t('searchTable.operation.create') }}
          </a-button>
          <a-trigger v-show="!draggableData.sort"
                     v-model:popup-visible="popupVisible"
                     :popup-translate="[0, 10]"
                     :unmount-on-close="false"
                     position="bl"
                     show-arrow
                     trigger="click">
            <a-button v-show="!draggableData.sort" type="primary">
              <template #icon>
                <icon-plus/>
              </template>
              粘贴
            </a-button>
            <template #content>
              <a-form :label-col-props="{ span: 3 }" :model="affixData" :wrapper-col-props="{ span: 21 }" class="affix-form">
                <a-form-item :label="$t('security.dictItem.index.form.itemName')" field="itemName">
                  <a-textarea v-model.t.trim="affixData.itemName" :auto-size="{minRows:1,maxRows:3}" show-word-limit/>
                </a-form-item>
                <a-form-item :label="$t('security.dictItem.index.form.itemCode')" field="itemCode">
                  <a-textarea v-model.trim="affixData.itemCode" :auto-size="{minRows:1,maxRows:3}" show-word-limit/>
                </a-form-item>
                <a-space style="justify-content: flex-end;">
                  <a-button @click="handlePopupCancel($event)">{{ $t('model.connect.index.model.cancel.text') }}</a-button>
                  <a-button type="primary" @click="handlePopupOk($event)">{{ $t('model.connect.index.model.ok.text') }}</a-button>
                </a-space>
              </a-form>
            </template>
          </a-trigger>
          <a-button type="outline" @click="sortFilling($event)">
            <template #icon>
              <icon-copy/>
            </template>
            {{ draggableData.title }}
          </a-button>
          <a-button v-show="!draggableData.sort" type="outline" @click="copyFilling($event)">
            <template #icon>
              <icon-copy/>
            </template>
            复制(JSON)
          </a-button>
          <a-button v-show="!draggableData.sort" type="outline" @click="batchDeletes($event)">
            <template #icon>
              <icon-delete/>
            </template>
            批量删除
          </a-button>
          <a-dropdown-button v-show="!draggableData.sort">
            字典项填充
            <template #icon>
              <icon-down/>
            </template>
            <template #content>
              <a-doption @click="codedFilling('code')">[编码]填入[名称]</a-doption>
              <a-doption @click="codedFilling('name')">[名称]填入[编码]</a-doption>
              <a-doption @click="codedFilling('number')">[编码]数值(从1开始)</a-doption>
              <a-doption @click="codedFilling('letter')">[编码]字母(a-z)</a-doption>
            </template>
          </a-dropdown-button>
          <a-dropdown-button v-show="!draggableData.sort">
            状态变更
            <template #icon>
              <icon-down/>
            </template>
            <template #content>
              <a-doption @click="changeStatusEnable(1)">启用</a-doption>
              <a-doption @click="changeStatusEnable(0)">禁用</a-doption>
            </template>
          </a-dropdown-button>
        </a-space>
      </a-col>
    </a-row>
    <a-table
        v-model:selectedKeys="selectedKeys"
        :bordered="{cell:true}"
        :columns="columnTitle"
        :data="(columnData as TableData[])"
        :default-expand-all-rows="true"
        :draggable="draggableData.draggable"
        :pagination="false"
        :row-selection="rowSelection"
        :stripe="true"
        column-resizable
        row-key="id"
        size="small" @change="handleChange">
      <template #columns>
        <a-table-column :ellipsis="true" :title="$t('security.dictItem.index.form.itemName')" :tooltip="true" :width="250" data-index="itemName">
          <template #cell="{record}">
            <a-input v-model.trim="record.itemName" :max-length="32" placeholder="必填项"/>
          </template>
        </a-table-column>
        <a-table-column :ellipsis="true" :title="$t('security.dictItem.index.form.itemCode')" :tooltip="true" :width="170" data-index="itemCode">
          <template #cell="{record}">
            <a-input v-model.trim="record.itemCode" :max-length="32" placeholder="必填项" @blur="itemCodeValidate($event)"/>
          </template>
        </a-table-column>
        <a-table-column :title="$t('security.dictItem.index.form.enableStatus')" :width="110" data-index="enableStatus">
          <template #cell="{ record }">
            <a-select v-model="record.enableStatus">
              <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
            </a-select>
          </template>
        </a-table-column>
        <a-table-column :ellipsis="true" :title="$t('security.dictItem.index.form.itemRemark')" :tooltip="true" :width="350" data-index="itemRemark">
          <template #cell="{record}">
            <a-textarea v-model="record.itemRemark" :auto-size="{minRows:1,maxRows:3}" :max-length="512" show-word-limit/>
          </template>
        </a-table-column>
        <a-table-column :title="$t('security.dictItem.index.form.createAt')" :width="170" data-index="createAt"/>
        <a-table-column v-if="!draggableData.sort" :title="$t('model.column.index.form.operations')" :width="100" align="center"
                        data-index="operations" fixed="right">
          <template #cell="{record}">
            <a-button status="danger" type="text" @click="addTable($event,record.id)">
              <template #icon>
                <IconPlus/>
              </template>
            </a-button>
            <a-button status="danger" type="text" @click="deleteItemColumn(record.id)">
              <template #icon>
                <IconClose/>
              </template>
            </a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-drawer>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import {Notification, TableData} from "@arco-design/web-vue";
import {ListUrlParams, PageQueryRequest} from '@/api/base';
import {batchCreateOrUpdateDictItem, pageQueryDictItem as pageQueryList, QueryDictForm as QueryModel, QueryDictItemForm} from "@/api/security";
import {enableStatusOptions} from "@/views/security/dict/item/searchTable";
import {copyToClipboard} from "@/utils/strings";
import {useRoute} from "vue-router";

// 表单
const {t} = useI18n();
const route = useRoute();
const columnData = ref<QueryDictItemForm[]>([]);
const pageData = ref({
  formState: 'add', button: true, pId: '', pName: '', okBack: (data: QueryModel) => {
  }
});
const columnTitle = reactive([
  {title: '名称', dataIndex: 'itemName',},
  {title: '编码', dataIndex: 'itemCode',},
  {title: '状态', dataIndex: 'enableStatus',},
  {title: '备注', dataIndex: 'itemRemark',},
  {title: '创建时间', dataIndex: 'createAt',},
  {title: '操作', dataIndex: 'operations'}
]);
// 显示隐藏
const visibleModel = ref(false);
const selectedKeys = ref([]);
const draggableData = ref({draggable: {}, sort: false, title: "排序"});
const rowSelection = reactive({type: 'checkbox', showCheckedAll: true, checkStrictly: true, onlyCurrent: true});
const fetchData = async (params: PageQueryRequest) => {
  try {
    // @ts-ignore
    params.tenantCode = (route.params && route.params.tenantCode as string) || '';
    const {data} = await pageQueryList(params);
    // eslint-disable-next-line no-use-before-define
    columnData.value = formatTree([], data.items as unknown as QueryDictItemForm[]);
  } catch (err) {
    console.log(err);
  }
};

/**
 * tree
 * @param cForms
 * @param forms
 */
const formatTree = (cForms: QueryDictItemForm[], forms: QueryDictItemForm[]) => {
  if (cForms && cForms.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const cItem of cForms) {
      cItem.children = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const item of forms) {
        if (cItem.id === item.pid) {
          cItem.children.push(item);
        }
      }
      if (cItem.children && cItem.children.length > 0) {
        formatTree(cItem.children, forms);
      } else {
        delete cItem.children;
      }
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of forms) {
      if (!item.pid) {
        item.children = [];
        cForms.push(item);
      }
    }
    if (cForms && cForms.length > 0) {
      formatTree(cForms, forms);
    }
  }
  return cForms;
}
const resetTree = (cForms: QueryDictItemForm[], forms: QueryDictItemForm[]) => {
  if (forms && forms.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of forms) {
      cForms.push({
        "id": item.id,
        // @ts-ignore
        "createAt": item.createAt, "updateAt": item.updateAt, "creator": item.creator, "updater": item.updater,
        // @ts-ignore
        "delStatus": item.delStatus, "buId": item.buId, "deptId": item.deptId, "tenantCode": item.tenantCode,
        "seqNo": item.seqNo,
        "pid": item.pid,
        "dictId": item.dictId,
        "itemCode": item.itemCode,
        "itemName": item.itemName,
        "itemRemark": item.itemRemark,
        "enableStatus": item.enableStatus,
      });
      if (item.children && item.children.length > 0) {
        resetTree(cForms, item.children);
      }
    }
  }
  if (cForms && cForms.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of cForms) {
      delete item.children;
    }
  }
  return cForms;
}

const validateForm = (): boolean => {
  let isValid = true;
  const tableData = resetTree([], columnData.value);
  if (tableData && tableData.length > 0) {
    const itemCodes: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of tableData) {
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

function UUID() {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 42; i += 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

/* 表单 */
const sortFilling = (ev?: MouseEvent) => {
  if (!draggableData.value.sort) {
    columnData.value = resetTree([], columnData.value);
    draggableData.value = {draggable: {type: 'handle', width: 30}, sort: true, title: "完成排序"};
  } else {
    columnData.value = formatTree([], columnData.value);
    draggableData.value = {draggable: {}, sort: false, title: "排序"};
  }
}
const copyFilling = (ev?: MouseEvent) => {
  const copyData: QueryDictItemForm[] = [];
  const tableData = resetTree([], columnData.value);
  if (tableData.length > 0) {
    for (let i = 0; i < tableData.length; i += 1) {
      if (selectedKeys.value.length === 0 ||
        (selectedKeys.value.length > 0 && selectedKeys.value.includes(tableData[i].id as never))) {
        copyData.push(tableData[i]);
      }
    }
  }
  copyToClipboard(JSON.stringify(copyData), t('copy.to.clipboard.success'), t('copy.to.clipboard.fail'));
}
const codedFilling = (type: string) => {
  if (['name', 'code', 'number', 'letter'].includes(type) && columnData.value.length > 0) {
    const tableData = resetTree([], columnData.value);
    for (let i = 0; i < tableData.length; i += 1) {
      if (selectedKeys.value.length === 0 ||
        (selectedKeys.value.length > 0 && selectedKeys.value.includes(tableData[i].id as never))) {
        switch (type) {
          case 'code':
            tableData[i].itemName = tableData[i].itemCode;
            break;
          case 'name':
            tableData[i].itemCode = tableData[i].itemName;
            break;
          case 'number':
            tableData[i].itemCode = (i + 1).toString();
            break;
          case 'letter':
            tableData[i].itemCode = String.fromCharCode(i + 97);
            break;
          default:
            break;
        }
      }
    }
    columnData.value = formatTree([], tableData);
  }
}
const changeStatusEnable = (status: number) => {
  if ([0, 1].includes(status) && columnData.value.length > 0) {
    const tableData = resetTree([], columnData.value);
    for (let i = 0; i < tableData.length; i += 1) {
      if (selectedKeys.value.length === 0 ||
        (selectedKeys.value.length > 0 && selectedKeys.value.includes(tableData[i].id as never))) {
        tableData[i].enableStatus = status;
      }
    }
    columnData.value = formatTree([], tableData);
  }
}
const batchDeletes = (ev?: MouseEvent) => {
  if (columnData.value.length > 0) {
    const indexs = [];
    const tableData = resetTree([], columnData.value);
    for (let i = 0; i < tableData.length; i += 1) {
      if (selectedKeys.value.length > 0 && selectedKeys.value.includes(tableData[i].id as never)) {
        indexs.push(i);
      }
    }
    for (let i = 0; i < indexs.length; i += 1) {
      tableData.splice(indexs[i], 1);
    }
    selectedKeys.value = [];
    columnData.value = formatTree([], tableData);
  }
}
const addTable = (e: Event, parentId?: string) => {
  if (parentId && parentId.length === 42) {
    Notification.warning("请先保存父级！");
    return;
  }
  if (validateForm()) {
    const tableData = resetTree([], columnData.value);
    tableData.push({
      id: UUID(),
      pid: parentId || '',
      dictId: pageData.value.pId,
      itemName: '',
      itemCode: '',
      enableStatus: 1,
      tenantCode: (route.params && route.params.tenantCode as string) || '',
    } as QueryDictItemForm);
    console.log(tableData);
    columnData.value = formatTree([], tableData);
  }
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
    const tableData = resetTree([], columnData.value);
    tableData.push({
      id: UUID(),
      dictId: pageData.value.pId,
      itemName: itemNames[i] || '',
      itemCode: itemCodes[i] || '',
      enableStatus: 1,
      tenantCode: (route.params && route.params.tenantCode as string) || '',
    } as QueryDictItemForm);
    columnData.value = formatTree([], tableData);
  }
  handlePopupCancel();
}

const okLoading = ref(false);
const handleModelOk = async (done: any) => {
  okLoading.value = true;
  try {
    if (columnData.value && columnData.value.length > 0) {
      const tableData = resetTree([], columnData.value);
      // eslint-disable-next-line no-restricted-syntax
      for (const item of tableData) {
        if (item.id && item.id.length === 42) item.id = '';
      }
      if (validateForm()) {
        await batchCreateOrUpdateDictItem(pageData.value.pId, tableData);
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
const deleteItemColumn = (key: string) => {
  const indexs = [];
  const tableData = resetTree([], columnData.value);
  for (let i = 0; i < tableData.length; i += 1) {
    if (tableData[i].id === key) {
      indexs.push(i);
    }
  }
  for (let i = 0; i < indexs.length; i += 1) {
    tableData.splice(indexs[i], 1);
  }
  selectedKeys.value = [];
  columnData.value = formatTree([], tableData);
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

.affix-form {
  padding: 18px 10px 10px 5px;
  width: 456px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}
</style>