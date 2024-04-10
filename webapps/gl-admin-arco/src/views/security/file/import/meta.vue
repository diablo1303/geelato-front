<script lang="ts">
export default {
  name: 'ImportBusinessMeta'
};
</script>

<script lang="ts" setup>
import {ref, toRefs, watch} from "vue";
import {cloneDeep} from "lodash";
import {generateRandom} from "@/utils/strings";
import {getOptionLabel, PageQueryRequest} from "@/api/base";
import {FormInstance, TableColumnData} from "@arco-design/web-vue";
import {QueryDictForm, queryDicts} from "@/api/security";
import {QueryTableColumnForm, queryTableColumns, QueryTableForm, queryTables} from "@/api/model";
import {BusinessMetaData, businessMetaEvaluationOptions, BusinessTypeData} from "./template";

// 页面所需 参数
type PageParams = { appId?: string; tenantCode?: string; }

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<BusinessMetaData>, default: []},
  businessTypeData: {type: Array<BusinessTypeData>, default: []},
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  disabled: {type: Boolean, default: false},
  height: {type: Number, default: 480},
});

const {businessTypeData} = toRefs(props);

// 列表参数
const scrollbar = ref(true);
const scroll = ref({x: 1940, y: props.height - 125});
const renderData = ref<BusinessMetaData[]>([]);
// 表单参数
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
const formData = ref(generateFormData());
const validateForm = ref<FormInstance>();
const visibleModel = ref(false);
const businessTypeNameData = ref<string[]>([]);
const selectDictionaryOptions = ref<QueryDictForm[]>([]);
const selectEntityOptions = ref<QueryTableForm[]>([]);

/**
 * 获取数据字典
 */
const getSelectDictionaryOptions = async () => {
  try {
    const {data} = await queryDicts({
      enableStatus: 1,
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || '',
    } as unknown as QueryDictForm);
    selectDictionaryOptions.value = data || [];
  } catch (err) {
    selectDictionaryOptions.value = [];
  }
}
/**
 * 获取模型
 */
const getSelectEntityOptions = async () => {
  try {
    const {data} = await queryTables({
      enableStatus: 1,
      tableType: 'table',
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || '',
    } as unknown as PageQueryRequest);
    selectEntityOptions.value = data;
  } catch (err) {
    selectEntityOptions.value = [];
  }
}
/**
 * 获取模型字段
 * @param entityName
 * @param successCallBack
 * @param failCallBack
 * @param params
 */
const getSelectEntityColumnOptions = async (entityName: string, successCallBack: any, failCallBack: any, params: PageQueryRequest = {
  enableStatus: 1, tableName: entityName,
  appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || '',
} as unknown as PageQueryRequest) => {
  try {
    const {data} = await queryTableColumns(params);
    if (successCallBack && typeof successCallBack === 'function') successCallBack(data);
  } catch (err) {
    if (failCallBack && typeof failCallBack === 'function') failCallBack(err);
  }
}

/**
 * 值变化，传递给父组件
 * 排序、新增、修改、删除
 */
const watchRenderData = () => {
  console.log('watch:renderData', renderData.value);
  const data = cloneDeep(renderData.value);
  if (data && data.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      delete item.columnNameOptions;
      delete item.primaryTableName;
      delete item.primaryColumnNameGoal;
      delete item.primaryColumnNameMatch;
      delete item.primaryValueOptions;
      delete item.sign;
    }
  }
  emits("update:modelValue", data);
}

/**
 * 列表排序
 * @param _data
 */
const handleChange = (_data: any[]) => {
  renderData.value = _data;
  watchRenderData();
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
  // 打开表单
  visibleModel.value = true;
}
/**
 * 列表删除
 * @param data
 */
const listDelete = (data: BusinessMetaData) => {
  // 匹配
  const indexs: number[] = [];
  for (let i = 0; i < renderData.value.length; i += 1) {
    if (renderData.value[i].sign === data.sign) {
      indexs.push(i);
    }
  }
  if (indexs.length > 0) {
    // 排序，需要从最高的索引开始删除
    indexs.sort((a, b) => b - a);
    // 删除
    indexs.forEach(i => {
      renderData.value.splice(i, 1);
    });
    watchRenderData();
  }
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
    watchRenderData();
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
 * 字段值变更
 */
const evaluationChange = () => {
  const data = generateFormData();
  data.tableName = formData.value.tableName;
  data.columnName = formData.value.columnName;
  data.columnNameOptions = formData.value.columnNameOptions;
  data.evaluation = formData.value.evaluation;
  data.sign = formData.value.sign;
  formData.value = data;
}
/**
 * 业务数据，列名 与 清洗规则，列名 联动
 */
const formatVariableValue = () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of renderData.value) {
    if (item.variableValue && !businessTypeNameData.value.includes(item.variableValue)) {
      item.variableValue = '';
    }
  }
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
  console.log('watch:modelValue', props.modelValue);
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
  console.log('watch:businessTypeData', props.businessTypeData);
  businessTypeNameData.value = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of businessTypeData.value) {
    businessTypeNameData.value.push(item.name);
  }
  formatVariableValue();
  watchRenderData();
}, {deep: true, immediate: true});

watch(() => props.parameter, () => {
  getSelectDictionaryOptions();
  getSelectEntityOptions();
}, {deep: true, immediate: true});
</script>

<template>
  <a-card class="">
    <template #extra>
      <a-button v-if="!disabled" type="text" @click.stop="handleModelOpen($event)">
        <template #icon>
          <icon-plus/>
        </template>
        新增
      </a-button>
    </template>
    <template #title>
      共 {{ renderData.length }} 条
    </template>
    <a-table :bordered="{cell:true}"
             :columns="([] as TableColumnData[])"
             :data="renderData"
             :draggable="disabled?false:{type:'handle',width:40}"
             :pagination="false"
             :scroll="scroll"
             :scrollbar="scrollbar"
             :stripe="true"
             column-resizable
             row-key="name" @change="handleChange">
      <template #columns>
        <a-table-column v-if="disabled" :width="70" align="center" data-index="index" title="序号">
          <template #cell="{  rowIndex }">
            {{ rowIndex + 1 }}
          </template>
        </a-table-column>
        <a-table-column :width="180" data-index="tableName" title="模型名称">
          <template #cell="{ record }">
            {{ record.tableName }}
          </template>
        </a-table-column>
        <a-table-column :width="180" data-index="columnName" title="字段名称">
          <template #cell="{ record }">
            {{ record.columnName }}
          </template>
        </a-table-column>
        <a-table-column :width="180" data-index="evaluation" title="字段值">
          <template #cell="{ record }">
            {{ getOptionLabel(record.evaluation, businessMetaEvaluationOptions) }}
          </template>
        </a-table-column>
        <a-table-column :width="120" data-index="constValue" title="常量">
          <template #cell="{ record }">
            {{ record.constValue }}
          </template>
        </a-table-column>
        <a-table-column :width="180" data-index="variableValue" title="变量">
          <template #cell="{ record }">
            {{ record.variableValue }}
          </template>
        </a-table-column>
        <a-table-column :width="240" data-index="expression" title="表达式">
          <template #cell="{ record }">
            {{ record.expression }}
          </template>
        </a-table-column>
        <a-table-column :width="180" data-index="dictCode" title="数据字典">
          <template #cell="{ record }">
            {{ record.dictCode }}
          </template>
        </a-table-column>
        <a-table-column :width="240" data-index="primaryValue" title="模型">
          <template #cell="{ record }">
            {{ record.primaryValue }}
          </template>
        </a-table-column>
        <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="remark" title="备注">
          <template #cell="{ record }">
            {{ record.remark }}
          </template>
        </a-table-column>
        <a-table-column v-if="!disabled" :width="130" align="center" data-index="operations" fixed="right" title="操作">
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
          <template #extra>
            <div>选择需要保存数据的模型。</div>
          </template>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="columnName" label="字段名称">
          <a-select v-model="formData.columnName" allow-search>
            <a-option v-for="(item,index) of formData.columnNameOptions" :key="index" :label="`${item.title}[${item.fieldName}]`" :value="item.fieldName"/>
          </a-select>
          <template #extra>
            <div>选择需要保存数据的模型字段。</div>
          </template>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="evaluation" label="字段值">
          <a-select v-model="formData.evaluation" allow-search @change="evaluationChange">
            <a-option v-for="(item,index) in businessMetaEvaluationOptions" :key="index" :label="item.label" :value="item.value as string"/>
          </a-select>
          <template #extra>
            <div>选择模型字段值的处理方式。</div>
            <div v-if="['SERIAL_NUMBER'].includes(formData.evaluation)">导入当前批次生成的流水号，便于批量删除。</div>
            <div v-if="['PRIMITIVE'].includes(formData.evaluation)">取对应业务数据列未被清洗的值。</div>
          </template>
        </a-form-item>
        <a-form-item v-if="['CONST'].includes(formData.evaluation)"
                     :rules="[{required: ['CONST'].includes(formData.evaluation),message: '这是必填项'}]"
                     field="constValue" label="常量">
          <a-input v-model="formData.constValue"/>
        </a-form-item>
        <a-form-item v-if="['VARIABLE','JS_EXPRESSION','CHECKBOX','DICTIONARY','PRIMARY_KEY','PRIMITIVE'].includes(formData.evaluation)"
                     :rules="[{required: ['VARIABLE','CHECKBOX','DICTIONARY','PRIMARY_KEY','PRIMITIVE'].includes(formData.evaluation),message: '这是必填项'}]"
                     field="variableValue" label="变量">
          <a-select v-model="formData.variableValue" allow-clear allow-search>
            <a-option v-for="(item,index) in businessTypeData" :key="index" :label="item.name" :value="item.name"/>
          </a-select>
          <template #extra>
            <div>选择对应的模板表头。</div>
          </template>
        </a-form-item>
        <a-form-item v-if="['JS_EXPRESSION'].includes(formData.evaluation)"
                     :rules="[{required: ['JS_EXPRESSION'].includes(formData.evaluation),message: '这是必填项'}]"
                     field="expression" label="表达式">
          <a-textarea v-model="formData.expression" :auto-size="{minRows:2,maxRows:4}" show-word-limit/>
          <template #extra>
            <div>JavaScript计算公式。如：$.20GP+$.40GP | $.是否启用==true?1:0。</div>
          </template>
        </a-form-item>
        <a-form-item v-if="['CHECKBOX','DICTIONARY'].includes(formData.evaluation)"
                     :rules="[{required: ['CHECKBOX','DICTIONARY'].includes(formData.evaluation),message: '这是必填项'}]"
                     field="dictCode" label="数据字典">
          <a-select v-model="formData.dictCode" allow-clear allow-search>
            <a-option v-for="(item,index) of selectDictionaryOptions" :key="index" :label="`${item.dictName}[${item.dictCode}]`" :value="item.dictCode"/>
          </a-select>
          <template #extra>
            <div>选择数据字典，“变量”等于字典项名称，写入字典项编码。</div>
          </template>
        </a-form-item>
        <a-form-item v-if="['PRIMARY_KEY'].includes(formData.evaluation)"
                     :rules="[{required: ['PRIMARY_KEY'].includes(formData.evaluation),message: '这是必填项'}]"
                     field="primaryValue" label="模型">
          <a-space direction="vertical" style="width:100%">
            <div style="word-wrap: break-word;">{{ formData.primaryValue }}</div>
            <a-select v-model="formData.primaryTableName" allow-clear allow-search placeholder="选择模型"
                      @change="primaryValueEntityChange">
              <a-option v-for="(item,index) of selectEntityOptions" :key="index" :label="`${item.title}[${item.entityName}]`" :value="item.entityName"/>
            </a-select>
            <a-select v-model="formData.primaryColumnNameGoal" allow-clear allow-search placeholder="选择目标字段"
                      @change="primaryValueColumnChange">
              <a-option v-for="(item,index) of formData.primaryValueOptions" :key="index" :label="`${item.title}[${item.fieldName}]`" :value="item.fieldName"/>
            </a-select>
            <a-select v-model="formData.primaryColumnNameMatch" allow-clear allow-search multiple placeholder="选择查询字段"
                      @change="primaryValueColumnChange">
              <a-option v-for="(item,index) of formData.primaryValueOptions" :key="index" :label="`${item.title}[${item.fieldName}]`" :value="item.fieldName"/>
            </a-select>
          </a-space>
          <template #extra>
            <div>查询模型，查询字段与单元格值匹配[或]，回写目标字段值。</div>
            <div>格式为：模型:目标字段|查询字段,查询字段...</div>
          </template>
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea v-model="formData.remark" :auto-size="{minRows:2,maxRows:4}" show-word-limit/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped>

</style>