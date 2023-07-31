<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      :cancel-text="$t('security.dictItem.index.model.cancel.text')"
      :footer="pageData.button"
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
          <a-button type="primary" @click="addTable($event)">
            <template #icon>
              <icon-plus/>
            </template>
            {{ $t('searchTable.operation.create') }}
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
          <a-button type="outline" @click="copyFilling($event)">
            <template #icon>
              <icon-copy/>
            </template>
            复制(JSON)
          </a-button>
          <a-button type="outline" @click="batchDeletes($event)">
            <template #icon>
              <icon-delete/>
            </template>
            批量删除
          </a-button>
          <a-dropdown-button>
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
          <a-dropdown-button>
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
        :draggable="{ type: 'handle', width: 30 }"
        :pagination="false"
        :row-selection="rowSelection"
        :stripe="true"
        column-resizable
        row-key="id"
        size="small" @change="handleChange">
      <template #columns>
        <a-table-column :ellipsis="true" :title="$t('security.dictItem.index.form.itemName')" :tooltip="true" :width="170" data-index="itemName">
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
        <a-table-column :title="$t('model.column.index.form.operations')" :width="80" align="center"
                        data-index="operations" fixed="right">
          <template #cell="{record}">
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
import {Message, Notification} from "@arco-design/web-vue";
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
  {title: '备注', dataIndex: 'itemRemark',},
  {title: '创建时间', dataIndex: 'createAt',},
  {title: '操作', dataIndex: 'operations'}
]);
// 显示隐藏
const visibleModel = ref(false);
const selectedKeys = ref([]);
const rowSelection = reactive({type: 'checkbox', showCheckedAll: true, onlyCurrent: true});
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
const copyEvent = (value: string) => {
  const input = document.createElement('textarea');
  input.value = value; // 将要复制的文本内容赋值给textarea元素的value属性
  document.body.appendChild(input); // 将textarea元素添加到页面中
  input.select(); // 选中textarea元素中的文本内容
  document.execCommand('copy'); // 执行复制命令
  document.body.removeChild(input); // 将textarea元素从页面中移除
  Message.success({content: '复制成功！', duration: 5 * 1000});// 弹出提示框表示复制成功
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
    for (let i = 0; i < indexs.length; i += 1) {
      columnData.value.splice(indexs[i], 1);
    }
    selectedKeys.value = [];
  }
}
const addTable = (e: Event) => {
  if (validateForm()) {
    columnData.value.push({
      id: UUID(),
      dictId: pageData.value.pId,
      itemName: '',
      itemCode: '',
      enableStatus: 1
    } as QueryDictItemForm);
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
    columnData.value.push({
      id: UUID(),
      dictId: pageData.value.pId,
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
        if (item.id && item.id.length === 42) item.id = '';
      }
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
const deleteItemColumn = (key: string) => {
  const indexs = [];
  for (let i = 0; i < columnData.value.length; i += 1) {
    if (columnData.value[i].id === key) {
      indexs.push(i);
    }
  }
  for (let i = 0; i < indexs.length; i += 1) {
    columnData.value.splice(indexs[i], 1);
  }
  selectedKeys.value = [];
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