<script lang="ts">
export default {
  name: 'ImportBusinessRule'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {FormInstance, TableColumnData} from "@arco-design/web-vue";
import {generateRandom} from "@/utils/strings";
import {cloneDeep} from "lodash";
import {BusinessRuleData, businessRuleDataTypeOptions, BusinessTypeData} from "./template";

const emits = defineEmits(['update:modelValue', 'update:businessTypeData']);
const props = defineProps({
  modelValue: {type: Array<BusinessRuleData>, default: []},
  businessTypeData: {type: Array<BusinessTypeData>, default: []},
  disabled: {type: Boolean, default: false},
});
// 列表参数
type Column = TableColumnData & { checked?: true };
const cloneColumns = ref<Column[]>([]);
const renderData = ref<BusinessRuleData[]>([]);
/**
 * 模型初始化
 */
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
    sign: '',
  };
};
// 表单参数
const visibleModel = ref(false);
const formData = ref(generateFormData());
const validateForm = ref<FormInstance>();
const businessTypeNameData = ref<string[]>([]);

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
const listEdit = (data: BusinessRuleData) => {
  formData.value = {...data};
  visibleModel.value = true;
}
/**
 * 列表删除
 * @param data
 */
const listDelete = (data: BusinessRuleData) => {
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
 * 列名集合转字符串
 */
const columnNameChange = () => {
  if (formData.value.columnNameArr && formData.value.columnNameArr.length > 0) {
    formData.value.columnName = formData.value.columnNameArr?.join(',');
  } else {
    formData.value.columnName = '';
  }
}

/**
 * 业务数据，列名 与 清洗规则，列名 联动
 */
const formatColumnName = () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of renderData.value) {
    if (item.columnNameArr && item.columnNameArr.length > 0) {
      const indexs = [];
      for (let i = 0; i < item.columnNameArr.length; i += 1) {
        if (!businessTypeNameData.value.includes(item.columnNameArr[i])) {
          indexs.push(i);
        }
      }
      indexs.sort((a, b) => b - a);
      indexs.forEach(index => {
        item.columnNameArr?.splice(index, 1);
      });
      item.columnName = item.columnNameArr.join(',');
    }
  }
}

/**
 * 输入
 */
watch(() => props.modelValue, () => {
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
/**
 * 输入
 */
watch(() => props.businessTypeData, () => {
  console.log(props.businessTypeData);
  businessTypeNameData.value = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of props.businessTypeData) {
    businessTypeNameData.value.push(item.name);
  }
  formatColumnName();
}, {deep: true, immediate: true});
/**
 * 输出
 */
watch(() => renderData.value, () => {
  const data = cloneDeep(renderData.value);
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      data[i].order = i + 1;
    }
  }
  emits("update:modelValue", data);
}, {deep: true, immediate: true});
</script>

<template>
  <a-collapse-item :key="2" header="Excel模板数据处理规则">
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
             :scroll="{y:400}"
             :scrollbar="true"
             :stripe="true"
             column-resizable
             row-key="name" @change="handleChange">
      <template #columns>
        <a-table-column :width="60" data-index="order" title="排序">
          <template #cell="{ record }">
            {{ record.order }}
          </template>
        </a-table-column>
        <a-table-column :width="200" data-index="columnName" title="列名">
          <template #cell="{ record }">
            {{ record.columnName }}
          </template>
        </a-table-column>
        <a-table-column :width="150" data-index="type" title="类型">
          <template #cell="{ record }">
            {{ record.type }}
          </template>
        </a-table-column>
        <a-table-column :width="150" data-index="rule" title="规则">
          <template #cell="{ record }">
            {{ record.rule }}
          </template>
        </a-table-column>
        <a-table-column :width="150" data-index="goal" title="目标">
          <template #cell="{ record }">
            {{ record.goal }}
          </template>
        </a-table-column>
        <a-table-column :width="150" data-index="retain" title="保留原值">
          <template #cell="{ record }">
            {{ record.retain }}
          </template>
        </a-table-column>
        <a-table-column :width="250" data-index="remark" title="说明">
          <template #cell="{ record }">
            {{ record.remark }}
          </template>
        </a-table-column>
        <a-table-column v-if="!disabled" :width="100" align="center" data-index="operations" fixed="right" title="操作">
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
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="columnNameArr" label="列名">
          <a-select v-model="formData.columnNameArr" allow-clear allow-search multiple @change="columnNameChange">
            <a-option v-for="(item,index) of props.businessTypeData" :key="index" :label="item.name" :value="item.name"/>
          </a-select>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="type" label="类型">
          <a-select v-model="formData.type" allow-search>
            <a-option v-for="(item,index) of businessRuleDataTypeOptions" :key="index" :label="item.label" :value="item.value as string"/>
          </a-select>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="rule" label="规则">
          <a-input v-model="formData.rule"/>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="goal" label="目标">
          <a-input v-model="formData.goal"/>
        </a-form-item>
        <a-form-item field="retain" label="保留原值">
          <a-switch v-model="formData.retain">
            <template #checked>
              保留
            </template>
            <template #unchecked>
              覆盖
            </template>
          </a-switch>
        </a-form-item>
        <a-form-item field="remark" label="说明">
          <a-textarea v-model="formData.remark" :auto-size="{minRows:2,maxRows:4}" show-word-limit/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-collapse-item>
</template>

<style lang="less" scoped>

</style>