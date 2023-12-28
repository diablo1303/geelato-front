<script lang="ts">
export default {
  name: 'DictPopver'
}
</script>
<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import useLoading from "@/hooks/loading";
import {FormInstance, TableData, Notification} from "@arco-design/web-vue";
import {createDictAndItems, QueryDictForm, QueryDictItemForm, validateDictCode} from "@/api/security";
import {generateRandom} from "@/utils/strings";

const {t} = useI18n();
const route = useRoute();
const {loading, setLoading} = useLoading(false);
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || ''
});

const emits = defineEmits(['update:modelValue', 'save']);
const props = defineProps({
  modelValue: {type: String, default: ''},
});
const mv = ref({});

/**
 * base64编码字符串文件值变更
 */
watch(() => mv.value, () => {

}, {deep: true});

const validateForm = ref<FormInstance>();
const generateFormData = (): QueryDictForm => {
  return {
    id: '',
    tenantCode: routeParams.value.tenantCode,
    appId: routeParams.value.appId,
    dictName: '',
    dictCode: '',
    dictRemark: '',
    enableStatus: 1,
    seqNo: 999
  };
}
const formData = ref(generateFormData());
/**
 * 唯一性校验
 * @param value
 * @param callback
 */
const validateCode = async (value: any, callback: any) => {
  try {
    const {data} = await validateDictCode(formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

const columnData = ref<QueryDictItemForm[]>([]);
const columnTitle = reactive([]);

const validateDictForm = () => {
  let isValid = true;
  if (columnData.value && columnData.value.length > 0) {
    const itemCodes: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of columnData.value) {
      if (!item.itemCode || !item.itemName) {
        isValid = false;
        Notification.warning(t('security.dictItem.index.popover.warning1'));
        break;
      }
      if (itemCodes.includes(item.itemCode)) {
        isValid = false;
        Notification.warning(`${t('security.dictItem.index.popover.warning2')}【${item.itemCode}】！`);
        break;
      } else {
        itemCodes.push(item.itemCode);
      }
    }
  }

  return isValid;
}
const addTable = (e: Event) => {
  if (validateDictForm()) {
    columnData.value.push({
      id: generateRandom(),
      itemName: '',
      itemCode: '',
      itemRemark: ''
    } as QueryDictItemForm);
  }
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
}
const saveClick = async (ev?: MouseEvent) => {
  setLoading(true);
  const res = await validateForm.value?.validate();
  if (!res && validateDictForm()) {
    try {
      formData.value.dictItems = columnData.value;
      const {data} = await createDictAndItems(formData.value);
      emits("save", formData.value);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  } else {
    setLoading(false);
  }
}
</script>
<template>
  <a-layout style="height: 400px;">
    <a-layout-header>
      <strong style="font-size: 16px;">{{ $t('security.dictItem.index.popover.title') }}</strong>
      <a-divider style="margin: 12px 0;"/>
    </a-layout-header>
    <a-layout style="flex-direction: row;">
      <a-layout-content style="width: 30%;">
        <a-divider orientation="left">{{ $t('security.dictItem.index.popover.dict.title') }}</a-divider>
        <a-form ref="validateForm" :model="formData" class="form">
          <a-form-item :label="$t('security.dict.index.form.dictName')"
                       :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
                       field="dictName">
            <a-input v-model.trim="formData.dictName" :max-length="32"/>
          </a-form-item>
          <a-form-item :label="$t('security.dict.index.form.dictCode')"
                       :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
                       field="dictCode">
            <a-input v-model.trim="formData.dictCode" :max-length="32"/>
          </a-form-item>
          <a-form-item :label="$t('security.dict.index.form.dictRemark')" field="dictRemark">
            <a-textarea v-model="formData.dictRemark" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          </a-form-item>
        </a-form>
      </a-layout-content>
      <a-divider direction="vertical"/>
      <a-layout-content style="width: 68%;">
        <a-divider orientation="left">
          {{ $t('security.dictItem.index.popover.item.title') }}
          <a-tooltip :content="$t('searchTable.operation.create')">
            <a-button type="text" @click="addTable($event)">
              <template #icon>
                <icon-plus/>
              </template>
            </a-button>
          </a-tooltip>
        </a-divider>
        <a-table
            :bordered="{cell:true}"
            :columns="columnTitle"
            :data="(columnData as TableData[])"
            :draggable="{ type: 'handle', width: 30 }"
            :pagination="false"
            :scroll="{x: '100%',y: 225}"
            :scrollbar="true"
            :stripe="true"
            column-resizable
            row-key="id"
            size="mini" @change="handleChange">
          <template #columns>
            <a-table-column :ellipsis="true" :tooltip="true" :width="150" align="center" data-index="itemName">
              <template #title>
                <strong style="color: rgb(var(--danger-6)); font-size: 12px;line-height: 1;">*</strong>
                {{ $t('security.dictItem.index.form.itemName') }}
              </template>
              <template #cell="{record}">
                <a-input v-model.trim="record.itemName" :max-length="32"/>
              </template>
            </a-table-column>
            <a-table-column :ellipsis="true" :tooltip="true" :width="150" align="center" data-index="itemCode">
              <template #title>
                <strong style="color: rgb(var(--danger-6)); font-size: 12px;line-height: 1;">*</strong>
                {{ $t('security.dictItem.index.form.itemCode') }}
              </template>
              <template #cell="{record}">
                <a-textarea v-model.trim="record.itemCode" :auto-size="{minRows:1,maxRows:4}" :max-length="512" show-word-limit/>
              </template>
            </a-table-column>
            <a-table-column :ellipsis="true" :tooltip="true" :width="200" align="center" data-index="itemRemark">
              <template #title>
                {{ $t('security.dictItem.index.form.itemRemark') }}
              </template>
              <template #cell="{record}">
                <a-textarea v-model="record.itemRemark" :auto-size="{minRows:1,maxRows:3}" :max-length="512" show-word-limit/>
              </template>
            </a-table-column>
            <a-table-column :title="$t('model.column.index.form.operations')" :width="60" align="center" data-index="operations" fixed="right">
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
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      <a-divider style="margin: 12px 0;"/>
      <a-space style="display: flex;align-items: center;justify-content: end;">
        <a-button type="primary" :loading="loading" @click="saveClick($event)">
          {{ $t('security.dictItem.index.popover.ok') }}
        </a-button>
      </a-space>
    </a-layout-footer>
  </a-layout>
</template>
<style lang="less" scoped>
.arco-layout-content {
  flex: auto !important;
}
</style>