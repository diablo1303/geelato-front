<script lang="ts">
export default {
  name: 'ImportBusinessMeta'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {FormInstance, TableColumnData} from "@arco-design/web-vue";
import {useRoute} from "vue-router";
import {generateRandom} from "@/utils/strings";
import {QueryDictForm, QueryDictItemForm, queryDicts, queryItemByDictCode} from "@/api/security";
import {QueryTableColumnForm, queryTableColumns, QueryTableForm, queryTables} from "@/api/model";
import {PageQueryRequest} from "@/api/base";
import {cloneDeep} from "lodash";
import {BusinessMetaData, businessMetaEvaluationOptions, businessRuleDataTypeOptions, BusinessTypeData} from "./template";

const route = useRoute();
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || ''
});

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<BusinessMetaData>, default: []},
  businessTypeData: {type: Array<BusinessTypeData>, default: []},
  disabled: {type: Boolean, default: false},
});
// 列表参数
type Column = TableColumnData & { checked?: true };
const cloneColumns = ref<Column[]>([]);
const renderData = ref<BusinessMetaData[]>([]);
/**
 * 初始化
 */
const generateFormData = (): BusinessMetaData => {
  return {
    tableName: '',
    columnName: '',
    evaluation: '',
    constValue: '',
    variableValue: '',
    expression: '',
    dictCode: '',
    primaryValue: '',
    remark: '',
    columnNameOptions: [],
    primaryTableName: '',
    primaryColumnNameGoal: '',
    primaryColumnNameMatch: [],
    primaryValueOptions: [],
    sign: '',
  };
};
// 表单参数
const visibleModel = ref(false);
const formData = ref(generateFormData());
const validateForm = ref<FormInstance>();
const businessTypeData = ref<BusinessTypeData[]>([]);
const businessTypeNameData = ref<string[]>([]);
const selectDictionaryOptions = ref<QueryDictForm[]>([]);
const selectEntityOptions = ref<QueryTableForm[]>([]);
/**
 * 获取数据字典
 */
const getSelectDictionaryOptions = async () => {
  try {
    const {data} = await queryDicts({
      enableStatus: 1, ...routeParams.value
    } as unknown as QueryDictForm);
    selectDictionaryOptions.value = data || [];
  } catch (err) {
    selectDictionaryOptions.value = [];
  }
}
getSelectDictionaryOptions();
/**
 * 获取模型
 */
const getSelectEntityOptions = async () => {
  try {
    const {data} = await queryTables({
      enableStatus: 1, tableType: 'table', ...routeParams.value
    } as unknown as PageQueryRequest);
    selectEntityOptions.value = data;
  } catch (err) {
    selectEntityOptions.value = [];
  }
}
getSelectEntityOptions();
/**
 * 获取模型字段
 * @param entityName
 * @param successCallBack
 * @param failCallBack
 * @param params
 */
const getSelectEntityColumnOptions = async (entityName: string, successCallBack: any, failCallBack: any, params: PageQueryRequest = {
  enableStatus: 1, tableName: entityName, ...routeParams.value
} as unknown as PageQueryRequest) => {
  try {
    const {data} = await queryTableColumns(params);
    if (successCallBack && typeof successCallBack === 'function') successCallBack(data);
  } catch (err) {
    if (failCallBack && typeof failCallBack === 'function') failCallBack(err);
  }
}

/**
 * 列表排序
 * @param _data
 */
const handleChange = (_data: any[]) => {
  renderData.value = _data;
}
/**
 * 列表编辑
 * @param data
 */
const listEdit = (data: BusinessMetaData) => {
  formData.value = {...data};
  // 模型名称
  if (formData.value.tableName) {
    getSelectEntityColumnOptions(formData.value.tableName, (result: QueryTableColumnForm[]) => {
      formData.value.columnNameOptions = result;
    }, () => {
      formData.value.columnNameOptions = [];
    });
  }
  // 模型取值
  if (formData.value.primaryTableName) {
    getSelectEntityColumnOptions(formData.value.primaryTableName, (result: QueryTableColumnForm[]) => {
      formData.value.primaryValueOptions = result;
    }, () => {
      formData.value.primaryValueOptions = [];
    });
  }

  visibleModel.value = true;
}
/**
 * 列表删除
 * @param data
 */
const listDelete = (data: BusinessMetaData) => {
  // 匹配
  const index: number[] = [];
  for (let i = 0; i < renderData.value.length; i += 1) {
    if (renderData.value[i].sign === data.sign) {
      index.push(i);
    }
  }
  // 排序，需要从最高的索引开始删除
  index.sort((a, b) => b - a);
  // 删除
  index.forEach(i => {
    renderData.value.splice(i, 1);
  });
}

/**
 * 打开表单，新增
 * @param ev
 */
const handleModelOpen = (ev?: MouseEvent) => {
  formData.value = generateFormData();
  visibleModel.value = true;
}
/**
 * 关闭表单，验证表单，保存值
 * @param done
 */
const handleModelOk = async (done: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    if (formData.value.sign) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of renderData.value) {
        if (formData.value.sign === item.sign) {
          Object.assign(item, formData.value);
          break;
        }
      }
    } else {
      formData.value.sign = generateRandom(6);
      renderData.value.push(formData.value);
    }
  }
  done(!res);
};
/**
 * 关闭表单，取消
 * @param e
 */
const handleModelCancel = async (e: Event) => {
  visibleModel.value = false;
  await validateForm.value?.resetFields();
}

/**
 * 模型变更，加载模型字段
 */
const tableNameChange = () => {
  formData.value.columnName = '';
  formData.value.columnNameOptions = [];
  if (formData.value.tableName) {
    getSelectEntityColumnOptions(formData.value.tableName, (result: QueryTableColumnForm[]) => {
      formData.value.columnNameOptions = result;
    }, () => {
      formData.value.columnNameOptions = [];
    });
  }
}
const primaryValueColumnChange = () => {
  if (formData.value.primaryTableName && formData.value.primaryColumnNameGoal &&
    formData.value.primaryColumnNameMatch && formData.value.primaryColumnNameMatch.length > 0) {
    formData.value.primaryValue = `${formData.value.primaryTableName}:${formData.value.primaryColumnNameGoal}|${formData.value.primaryColumnNameMatch.join(',')}`;
  } else {
    formData.value.primaryValue = '';
  }
}
const primaryValueEntityChange = () => {
  formData.value.primaryColumnNameGoal = '';
  formData.value.primaryColumnNameMatch = [];
  formData.value.primaryValueOptions = [];
  if (formData.value.primaryTableName) {
    getSelectEntityColumnOptions(formData.value.primaryTableName, (result: QueryTableColumnForm[]) => {
      formData.value.primaryValueOptions = result;
      primaryValueColumnChange();
    }, () => {
      formData.value.primaryValueOptions = [];
      primaryValueColumnChange();
    });
  } else {
    primaryValueColumnChange();
  }
}

/**
 * 输入
 */
watch(() => props.modelValue, () => {
  const data = cloneDeep(props.modelValue);
  if (data && data.length > 0) {
    data.forEach((item) => {
      item.sign = generateRandom(6);
      if (item.primaryValue) {
        const tableIndex = item.primaryValue.indexOf(':');
        const columnIndex = item.primaryValue.indexOf('|');
        if (tableIndex > 0 && columnIndex > 0) {
          item.primaryTableName = item.primaryValue.substring(0, tableIndex) || '';
          item.primaryColumnNameGoal = item.primaryValue.substring(tableIndex + 1, columnIndex) || '';
          item.primaryColumnNameMatch = (item.primaryValue.substring(columnIndex + 1, item.primaryValue.length) || '').split(',') || [];
          if (!item.primaryTableName || !item.primaryColumnNameGoal || !item.primaryColumnNameMatch || item.primaryColumnNameMatch.length <= 0) {
            item.primaryValue = '';
          }
        }
      }
    });
  }
  renderData.value = data || [];
}, {deep: true, immediate: true});
watch(() => props.businessTypeData, () => {
  businessTypeNameData.value = [];
  businessTypeData.value = props.businessTypeData;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of businessTypeData.value) {
    businessTypeNameData.value.push(item.name);
  }
}, {deep: true, immediate: true});
/**
 * 输出
 */
watch(() => renderData.value, () => {
  emits("update:modelValue", renderData.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-collapse-item :key="3" header="数据保存配置">
    <template #extra>
      <a-button v-if="!disabled" type="primary" @click.stop="handleModelOpen($event)">
        <template #icon>
          <icon-plus/>
        </template>
        新增
      </a-button>
    </template>
    <a-table :bordered="{cell:true}"
             :columns="(cloneColumns as TableColumnData[])"
             :data="renderData"
             :draggable="{type:'handle',width:40}"
             :pagination="false"
             :scroll="{x:2000,y:400}"
             :scrollbar="true"
             :stripe="true"
             column-resizable
             row-key="name" @change="handleChange">
      <template #columns>
        <a-table-column :width="250" data-index="tableName" title="模型名称">
          <template #cell="{ record }">
            {{ record.tableName }}
          </template>
        </a-table-column>
        <a-table-column :width="250" data-index="columnName" title="字段名称">
          <template #cell="{ record }">
            {{ record.columnName }}
          </template>
        </a-table-column>
        <a-table-column :width="200" data-index="evaluation" title="取值方式">
          <template #cell="{ record }">
            {{ record.evaluation }}
          </template>
        </a-table-column>
        <a-table-column :width="150" data-index="constValue" title="常量取值">
          <template #cell="{ record }">
            {{ record.constValue }}
          </template>
        </a-table-column>
        <a-table-column :width="150" data-index="variableValue" title="变量取值">
          <template #cell="{ record }">
            {{ record.variableValue }}
          </template>
        </a-table-column>
        <a-table-column :width="250" data-index="expression" title="表达式取值">
          <template #cell="{ record }">
            {{ record.expression }}
          </template>
        </a-table-column>
        <a-table-column :width="200" data-index="dictCode" title="数据字典取值">
          <template #cell="{ record }">
            {{ record.dictCode }}
          </template>
        </a-table-column>
        <a-table-column :width="250" data-index="primaryValue" title="模型取值">
          <template #cell="{ record }">
            {{ record.primaryValue }}
          </template>
        </a-table-column>
        <a-table-column :width="250" data-index="remark" title="备注">
          <template #cell="{ record }">
            {{ record.remark }}
          </template>
        </a-table-column>
        <a-table-column v-if="!disabled" :width="150" align="center" data-index="operations" fixed="right" title="操作">
          <template #cell="{ record }">
            <a-button size="small" title="编辑" type="text" @click="listEdit(record)">
              <icon-edit/>
            </a-button>
            <a-button size="small" title="删除" type="text" @click="listDelete(record)">
              <icon-delete/>
            </a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <a-modal
        v-model:visible="visibleModel"
        title="数据保存配置"
        @cancel="handleModelCancel($event)"
        @before-ok="handleModelOk">
      <a-form ref="validateForm" :model="formData">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="tableName" label="模型名称">
          <a-select v-model="formData.tableName" allow-search @change="tableNameChange">
            <a-option v-for="(item,index) of selectEntityOptions" :key="index" :label="`${item.title}[${item.entityName}]`" :value="item.entityName"/>
          </a-select>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="columnName" label="字段名称">
          <a-select v-model="formData.columnName" allow-search>
            <a-option v-for="(item,index) of formData.columnNameOptions" :key="index" :label="`${item.title}[${item.fieldName}]`" :value="item.fieldName"/>
          </a-select>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="evaluation" label="取值方式">
          <a-select v-model="formData.evaluation" allow-search>
            <a-option v-for="(item,index) in businessMetaEvaluationOptions" :key="index" :label="item.label" :value="item.value as string"/>
          </a-select>
        </a-form-item>
        <a-form-item v-if="['CONST'].includes(formData.evaluation)" field="constValue" label="常量取值">
          <a-input v-model="formData.constValue"/>
        </a-form-item>
        <a-form-item v-if="['VARIABLE','JS_EXPRESSION','CHECKBOX','DICTIONARY','PRIMARY_KEY','PRIMITIVE'].includes(formData.evaluation)"
                     field="variableValue" label="变量取值">
          <a-select v-model="formData.variableValue" allow-clear allow-search>
            <a-option v-for="(item,index) in businessTypeData" :key="index" :label="item.name" :value="item.name"/>
          </a-select>
        </a-form-item>
        <a-form-item v-if="['JS_EXPRESSION'].includes(formData.evaluation)" field="expression" label="表达式取值">
          <a-input v-model="formData.expression"/>
        </a-form-item>
        <a-form-item v-if="['CHECKBOX','DICTIONARY'].includes(formData.evaluation)" field="dictCode" label="数据字典取值">
          <a-select v-model="formData.dictCode" allow-clear allow-search>
            <a-option v-for="(item,index) of selectDictionaryOptions" :key="index" :label="`${item.dictName}[${item.dictCode}]`" :value="item.dictCode"/>
          </a-select>
        </a-form-item>
        <a-form-item v-if="['PRIMARY_KEY'].includes(formData.evaluation)" field="columnNameArr" label="模型取值">
          <a-space direction="vertical" style="width:100%">
            <div>{{ formData.primaryValue }}</div>
            <a-select v-model="formData.primaryTableName" allow-clear allow-search @change="primaryValueEntityChange">
              <a-option v-for="(item,index) of selectEntityOptions" :key="index" :label="`${item.title}[${item.entityName}]`" :value="item.entityName"/>
            </a-select>
            <a-select v-model="formData.primaryColumnNameGoal" allow-clear allow-search @change="primaryValueColumnChange">
              <a-option v-for="(item,index) of formData.primaryValueOptions" :key="index" :label="`${item.title}[${item.fieldName}]`" :value="item.fieldName"/>
            </a-select>
            <a-select v-model="formData.primaryColumnNameMatch" allow-clear allow-search multiple @change="primaryValueColumnChange">
              <a-option v-for="(item,index) of formData.primaryValueOptions" :key="index" :label="`${item.title}[${item.fieldName}]`" :value="item.fieldName"/>
            </a-select>
          </a-space>
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea v-model="formData.remark" :auto-size="{minRows:2,maxRows:4}" show-word-limit/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-collapse-item>
</template>

<style lang="less" scoped>

</style>