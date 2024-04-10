<script lang="ts">
export default {
  name: 'ImportBusinessRule'
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
import {BusinessRuleData, businessRuleDataTypeOptions, BusinessTypeData} from "./template";

// 页面所需 参数
type PageParams = { appId?: string; tenantCode?: string; }

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<BusinessRuleData>, default: []},
  businessTypeData: {type: Array<BusinessTypeData>, default: []},
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  disabled: {type: Boolean, default: false},
  height: {type: Number, default: 480},
});

const {businessTypeData} = toRefs(props);

// 列表参数
const scrollbar = ref(true);
const scroll = ref({x: 1380, y: props.height - 125});
const renderData = ref<BusinessRuleData[]>([]);
// 表单参数
const generateFormData = (): BusinessRuleData => {
  return {
    columnName: '',
    type: '',
    rule: '',
    goal: '',
    priority: false,
    retain: false,
    order: Number(generateRandom(6)),
    remark: '',
    columnNameArr: [],
    ruleTableName: '',
    ruleColumnName: [],
    ruleQueryOptions: [],
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
    for (let i = 0; i < data.length; i += 1) {
      data[i].order = i + 1;
      delete data[i].columnNameArr;
      delete data[i].ruleTableName;
      delete data[i].ruleColumnName;
      delete data[i].ruleQueryOptions;
      delete data[i].sign;
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
const listEdit = (data: BusinessRuleData) => {
  formData.value = {...data};
  // 模型名称
  if (formData.value.ruleTableName) {
    getSelectEntityColumnOptions(formData.value.ruleTableName, (result: QueryTableColumnForm[]) => {
      formData.value.ruleQueryOptions = result;
    }, () => {
      formData.value.ruleQueryOptions = [];
    });
  }
  visibleModel.value = true;
}
/**
 * 列表删除
 * @param data
 */
const listDelete = (data: BusinessRuleData) => {
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
 * 类型变更
 */
const typeChange = () => {
  const data = generateFormData();
  data.type = formData.value.type;
  data.columnName = formData.value.columnName;
  data.columnNameArr = formData.value.columnNameArr;
  data.order = formData.value.order;
  data.sign = formData.value.sign;
  formData.value = data;
}
/**
 * 列名集合转字符串
 */
const columnNameChange = () => {
  if (formData.value.columnNameArr && formData.value.columnNameArr.length > 0) {
    formData.value.columnName = formData.value.columnNameArr?.join(',');
  } else {
    formData.value.columnName = '';
  }
}

const ruleColumnChange = () => {
  if (formData.value.ruleTableName && formData.value.ruleColumnName && formData.value.ruleColumnName.length > 0) {
    formData.value.rule = `${formData.value.ruleTableName}:${formData.value.ruleColumnName.join(',')}`;
  } else {
    formData.value.rule = '';
  }
  formData.value.goal = '';
}
const ruleEntityChange = () => {
  formData.value.ruleColumnName = [];
  formData.value.ruleQueryOptions = [];
  if (formData.value.ruleTableName) {
    getSelectEntityColumnOptions(formData.value.ruleTableName, (result: QueryTableColumnForm[]) => {
      formData.value.ruleQueryOptions = result;
      ruleColumnChange();
    }, () => {
      formData.value.ruleQueryOptions = [];
      ruleColumnChange();
    });
  } else {
    ruleColumnChange();
  }
}

/**
 * 业务数据，列名 与 清洗规则，列名 联动
 */
const formatColumnName = () => {
  const data = cloneDeep(renderData.value);
  // eslint-disable-next-line no-restricted-syntax
  for (const item of data) {
    if (item.columnNameArr && item.columnNameArr.length > 0) {
      const indexs = [];
      for (let i = 0; i < item.columnNameArr.length; i += 1) {
        if (!businessTypeNameData.value.includes(item.columnNameArr[i])) {
          indexs.push(i);
        }
      }
      if (indexs.length > 0) {
        indexs.sort((a, b) => b - a);
        for (let i = 0; i < indexs.length; i += 1) {
          item.columnNameArr?.splice(indexs[i], 1);
        }
        item.columnName = item.columnNameArr.join(',');
      }
    }
  }
  return data;
}
/**
 * 输入
 */
watch(() => props.modelValue, () => {
  console.log('watch:modelValue', props.modelValue);
  const data = cloneDeep(props.modelValue);
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      if (item.columnName) {
        item.columnNameArr = item.columnName.split(',') || [];
      } else {
        item.columnNameArr = [];
      }
      item.sign = generateRandom(6);
      item.order = i + 1;
    }
  }
  renderData.value = data || [];
}, {deep: true, immediate: true});

watch(() => props.businessTypeData, () => {
  console.log('watch:businessTypeData', props.businessTypeData);
  businessTypeNameData.value = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of props.businessTypeData) {
    businessTypeNameData.value.push(item.name);
  }
  renderData.value = [...formatColumnName()];
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
        <a-table-column :width="70" align="center" data-index="order" title="序号">
          <template #cell="{ record }">
            {{ record.order }}
          </template>
        </a-table-column>
        <a-table-column :width="180" data-index="type" title="规则类型">
          <template #cell="{ record }">
            {{ getOptionLabel(record.type, businessRuleDataTypeOptions) }}
          </template>
        </a-table-column>
        <a-table-column :width="240" data-index="columnName" title="处理列名">
          <template #cell="{ record }">
            {{ record.columnName }}
          </template>
        </a-table-column>
        <a-table-column :width="240" data-index="rule" title="规则">
          <template #cell="{ record }">
            {{ record.rule }}
          </template>
        </a-table-column>
        <a-table-column :width="150" data-index="goal" title="目标">
          <template #cell="{ record }">
            {{ record.goal }}
          </template>
        </a-table-column>
        <a-table-column :width="90" data-index="retain" title="保留原值">
          <template #cell="{ record }">
            {{ record.retain }}
          </template>
        </a-table-column>
        <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="remark" title="说明">
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
        title="Excel模板数据处理规则"
        @cancel="handleModelCancel($event)"
        @before-ok="handleModelOk">
      <a-form ref="validateForm" :model="formData">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="type" label="规则类型">
          <a-select v-model="formData.type" allow-search @change="typeChange">
            <a-option v-for="(item,index) of businessRuleDataTypeOptions" :key="index" :label="item.label" :value="item.value as string"/>
          </a-select>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="columnNameArr" label="处理列名">
          <a-select v-model="formData.columnNameArr" allow-clear allow-search multiple @change="columnNameChange">
            <a-option v-for="(item,index) of businessTypeData" :key="index" :label="item.name" :value="item.name"/>
          </a-select>
          <template #extra>
            <div>选择需要处理的模板表头。</div>
          </template>
        </a-form-item>
        <a-form-item v-if="['DELETES','REPLACE','CHECKBOX','DICTIONARY','QUERYGOAL','QUERYRULE','EXPRESSION','SYM','MULTI'].includes(formData.type)"
                     :rules="[{required: ['DELETES','REPLACE','CHECKBOX','DICTIONARY','QUERYGOAL','QUERYRULE','EXPRESSION','SYM','MULTI'].includes(formData.type),message: '这是必填项'}]"
                     field="rule" label="规则">
          <a-input v-if="['DELETES','REPLACE','SYM','MULTI'].includes(formData.type)" v-model="formData.rule"/>
          <a-textarea v-if="['EXPRESSION'].includes(formData.type)" v-model="formData.rule" :auto-size="{minRows:2,maxRows:4}" show-word-limit/>
          <a-select v-if="['CHECKBOX','DICTIONARY'].includes(formData.type)" v-model="formData.rule" allow-search>
            <a-option v-for="(item,index) of selectDictionaryOptions" :key="index" :label="`${item.dictName}[${item.dictCode}]`" :value="item.dictCode"/>
          </a-select>
          <a-space v-if="['QUERYGOAL','QUERYRULE'].includes(formData.type)" direction="vertical" style="width:100%">
            <div style="word-wrap: break-word;">{{ formData.rule }}</div>
            <a-select v-model="formData.ruleTableName" allow-clear allow-search placeholder="选择模型"
                      @change="ruleEntityChange">
              <a-option v-for="(item,index) of selectEntityOptions" :key="index" :label="`${item.title}[${item.entityName}]`" :value="item.entityName"/>
            </a-select>
            <a-select v-model="formData.ruleColumnName" allow-clear allow-search multiple placeholder="选择查询字段"
                      @change="ruleColumnChange">
              <a-option v-for="(item,index) of formData.ruleQueryOptions" :key="index" :label="`${item.title}[${item.fieldName}]`" :value="item.fieldName"/>
            </a-select>
          </a-space>
          <template #extra>
            <div v-if="['DELETES'].includes(formData.type)">输入正则表达式，删除匹配的字符。</div>
            <div v-if="['REPLACE'].includes(formData.type)">输入正则表达式，替换匹配的字符。</div>
            <div v-if="['DELETES','REPLACE'].includes(formData.type)">\s*,\s* \s*，\s* \s*\.\s*</div>
            <div v-if="['CHECKBOX'].includes(formData.type)">选择数据字典，匹配多个字典项，返回字典项编码。</div>
            <div v-if="['DICTIONARY'].includes(formData.type)">选择数据字典，匹配字典项，返回字典项编码。</div>
            <div v-if="['QUERYGOAL'].includes(formData.type)">查询模型，查询字段与单元格值匹配[或]，回写目标字段（不属于查询字段）值。</div>
            <div v-if="['QUERYRULE'].includes(formData.type)">查询模型，查询字段与单元格值匹配[或]，回写目标字段（属于查询字段）值。</div>
            <div v-if="['EXPRESSION'].includes(formData.type)">JavaScript计算公式。例：$.A?$.B:$.C。</div>
            <div v-if="['SYM'].includes(formData.type)">输入分隔符（正则表达式），分割单元值。对称关系（A1A2,B1B2 => A1B1,A1B2,A2B1,A2B2）。</div>
            <div v-if="['MULTI'].includes(formData.type)">输入分隔符（正则表达式），分割单元值。对称关系（A1A2,B1B2 => A1B1,A1B2,A2B1,A2B2）。</div>
            <div v-if="['SYM','MULTI'].includes(formData.type)">常用分割符：/|;</div>
          </template>
        </a-form-item>
        <a-form-item v-if="['REPLACE','QUERYGOAL','QUERYRULE','SYM'].includes(formData.type)"
                     :rules="[{required: ['REPLACE','QUERYGOAL','QUERYRULE'].includes(formData.type),message: '这是必填项'}]"
                     field="goal" label="目标">
          <a-input v-if="['REPLACE'].includes(formData.type)" v-model="formData.goal"/>
          <a-select v-if="['QUERYGOAL'].includes(formData.type)" v-model="formData.goal" allow-clear allow-search placeholder="选择目标字段">
            <a-option v-for="(item,index) of formData.ruleQueryOptions" :key="index" :disabled="formData.ruleColumnName.includes(item.fieldName)"
                      :label="`${item.title}[${item.fieldName}]`" :value="item.fieldName"/>
          </a-select>
          <a-select v-if="['QUERYRULE'].includes(formData.type)" v-model="formData.goal" allow-clear allow-search placeholder="选择目标字段">
            <a-option v-for="(item,index) of formData.ruleQueryOptions" :key="index" :disabled="!formData.ruleColumnName.includes(item.fieldName)"
                      :label="`${item.title}[${item.fieldName}]`" :value="item.fieldName"/>
          </a-select>
          <a-select v-if="['SYM'].includes(formData.type)" v-model="formData.goal" allow-clear>
            <a-option value="AB:CN">AB:CN</a-option>
            <a-option value="AB*CD">AB*CD</a-option>
          </a-select>
          <template #extra>
            <div v-if="['REPLACE'].includes(formData.type)">输入替换字符。</div>
            <div v-if="['QUERYGOAL','QUERYRULE'].includes(formData.type)">选择要回写的字段。</div>
            <div v-if="['SYM'].includes(formData.type)">
              <div>选择特殊的对称方式，AB:CC（默认）：第一个对应第一个，第二个没有对应值，取最后一个值。；</div>
              <div>AB:CN（可选）：第一个对应第一个，第二个没有对应值，取NULL。；</div>
              <div>AB*CD（可选）：长度相乘，生成组合：AC，AD，BC，BD；</div>
            </div>
          </template>
        </a-form-item>
        <a-form-item v-if="['CHECKBOX','DICTIONARY','QUERYGOAL','QUERYRULE'].includes(formData.type)" field="retain" label="保留原值">
          <a-switch v-model="formData.retain">
            <template #checked>
              保留
            </template>
            <template #unchecked>
              覆盖
            </template>
          </a-switch>
          <template #extra>
            <div>值经过规则处理后为空。“保留”：保留未处理的值；“覆盖”：保留处理后的结果。</div>
          </template>
        </a-form-item>
        <a-form-item field="remark" label="说明">
          <a-textarea v-model="formData.remark" :auto-size="{minRows:2,maxRows:4}" show-word-limit/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped>

</style>