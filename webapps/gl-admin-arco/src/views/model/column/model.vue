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
          <a-input v-show="false" v-model="formData.type"/>
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
            :label="$t('model.column.index.form.fieldName')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="fieldName">
          <a-input v-model="formData.fieldName" :max-length="32"/>
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
            <a-option v-for="item of enableStatusOptions" :key="item.value" :label="$t(`${item.label}`)" :value="item.value"/>
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
            :label="$t('model.column.index.form.comment')"
            :label-col-props="{ span: (pageData.formCol===1?8:4) }"
            :wrapper-col-props="{ span: (pageData.formCol===1?16:20) }"
            field="comment">
          <a-textarea v-model="formData.comment" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
            :label="$t('model.column.index.form.description')"
            :label-col-props="{ span: (pageData.formCol===1?8:4) }"
            :wrapper-col-props="{ span: (pageData.formCol===1?16:20) }"
            field="description">
          <a-textarea v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
        </a-form-item>
      </a-col>

      <a-divider style="margin:0 0 10px 0;"/>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.dataType')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dataType">
          <a-select v-model="formData.dataType" @change="dataTypeChange">
            <a-option v-for="item of dataTypeOptions" :key="item.value" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
        </a-form-item>
        <!-- 字符串 最大长度 -->
      </a-col>
      <a-col v-if="['VARCHAR'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.charMaxLength')"
            :rules="[{required: ['VARCHAR'].includes(formData.dataType),message: $t('model.form.rules.match.required')}]"
            field="charMaxLength">
          <a-input-number
              v-model="formData.charMaxLength"
              :max="65535"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,65535]'"
              :precision="0"/>
        </a-form-item>
      </a-col>
      <!-- 数值类型，长度、整数长度、小数长度、是否有符合 -->
      <a-col v-if="['TINYINT'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.numericPrecision')"
            :rules="[{required: ['TINYINT'].includes(formData.dataType),message: $t('model.form.rules.match.required')}]"
            field="numericPrecision">
          <a-input-number
              v-model="formData.numericPrecision"
              :max="3"
              :min="1"
              :placeholder="$t('model.form.rules.match.max.title')+': 3'"
              :precision="0" @blur="numericPrecisionBlur"/>
        </a-form-item>
      </a-col>
      <a-col v-if="['INT'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.numericPrecision')"
            :rules="[{required: ['INT'].includes(formData.dataType),message: $t('model.form.rules.match.required')}]"
            field="numericPrecision">
          <a-input-number
              v-model="formData.numericPrecision"
              :max="10"
              :min="1"
              :placeholder="$t('model.form.rules.match.max.title')+': 10'"
              :precision="0" @blur="numericPrecisionBlur"/>
        </a-form-item>
      </a-col>
      <a-col v-if="['DECIMAL'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.numericPrecision')"
            :rules="[{required: ['DECIMAL'].includes(formData.dataType),message: $t('model.form.rules.match.required')}]"
            field="numericPrecision">
          <a-input-number
              v-model="formData.numericPrecision"
              :max="19"
              :min="1"
              :placeholder="$t('model.form.rules.match.max.title')+': 19'"
              :precision="0" @blur="numericPrecisionBlur"/>
        </a-form-item>
      </a-col>
      <a-col v-if="['DECIMAL'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.numericScale')"
            :rules="[{required: ['DECIMAL'].includes(formData.dataType),message: $t('model.form.rules.match.required')}]"
            field="numericScale">
          <a-input-number
              v-model="formData.numericScale"
              :max="19"
              :min="1"
              :placeholder="$t('model.form.rules.match.max.title')+': 19'"
              :precision="0" @blur="decimalTotalLength"/>
        </a-form-item>
      </a-col>
      <a-col v-if="['TINYINT','INT','BIGINT','DECIMAL'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.numericSigned')" field="numericSigned">
          <a-radio-group v-model="formData.numericSigned" :options="numericSignedOptions">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col v-if="['TINYINT','INT','BIGINT'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.autoIncrement')" field="autoIncrement">
          <a-radio-group v-model="formData.autoIncrement" :options="autoIncrementOptions">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <!-- 默认值 defaultValue -->
      <a-col v-if="['VARCHAR'].includes(formData.dataType)" :span="24">
        <a-form-item
            :label="$t('model.column.index.form.defaultValue')"
            :label-col-props="{ span: (pageData.formCol===1?8:4) }"
            :wrapper-col-props="{ span: (pageData.formCol===1?16:20) }"
            field="defaultValue">
          <a-textarea v-model="formData.defaultValue" :auto-size="{minRows:2,maxRows:4}" :max-length="formData.charMaxLength/2" show-word-limit/>
        </a-form-item>
      </a-col>
      <a-col v-if="['BIT'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-radio-group v-model="formData.defaultValue">
            <a-radio value="1">TRUE</a-radio>
            <a-radio value="0">FALSE</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col v-if="['TINYINT','INT','BIGINT','DECIMAL'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-input-number
              v-model="formData.defaultValue"
              :max="pageData.maxNumber>0?pageData.maxNumber:''"
              :min="0"
              :placeholder="pageData.maxNumber>0?($t('model.form.rules.match.max.title')+`: ${pageData.maxNumber}`):''"
              :precision="formData.numericScale"/>
        </a-form-item>
      </a-col>
      <!--      <a-col v-if="['YEAR','DATE','TIME','DATETIME','TIMESTAMP'].includes(formData.dataType)" :span="24/pageData.formCol">
              <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
                <a-year-picker v-if="['YEAR'].includes(formData.dataType)" v-model="formData.defaultValue" style="width: 100%;"/>
                <a-date-picker v-if="['DATE'].includes(formData.dataType)" v-model="formData.defaultValue" style="width: 100%;"/>
                <a-time-picker v-if="['TIME'].includes(formData.dataType)" v-model="formData.defaultValue" style="width: 100%;"/>
                <a-date-picker v-if="['DATETIME','TIMESTAMP'].includes(formData.dataType)" v-model="formData.defaultValue"
                               style="width: 100%;" format="YYYY-MM-DD HH:mm:ss" show-time/>
              </a-form-item>
            </a-col>-->

      <a-divider style="margin: 5px 0;"/>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.nullable')" field="nullable">
          <a-radio-group v-model="formData.nullable"
                         :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                         :options="nullableOptions">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.uniqued')" field="key">
          <a-radio-group v-model="formData.uniqued"
                         :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                         :options="uniquedOptions">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.key')" field="key">
          <a-radio-group v-model="formData.key"
                         :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                         :options="keyOptions">
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
  autoIncrementOptions,
  dataTypeOptions,
  enableStatusOptions,
  keyOptions,
  nullableOptions,
  numericSignedOptions,
  uniquedOptions
} from "@/views/model/column/searchTable";
import {createOrUpdateTableColumn as createOrUpdateForm, getTableColumn as getForm, QueryTableColumnForm as QueryForm} from '@/api/service/model_service';

const pageData = ref({formState: 'add', button: true, formCol: 1, mainTable: '', maxNumber: -1});
const validateForm = ref<FormInstance>();
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
    ordinalPosition: 1, // 次序
    defaultValue: '', // 默认值
    type: '', // 类型
    key: 0, // 列键
    nullable: 1, // 是否可空 YES_OR_NO
    dataType: 'VARCHAR', // 数据类型
    extra: '', // 特别 auto_increment
    autoIncrement: 0, // auto_increment
    uniqued: 0, // 唯一约束
    charMaxLength: 64, // 长度
    numericPrecision: 0, // 整数位
    numericScale: 0, // 小数位
    numericSigned: 1, // 是否有符号，默认有，若无符号，则需在type中增加：unsigned
    datetimePrecision: '', // datetime 时间类型
    enableStatus: 1, // 状态
    linked: 0, // 链接
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
/**
 * 类型变化
 * @param value
 */
const dataTypeChange = (value: string) => {
  formData.value.charMaxLength = 0;
  formData.value.defaultValue = '';
  formData.value.numericPrecision = 0;
  formData.value.numericScale = 0;
  formData.value.numericSigned = 1;
  formData.value.autoIncrement = 0;
  if (['VARCHAR'].includes(value)) {
    formData.value.charMaxLength = 64;
  } else if (['TEXT'].includes(value)) {
    formData.value.charMaxLength = 65535;
  } else if (['LONGTEXT'].includes(value)) {
    formData.value.charMaxLength = 4294967295;
  } else if (['TINYINT'].includes(value)) {
    formData.value.numericPrecision = 3;
    pageData.value.maxNumber = 127;
  } else if (['INT'].includes(value)) {
    formData.value.numericPrecision = 10;
    pageData.value.maxNumber = 2147483647;
  } else if (['BIGINT'].includes(value)) {
    formData.value.numericPrecision = 19;
    pageData.value.maxNumber = -1;
  } else if (['DECIMAL'].includes(value)) {
    formData.value.numericPrecision = 17;
    formData.value.numericScale = 2;
    pageData.value.maxNumber = -1;
  }
}
const decimalTotalLength = (type?: string) => {
  if (['DECIMAL'].includes(formData.value.dataType)) {
    if (formData.value.numericPrecision + formData.value.numericScale > 19) {
      if (type === 'precision') {
        formData.value.numericScale = 19 - formData.value.numericPrecision;
      } else {
        formData.value.numericPrecision = 19 - formData.value.numericScale;
      }
    }
  }
}
const numericPrecisionBlur = () => {
  if (['TINYINT', 'INT', 'BIGINT', 'DECIMAL'].includes(formData.value.dataType)) {
    pageData.value.maxNumber = 10 ** (formData.value.numericPrecision + 1) - 1;
    if (['TINYINT'].includes(formData.value.dataType)) {
      pageData.value.maxNumber = pageData.value.maxNumber > 127 ? 127 : pageData.value.maxNumber;
    } else if (['INT'].includes(formData.value.dataType)) {
      pageData.value.maxNumber = pageData.value.maxNumber > 2147483647 ? 2147483647 : pageData.value.maxNumber;
    } else if (['BIGINT', 'DECIMAL'].includes(formData.value.dataType)) {
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      pageData.value.maxNumber = pageData.value.maxNumber > 9223372036854775807 ? 9223372036854775807 : pageData.value.maxNumber;
      if (['DECIMAL'].includes(formData.value.dataType)) {
        decimalTotalLength('precision');
      }
    }
  }
}

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
      // string ==> number
      data.seqNo = Number(data.seqNo);
      data.ordinalPosition = Number(data.ordinalPosition);
      data.charMaxLength = Number(data.charMaxLength);
      // boolean ==> number
      data.nullable = data.nullable === true ? 1 : 0;
      data.numericSigned = data.numericSigned === true ? 1 : 0;
      data.key = data.key === true ? 1 : 0;
      data.uniqued = data.uniqued === true ? 1 : 0;
      data.autoIncrement = data.autoIncrement === true ? 1 : 0;

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