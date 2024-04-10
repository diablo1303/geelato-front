<script lang="ts">
export default {
  name: 'ExportBusinessMeta'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {cloneDeep} from "lodash";
import {getOptionLabel} from "@/api/base";
import {generateRandom} from "@/utils/strings";
import {FormInstance, TableColumnData} from "@arco-design/web-vue";
import {BusinessMetaData, businessMetaDataValueComputeModeOptions, businessMetaDataValueTypeOptions} from "./template";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<BusinessMetaData>, default: []},
  disabled: {type: Boolean, default: false},
  height: {type: Number, default: 480},
});

// 列表参数
const scrollbar = ref(true);
const scroll = ref({x: 2000, y: props.height - 125});
const renderData = ref<BusinessMetaData[]>([]);
// 表单参数
const generateFormData = (): BusinessMetaData => {
  return {
    placeholder: '',
    var: '',
    listVar: '',
    constValue: '',
    expression: '',
    valueType: 'STRING',
    valueComputeMode: '',
    isList: false,
    isMerge: false,
    isImage: false,
    imageWidth: 0,
    imageHeight: 0,
    description: '',
    sign: '',
  };
};
const formData = ref(generateFormData());
const validateForm = ref<FormInstance>();
const visibleModel = ref(false);

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
 * 输入
 */
watch(() => props.modelValue, () => {
  console.log('watch:modelValue', props.modelValue);
  const data = cloneDeep(props.modelValue);
  if (data && data.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      item.sign = generateRandom(6);
    }
  }
  renderData.value = data || [];
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
        <a-table-column :width="180" data-index="placeholder" title="占位符">
          <template #cell="{ record }">
            {{ record.placeholder }}
          </template>
        </a-table-column>
        <a-table-column :width="180" data-index="var" title="变量">
          <template #cell="{ record }">
            {{ record.var }}
          </template>
        </a-table-column>
        <a-table-column :width="180" data-index="listVar" title="列表变量">
          <template #cell="{ record }">
            {{ record.listVar }}
          </template>
        </a-table-column>
        <a-table-column :width="150" data-index="constValue" title="常量值">
          <template #cell="{ record }">
            {{ record.constValue }}
          </template>
        </a-table-column>
        <a-table-column :width="240" data-index="expression" title="表达式">
          <template #cell="{ record }">
            {{ record.expression }}
          </template>
        </a-table-column>
        <a-table-column :width="90" data-index="valueType" title="值类型">
          <template #cell="{ record }">
            {{ getOptionLabel(record.valueType, businessMetaDataValueTypeOptions) }}
          </template>
        </a-table-column>
        <a-table-column :width="120" data-index="valueComputeMode" title="取值计算方式">
          <template #cell="{ record }">
            {{ getOptionLabel(record.valueComputeMode, businessMetaDataValueComputeModeOptions) }}
          </template>
        </a-table-column>
        <a-table-column :width="90" data-index="isList" title="是否列表">
          <template #cell="{ record }">
            {{ record.isList }}
          </template>
        </a-table-column>
        <a-table-column :width="90" data-index="isMerge" title="是否合并">
          <template #cell="{ record }">
            {{ record.isMerge }}
          </template>
        </a-table-column>
        <a-table-column :width="90" data-index="isImage" title="是否图片">
          <template #cell="{ record }">
            {{ record.isImage }}
          </template>
        </a-table-column>
        <a-table-column :width="120" data-index="imageWidth" title="图片宽度cm">
          <template #cell="{ record }">
            {{ record.imageWidth }}
          </template>
        </a-table-column>
        <a-table-column :width="120" data-index="imageHeight" title="图片高度cm">
          <template #cell="{ record }">
            {{ record.imageHeight }}
          </template>
        </a-table-column>
        <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="description" title="备注">
          <template #cell="{ record }">
            {{ record.description }}
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
        title="导出的数据配置"
        @cancel="handleModelCancel($event)"
        @before-ok="handleModelOk">
      <a-form ref="validateForm" :model="formData">
        <a-divider orientation="left">导出模板中占位符格式定义</a-divider>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="placeholder" label="占位符">
          <a-input v-model.trim="formData.placeholder" placeholder="如：${名称}"/>
          <template #extra>
            <div>输入与模板占位符相同格式的字符串，如${名称}。</div>
          </template>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="valueType" label="值类型">
          <a-select v-model="formData.valueType" allow-search>
            <a-option v-for="(item,index) in businessMetaDataValueTypeOptions" :key="index" :label="item.label" :value="item.value as string"/>
          </a-select>
        </a-form-item>
        <a-form-item v-if="['VAR'].includes(formData.valueComputeMode)" field="isImage" label="是否图片">
          <a-switch v-model="formData.isImage">
            <template #checked>
              是
            </template>
            <template #unchecked>
              否
            </template>
          </a-switch>
        </a-form-item>
        <a-form-item v-if="formData.isImage" :rules="[{required: formData.isImage,message: '这是必填项'}]" field="imageWidth" label="图片宽度">
          <a-input-number v-model="formData.imageWidth" :min="0" :precision="2" :step="1">
            <template #suffix>cm</template>
          </a-input-number>
        </a-form-item>
        <a-form-item v-if="formData.isImage" :rules="[{required: formData.isImage,message: '这是必填项'}]" field="imageHeight" label="图片高度">
          <a-input-number v-model="formData.imageHeight" :min="0" :precision="2" :step="1">
            <template #suffix>cm</template>
          </a-input-number>
        </a-form-item>
        <a-divider orientation="left">导出模板中占位符值来源及计算规则</a-divider>
        <a-form-item field="isList" label="来源于列表">
          <a-switch v-model="formData.isList">
            <template #checked>
              是
            </template>
            <template #unchecked>
              否
            </template>
          </a-switch>
        </a-form-item>
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="valueComputeMode" label="取值规则">
          <a-select v-model="formData.valueComputeMode" allow-search>
            <a-option v-for="(item,index) in businessMetaDataValueComputeModeOptions" :key="index" :label="item.label" :value="item.value as string"/>
          </a-select>
        </a-form-item>
        <a-form-item v-if="['CONST'].includes(formData.valueComputeMode)"
                     :rules="[{required: ['CONST'].includes(formData.valueComputeMode),message: '这是必填项'}]"
                     field="constValue" label="常量">
          <a-input v-model="formData.constValue"/>
        </a-form-item>
        <a-form-item v-if="['EXPRESSION'].includes(formData.valueComputeMode)"
                     :rules="[{required: ['EXPRESSION'].includes(formData.valueComputeMode),message: '这是必填项'}]"
                     field="expression" label="表达式">
          <a-textarea v-model="formData.expression" :auto-size="{minRows:2,maxRows:4}" show-word-limit/>
        </a-form-item>
        <a-form-item v-if="formData.isList" :rules="[{required: formData.isList,message: '这是必填项'}]" field="listVar" label="列表变量名">
          <a-input v-model.trim="formData.listVar"/>
        </a-form-item>
        <a-form-item v-if="['VAR','EXPRESSION'].includes(formData.valueComputeMode)" :rules="[{required: true,message: '这是必填项'}]" field="var"
                     label="变量名">
          <a-input v-model.trim="formData.var"/>
        </a-form-item>
        <a-divider orientation="left">数据导到模板之后，对导出文件的处理</a-divider>
        <a-form-item v-if="formData.isList || ['CONST'].includes(formData.valueComputeMode)" field="isMerge" label="合并单元格">
          <a-switch v-model="formData.isMerge">
            <template #checked>
              是
            </template>
            <template #unchecked>
              否
            </template>
          </a-switch>
          <template #extra>
            <div>如果合并，则将上下左右相同值的单元格进行合并处理；否则不处理；只适用于导出Excel。</div>
          </template>
        </a-form-item>
        <a-form-item field="description" label="备注">
          <a-textarea v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" show-word-limit/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped>

</style>