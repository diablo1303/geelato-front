<template v-model="pageData">
  <a-form
ref="validateForm" :model="formData" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }"
          class="form">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item v-show="false">
          <a-input v-show="false" v-model="formData.id"/>
          <a-input v-show="false" v-model="formData.tableId"/>
          <a-input v-show="false" v-model="formData.tableSchema"/>
          <a-input v-show="false" v-model="formData.tableName"/>
          <a-input v-show="false" v-model="formData.fieldName"/>
          <a-input v-show="false" v-model="formData.type"/>
          <a-input v-show="false" v-model="formData.autoIncrement"/>
          <a-input v-show="false" v-model="formData.isRefColumn"/>
          <a-input v-show="false" v-model="formData.refLocalCol"/>
          <a-input v-show="false" v-model="formData.refTables"/>
          <a-input v-show="false" v-model="formData.refColName"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.title')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="title">
          <a-input v-model="formData.title" :max-length="32"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.name')"
            :rules="[{required: pageData.formState==='add',message: $t('model.form.rules.match.required')}]"
            field="name">
          <a-input v-if="pageData.formState==='add'" v-model="formData.name" :max-length="32"/>
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.enableStatus')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-model="formData.enableStatus">
            <a-option
v-for="item of enableStatusOptions" :key="item.value" :label="$t(`${item.label}`)"
                      :value="item.value"/>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.ordinalPosition')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="ordinalPosition">
          <a-input-number
              v-model="formData.ordinalPosition"
              :max="999999"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,999999]'"
              :precision="0"/>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
            :label="$t('model.table.index.form.description')"
            :label-col-props="{ span: (pageData.formCol===1?8:4) }"
            :wrapper-col-props="{ span: (pageData.formCol===1?16:20) }"
            field="description">
          <a-textarea
v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512"
                      show-word-limit/>
        </a-form-item>
      </a-col>

      <a-divider style="margin:0px 0px 10px 0px;"/>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.dataType')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dataType">
          <a-select v-model="formData.dataType" :options="dataTypeOptions"/>
        </a-form-item>
      </a-col>
      <a-col v-if="formData.dataType==='文本'" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.charMaxLength')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="charMaxLength">
          <a-input-number
              v-model="formData.charMaxLength"
              :max="999999"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,999999]'"
              :precision="0"/>
        </a-form-item>
      </a-col>
      <a-col v-if="formData.dataType==='数字'" :span="24/pageData.formCol">
        <a-form-item
:label="$t('model.column.index.form.numericPrecision')"
                     :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                     field="numericPrecision">
          <a-input-number
              v-model="formData.numericPrecision"
              :max="999999"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,999999]'"
              :precision="0"/>
        </a-form-item>
      </a-col>
      <a-col v-if="formData.dataType==='数字'" :span="24/pageData.formCol">
        <a-form-item
:label="$t('model.column.index.form.numericScale')"
                     :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                     field="numericScale">
          <a-input-number
              v-model="formData.numericScale"
              :max="999999"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,999999]'"
              :precision="0"/>
        </a-form-item>
      </a-col>
      <a-col v-if="formData.dataType==='数字'" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.numericSigned')" field="numericSigned">
          <a-radio-group v-model="formData.numericSigned" :options="numericSignedOptions">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>

      <a-col v-if="formData.dataType==='文本'" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-input v-model="formData.defaultValue" :max-length="32"/>
        </a-form-item>
      </a-col>
      <a-col v-if="formData.dataType==='布尔值'" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-radio-group v-model="formData.defaultValue">
            <a-radio value="1">TRUE</a-radio>
            <a-radio value="0">FALSE</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col v-if="formData.dataType==='数字'" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-input-number
              v-model="formData.defaultValue"
              :max="Math.pow(10,formData.numericPrecision)"
              :min="0"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,999999]'"
              :precision="formData.numericScale"/>
        </a-form-item>
      </a-col>
      <a-col v-if="formData.dataType==='日期'" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-date-picker v-model="formData.defaultValue" allow-clear/>
        </a-form-item>
      </a-col>
      <a-col v-if="formData.dataType==='时间'" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-date-picker v-model="formData.defaultValue" format="YYYY-MM-DD HH:mm:ss" show-time allow-clear/>
        </a-form-item>
      </a-col>

      <a-divider style="margin: 5px 0;"/>
      <!-- <a-col :span="24/pageData.formCol">
              <a-form-item :label="$t('model.column.index.form.key')" field="key">
                <a-radio-group v-model="formData.key" :options="keyOptions">
                  <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
                </a-radio-group>
              </a-form-item>
            </a-col>-->
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.nullable')" field="nullable">
          <a-radio-group v-model="formData.nullable" :options="nullableOptions">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {Modal} from "@arco-design/web-vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {ListUrlParams} from '@/api/service/base_service';
import {
  createOrUpdateTableColumn as createOrUpdateForm,
  getTableColumn as getForm,
  QueryTableColumnForm,
  QueryTableColumnForm as QueryForm,
  QueryTableForm
} from '@/api/service/model_service';
import {
  dataTypeOptions,
  enableStatusOptions,
  nullableOptions,
  numericSignedOptions
} from "@/views/model/column/searchTable";

const pageData = ref({formState: 'add', button: true, formCol: 1, mainTable: ''});
const validateForm = ref<FormInstance>();
const tableOptions = ref<QueryTableForm[]>([]);
const mainTableColOptions = ref<QueryTableColumnForm[]>([]);
const columnTableColOptions = ref<QueryTableColumnForm[]>([]);
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: '', // *
    tableId: '', // 表id *
    title: '', // 实体属性中文,中文名
    abstractColumnExpressions: '', //
    fieldName: '',// 列名
    tableSchema: '', // 数据库名
    tableName: '', // 表名
    tableCatalog: '', // 表目录 *
    name: '', // 列名
    comment: '', // 备注
    ordinalPosition: 0, // 次序
    defaultValue: '', // 默认值
    type: '', // 类型
    key: '0', // 列键
    nullable: 1, // 是否可空 YES_OR_NO
    dataType: '', // 数据类型
    extra: '', // 特别 auto_increment
    autoIncrement: false, // auto_increment
    unique: false, //
    charMaxLength: 64, // 长度
    numericPrecision: 0, // 整数位
    numericScale: 0, // 小数位
    numericSigned: 1, // 是否有符号，默认有，若无符号，则需在type中增加：unsigned
    datetimePrecision: 0, // datetime 日期长度
    enableStatus: 1, // 状态
    linked: 1, // 链接
    description: '', // 描述
    isRefColumn: false,  // 1-外表字段，默认0
    refLocalCol: '', // isRefColumn为true时，需要通过本表引用字段
    refTables: '', // 外表表名
    refColName: '', // 外表字段名称
    seqNo: 1
  };
}
const formData = ref(generateFormData());

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await createOrUpdateForm(params);
      successBack(data);
    } catch (err) {
      failBack(err);
    }
  } else {
    failBack();
  }
};
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await getForm(id);
    successBack(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    failBack(err);
  }
};

const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

/* 对外调用方法 */
const loadModel = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action || "view";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.formCol = urlParams.formCol || 1;
  formData.value = generateFormData();
  formData.value.tableId = urlParams.params?.pId || '';
  formData.value.tableName = urlParams.params?.pName || '';
// 重置验证
  resetValidate();
// 特色
  if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      data.seqNo = Number(data.seqNo);
      data.ordinalPosition = Number(data.ordinalPosition);
      data.charMaxLength = Number(data.charMaxLength);
      data.nullable = data.nullable === true ? 1 : 0;
      data.numericSigned = data.numericSigned === true ? 1 : 0;
      formData.value = data;
      urlParams.loadSuccessBack(data);
    }, urlParams.loadFailBack);
  }
}
const submitModel = (done: any, successBack?: any, failBack?: any) => {
  createOrUpdateData(formData.value, successBack, failBack);
};

// 将方法暴露出去
defineExpose({loadModel, submitModel});
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
</style>