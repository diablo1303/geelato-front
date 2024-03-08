<script lang="ts">
export default {
  name: 'ImportBusinessType'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {FormInstance, SelectOptionData, TableColumnData} from "@arco-design/web-vue";
import {generateRandom} from "@/utils/strings";
import {cloneDeep} from "lodash";
import {BusinessTypeData, businessTypeDataTypeOptions} from "./template";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<BusinessTypeData>, default: []},
  disabled: {type: Boolean, default: false},
});
// 列表参数
type Column = TableColumnData & { checked?: true };
const cloneColumns = ref<Column[]>([]);
const renderData = ref<BusinessTypeData[]>([]);
/**
 * 模型初始化
 */
const generateFormData = (): BusinessTypeData => {
  return {
    name: '',
    type: 'STRING',
    format: '',
    remark: '',
    sign: '',
  };
}
// 表单参数
const visibleModel = ref(false);
const formData = ref(generateFormData());
const validateForm = ref<FormInstance>();

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
const listEdit = (data: BusinessTypeData) => {
  formData.value = {...data};
  visibleModel.value = true;
}
/**
 * 列表删除
 * @param data
 */
const listDelete = (data: BusinessTypeData) => {
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
  }
}

/**
 * 下拉选项匹配
 * @param value
 * @param data
 */
const getLabel = (value: string, data: SelectOptionData[]) => {
  if (data && data.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      if (item.value === value) {
        return item.label;
      }
    }
  }
  return '';
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
 * 唯一性校验
 * @param value
 * @param callback
 */
const validateRule = async (value: any, callback: any) => {
  let isValid = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of renderData.value) {
    if (item.sign !== formData.value.sign && item.name === formData.value.name) {
      isValid = false;
      break;
    }
  }
  if (!isValid) callback('不能重复');
}

/**
 * 输入
 */
watch(() => props.modelValue, () => {
  const data = cloneDeep(props.modelValue);
  if (data && data.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      item.sign = generateRandom(6);
    }
  }
  renderData.value = data || [];
}, {deep: true, immediate: true});
/**
 * 输出
 */
watch(() => renderData.value, () => {
  const data = cloneDeep(renderData.value);
  // eslint-disable-next-line no-restricted-syntax
  for (const item of data) {
    delete item.sign;
  }
  emits("update:modelValue", data);
}, {deep: true, immediate: true});
</script>

<template>
  <a-collapse-item :key="1" header="Excel模板字段定义">
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
        <a-table-column :width="150" data-index="name" title="模板表头">
          <template #cell="{ record }">
            {{ record.name }}
          </template>
        </a-table-column>
        <a-table-column :width="150" data-index="type" title="数据类型">
          <template #cell="{ record }">
            {{ getLabel(record.type, businessTypeDataTypeOptions) }}
          </template>
        </a-table-column>
        <a-table-column :width="150" data-index="format" title="格式">
          <template #cell="{ record }">
            {{ record.format }}
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
        title="Excel模板字段定义"
        @cancel="handleModelCancel($event)"
        @before-ok="handleModelOk">
      <a-form ref="validateForm" :model="formData">
        <a-form-item :rules="[{required: true,message: '这是必填项'}, {validator: validateRule}]" field="name" label="模板表头">
          <a-input v-model.trim="formData.name"/>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="type" label="数据类型">
          <a-select v-model="formData.type" allow-search>
            <a-option v-for="(item,index) in businessTypeDataTypeOptions" :key="index" :label="item.label" :value="item.value as string"/>
          </a-select>
          <template #extra>
            <div>Excel模板的单元格格式，用于正确读取数据。</div>
          </template>
        </a-form-item>
        <a-form-item v-if="['BOOLEAN','DATETIME'].includes(formData.type)" field="format" label="格式">
          <a-input v-model="formData.format"/>
          <template #extra>
            <div v-if="['BOOLEAN'].includes(formData.type)">输入用于TRUE/FALSE匹配的值。如：“是”，模板单元格值等于“是”为TRUE，否则为FALSE。</div>
            <div v-if="['DATETIME'].includes(formData.type)">输入匹配的时间格式，如：YYYY-MM-dd。非特殊格式，可不填。</div>
          </template>
        </a-form-item>
        <a-form-item :rules="[{required: false,message: '这是必填项'}]" field="remark" label="备注">
          <a-textarea v-model="formData.remark" :auto-size="{minRows:2,maxRows:4}" show-word-limit/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-collapse-item>
</template>

<style lang="less" scoped>

</style>