<script lang="ts">
export default {
  name: 'GlModelTableForeignForm'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {FormInstance, Modal} from "@arco-design/web-vue";
import {modelApi, utils} from "@geelato/gl-ui";
import type {QueryTableColumnForm, QueryTableForeignForm, QueryTableForm} from '@geelato/gl-ui';
import {enableStatusOptions} from "./searchTable";

type PageParams = {
  connectId: string; // 数据库链接id
  mainTable: string; // 模型名称
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 表单状态
  formCol: {type: Number, default: 1},// 表单列数
  title: {type: String, default: '模型外键'},// 表达标题
  width: {type: String, default: ''},// 表单宽度
});

const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
const validateForm = ref<FormInstance>();
const visibleForm = ref<boolean>(false);
const tableOptions = ref<QueryTableForm[]>([]);
const mainTableColOptions = ref<QueryTableColumnForm[]>([]);
const foreignTableColOptions = ref<QueryTableColumnForm[]>([]);

const generateFormData = (): QueryTableForeignForm => {
  return {
    id: props.modelValue || '',
    mainTable: props.parameter.mainTable || '', // 主表表名
    mainTableCol: '', // 主表表名字段
    foreignTable: '', // 外键关联表表名
    foreignTableCol: '', // 外键关联表字段
    updateAction: 'NO ACTION',
    deleteAction: 'NO ACTION',
    enableStatus: 1, // 状态
    description: '',
    seqNo: 999,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QueryTableForeignForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await modelApi.createOrUpdateTableForeign(params);
      if (successBack && typeof successBack === 'function') successBack(data);
    } catch (err) {
      if (failBack && typeof failBack === 'function') failBack(err);
    }
  } else if (failBack && typeof failBack === 'function') failBack();
};
/**
 * 获取单条数据接口
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await modelApi.getTableForeign(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};
/**
 * 获取模型
 * @param params
 */
const fetchTables = async (params?: Record<string, any>) => {
  try {
    const {data} = await modelApi.queryTables({
      ...params,
      enableStatus: 1, tableType: 'table', connectId: props.parameter.connectId
    });
    tableOptions.value = data;
  } catch (err) {
    tableOptions.value = [];
  }
}
/**
 * 获取模型字段
 * @param params
 */
const fetchTableColumns = async (params?: Record<string, any>): Promise<QueryTableColumnForm[]> => {
  let columnOptions: QueryTableColumnForm[] = [];
  try {
    const {data} = await modelApi.queryTableColumns({...params, enableStatus: 1});
    columnOptions = data;
  } catch (err) {
    columnOptions = [];
  }

  return columnOptions;
}

/**
 * 省略内容完全展示
 * @param content
 */
const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
/**
 * 重置验证信息
 */
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, (data: QueryTableForeignForm) => {
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

const mainTableChange = (value: string) => {
  const name = formData.value.mainTable;
  if (name) {
    fetchTableColumns({tableName: name}).then((data) => {
      mainTableColOptions.value = data;
    });
  } else {
    mainTableColOptions.value = [];
  }
}
const foreignTableChange = (value: any) => {
  if (value) {
    formData.value.foreignTableCol = '';
    foreignTableColOptions.value = [];
    fetchTableColumns({tableName: value}).then((data) => {
      foreignTableColOptions.value = data;
    });
  }
}


watch(() => props, () => {
  if (props.visible === true) {
    // 表单
    fetchTables();
    // 表单数据重置
    formData.value = generateFormData();
    if (['add'].includes(props.formState) && props.parameter.mainTable) {
      mainTableChange(formData.value.mainTable);
    }
    // 重置验证
    resetValidate();
    // 编辑、查看 状态 查询数据
    if (['edit', 'view'].includes(props.formState) && props.modelValue) {
      getData(props.modelValue, (data: QueryTableForeignForm) => {
        mainTableChange(data.mainTable);
        foreignTableChange(data.foreignTable);
        data.seqNo = Number(data.seqNo);
        formData.value = data;
      });
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
  <a-modal v-model:visible="visibleForm" :footer="formState!=='view'" :title="title" :width="width"
           cancel-text="取消" ok-text="确认" title-align="start"
           @cancel="handleModelCancel($event)" @before-ok="handleModelOk">
    <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
      <a-row :gutter="wrapperCol">
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="mainTable" label="主表表名">
            <a-select v-if="formState!=='view'" v-model="formData.mainTable" :disabled="props.parameter.mainTable!==''" allow-search
                      @change="mainTableChange(formData.mainTable)">
              <a-option v-for="item of tableOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.entityName"/>
            </a-select>
            <span v-else>{{ formData.mainTable }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="mainTableCol" label="主表字段">
            <a-select v-if="formState!=='view'" v-model="formData.mainTableCol" allow-search>
              <a-option v-for="item of mainTableColOptions" :key="item.id" :label="`${item.title}[${item.name}]`" :value="item.name"/>
            </a-select>
            <span v-else>{{ formData.mainTableCol }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="foreignTable" label="外表表名">
            <a-select v-if="formState!=='view'" v-model="formData.foreignTable" allow-search @change="foreignTableChange">
              <a-option v-for="item of tableOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.entityName"/>
            </a-select>
            <span v-else>{{ formData.foreignTable }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="foreignTableCol" label="外表字段">
            <a-select v-if="formState!=='view'" v-model="formData.foreignTableCol" allow-search>
              <a-option v-for="item of foreignTableColOptions" :key="item.id" :label="`${item.title}[${item.name}]`" :value="item.name"/>
            </a-select>
            <span v-else>{{ formData.foreignTableCol }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="enableStatus" label="状态">
            <a-select v-if="formState!=='view'" v-model="formData.enableStatus">
              <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="item.label" :value="item.value"/>
            </a-select>
            <span v-else>{{ utils.getOptionLabel(formData.enableStatus, enableStatusOptions) }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="seqNo" label="排序">
            <a-input-number v-if="formState!=='view'" v-model="formData.seqNo" :max="999999999" :min="1" :precision="0" placeholder="长度[0,999999999]"/>
            <span v-else>{{ formData.seqNo }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="textareaTotal = (labelCol+wrapperCol)/((formCol%2===0)?formCol/2:1)">
          <a-form-item :label-col-props="{ span: labelCol/formCol }" :wrapper-col-props="{ span: textareaTotal-(labelCol/formCol) }"
                       field="description" label="备注">
            <a-textarea v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
            <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
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
</style>