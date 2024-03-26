<script lang="ts">
export default {
  name: 'GlDictPopver'
}
</script>
<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {FormInstance, TableData} from "@arco-design/web-vue";
import {modelApi, type QueryMultiComponentForm, type QueryTableColumnForm, securityApi, useGlobal, utils} from "@geelato/gl-ui";
import type {QueryDictForm, QueryDictItemForm} from "@geelato/gl-ui";

type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 表单状态
  title: {type: String, default: '数据字典'},// 表达标题
  width: {type: String, default: ''},// 表单宽度
});

const global = useGlobal();
const validateForm = ref<FormInstance>();
const visibleForm = ref<boolean>(false);
const columnTitle = reactive([]);
const columnData = ref<QueryDictItemForm[]>([]);

const generateFormData = (): QueryDictForm => {
  return {
    id: props.modelValue || '',
    dictName: '',
    dictCode: '',
    dictRemark: '',
    enableStatus: 1,
    seqNo: 999,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
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
    const {data} = await securityApi.validateDictCode(formData.value);
    if (!data) callback('不能重复');
  } catch (err) {
    console.log(err);
  }
}

const validateDictForm = () => {
  let isValid = true;
  if (columnData.value && columnData.value.length > 0) {
    const itemCodes: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of columnData.value) {
      if (!item.itemCode || !item.itemName) {
        isValid = false;
        global.$message.warning({content: '请补充字典项的必填项！'});
        break;
      }
      if (itemCodes.includes(item.itemCode)) {
        isValid = false;
        global.$message.warning({content: `${item.itemCode}，字典项的编码不能重复！`});
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
      id: utils.generateRandom(),
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

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QueryDictForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    params.dictItems = columnData.value;
    try {
      await securityApi.createDictAndItems(params);
      if (successBack && typeof successBack === 'function') successBack(params);
    } catch (err) {
      if (failBack && typeof failBack === 'function') failBack(err);
    }
  } else if (failBack && typeof failBack === 'function') failBack();
}

/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, (data: QueryDictForm) => {
    done();
    visibleForm.value = false;
    emits('saveSuccess', data, props.formState);
  }, () => {
    done(false)
  });
};
/**
 * 取消修改按钮
 * @param ev
 */
const handleModelCancel = (ev: MouseEvent) => {
  visibleForm.value = false;
}

watch(() => props, () => {
  if (props.visible === true) {
    // 表单数据重置
    columnData.value = [];
    formData.value = generateFormData();
    formData.value.dictItems = columnData.value;
    // 编辑、查看 状态 查询数据
    if (['edit', 'view'].includes(props.formState) && props.modelValue) {

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
  <a-modal v-model:visible="visibleForm" :footer="formState!=='view'" :title="title"
           :width="width || ''" cancel-text="取消" ok-text="确定" title-align="start"
           @cancel="handleModelCancel($event)" @before-ok="handleModelOk">
    <a-layout style="height: 300px;">
      <a-layout style="flex-direction: row;">
        <a-layout-content style="width: 30%;">
          <a-divider orientation="left">字典</a-divider>
          <a-form ref="validateForm" :model="formData" class="form">
            <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="dictName" label="名称">
              <a-input v-model.trim="formData.dictName" :max-length="32"/>
            </a-form-item>
            <a-form-item :rules="[{required: true,message: '这是必填项'},{validator:validateCode}]" field="dictCode" label="编码">
              <a-input v-model.trim="formData.dictCode" :max-length="32"/>
            </a-form-item>
            <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="seqNo" label="排序">
              <a-input-number v-model="formData.seqNo" :max="999999999" :min="1" :precision="0" placeholder="长度 [0,999999999]"/>
            </a-form-item>
            <a-form-item field="dictRemark" label="备注">
              <a-textarea v-model="formData.dictRemark" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
            </a-form-item>
          </a-form>
        </a-layout-content>
        <a-divider direction="vertical"/>
        <a-layout-content style="width: 68%;">
          <a-divider orientation="left">
            字典项
            <a-tooltip :content="$t('searchTable.operation.create')">
              <a-button type="text" @click="addTable($event)">
                <template #icon>
                  <gl-iconfont type="gl-plus-circle"/>
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
              :scroll="{x: '100%',y: 240}"
              :scrollbar="true"
              :stripe="true"
              column-resizable
              row-key="id"
              size="mini" @change="handleChange">
            <template #columns>
              <a-table-column :ellipsis="true" :tooltip="true" :width="150" align="center" data-index="itemName">
                <template #title>
                  <strong style="color: rgb(var(--danger-6)); font-size: 12px;line-height: 1;">*</strong>
                  名称
                </template>
                <template #cell="{record}">
                  <a-input v-model.trim="record.itemName" :max-length="32"/>
                </template>
              </a-table-column>
              <a-table-column :ellipsis="true" :tooltip="true" :width="150" align="center" data-index="itemCode">
                <template #title>
                  <strong style="color: rgb(var(--danger-6)); font-size: 12px;line-height: 1;">*</strong>
                  编码
                </template>
                <template #cell="{record}">
                  <a-textarea v-model.trim="record.itemCode" :auto-size="{minRows:1,maxRows:4}" :max-length="512" show-word-limit/>
                </template>
              </a-table-column>
              <a-table-column :ellipsis="true" :tooltip="true" :width="200" align="center" data-index="itemRemark">
                <template #title>
                  备注
                </template>
                <template #cell="{record}">
                  <a-textarea v-model="record.itemRemark" :auto-size="{minRows:1,maxRows:3}" :max-length="512" show-word-limit/>
                </template>
              </a-table-column>
              <a-table-column :width="60" align="center" data-index="operations" fixed="right" title="操作">
                <template #cell="{record}">
                  <a-button status="danger" type="text" @click="deleteItemColumn(record.id)">
                    <template #icon>
                      <gl-iconfont type="gl-delete"/>
                    </template>
                  </a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-modal>
</template>
<style lang="less" scoped>
.arco-layout-content {
  flex: auto !important;
}
</style>