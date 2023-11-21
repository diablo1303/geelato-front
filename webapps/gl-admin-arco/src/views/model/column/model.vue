<template v-model="pageData">
  <a-form
      ref="validateForm" :label-col-props="{ span: 8 }" :model="formData" :wrapper-col-props="{ span: 16 }"
      class="form">
    <a-row :gutter="16">
      <!-- <a-col :span="24">
              <a-form-item v-show="false">
                <a-input v-show="false" v-model="formData.id"/>
                <a-input v-show="false" v-model="formData.tableId"/>
                <a-input v-show="false" v-model="formData.tableSchema"/>
                <a-input v-show="false" v-model="formData.tableName"/>
                <a-input v-show="false" v-model="formData.type"/>
                <a-input-number v-show="false" v-model="formData.isRefColumn"/>
                <a-input v-show="false" v-model="formData.refLocalCol"/>
                <a-input v-show="false" v-model="formData.refTables"/>
                <a-input v-show="false" v-model="formData.refColName"/>
              </a-form-item>
            </a-col>-->
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.title')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="title">
          <a-input v-model.trim="formData.title" :max-length="32"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.name')"
            :rules="[{required: pageData.editName,message: $t('model.form.rules.match.required')},
            {match: /^[a-z][a-z0-9_]+$/,message:$t('model.form.rules.match.columnName.match')},
            {validator:validateCode}]"
            field="name">
          <a-input v-if="pageData.editName" v-model.trim="formData.name" :max-length="32" @blur="columnNameBlur($event)"/>
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.fieldName')"
                     :rules="[{required: pageData.formState==='add',message: $t('model.form.rules.match.required')}]"
                     field="fieldName">
          <a-input v-if="pageData.formState==='add'" v-model.trim="formData.fieldName" :max-length="32"
                   :placeholder="$t('model.column.index.form.fieldName.placeholder')" readonly/>
          <span v-else>{{ formData.fieldName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.enableStatus')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
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
            field="selectType">
          <a-select v-model="formData.selectType" :options="selectTypeOptions" allow-search @change="selectTypeChange(formData.selectType)"/>
        </a-form-item>
      </a-col>
      <!-- 字符串 长度设置 -->
      <a-col v-if="['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.charMaxLength')"
            :rules="[{required: ['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'].includes(formData.dataType),message: $t('model.form.rules.match.required')}]"
            field="charMaxLength">
          <a-input-number
              v-model="formData.charMaxLength"
              :max="selectData.max"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+`[1,${selectData.max}]`"
              :precision="0" :disabled="selectData.fixed"/>
        </a-form-item>
      </a-col>
      <!-- 数值类型，是否有符号 -->
      <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(formData.selectType)" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.numericSigned')"
            :rules="[{required: ['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL'].includes(formData.selectType),message: $t('model.form.rules.match.required')}]"
            field="numericSigned">
          <a-radio-group v-model="formData.numericSigned" :disabled="['SCORE'].includes(formData.selectType)" :options="numericSignedOptions"
                         @change="numericSignedChange(formData.numericSigned as boolean,$event)">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <!-- 数值类型，整数位 -->
      <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(formData.selectType)" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.numericPrecision')"
            :rules="[{required: ['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(formData.selectType),message: $t('model.form.rules.match.required')}]"
            field="numericPrecision">
          <a-input-number
              v-model="formData.numericPrecision"
              :max="selectData.digit"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+`[1,${selectData.digit}]`"
              :precision="0" @blur="numericPrecisionBlur($event)"/>
        </a-form-item>
      </a-col>
      <!-- 数值类型，小数位 -->
      <a-col v-if="['DECIMAL'].includes(formData.dataType)" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.numericScale')"
            :rules="[{required: ['DECIMAL'].includes(formData.dataType),message: $t('model.form.rules.match.required')}]"
            field="numericScale">
          <a-input-number
              v-model="formData.numericScale"
              :max="selectData.precision"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+`[1,${selectData.precision}]`"
              :precision="0" @blur="numericScaleBlur($event)"/>
        </a-form-item>
      </a-col>
      <!-- 默认值 defaultValue -->
      <a-col v-if="['CHAR','VARCHAR','REMARK','TEXT','RICHTEXT','SCRIPT'].includes(formData.selectType)" :span="24">
        <a-form-item
            :label="$t('model.column.index.form.defaultValue')"
            :label-col-props="{ span: (pageData.formCol===1?8:4) }"
            :wrapper-col-props="{ span: (pageData.formCol===1?16:20) }"
            field="defaultValue">
          <a-textarea v-model="formData.defaultValue" :auto-size="{minRows:2,maxRows:4}" :max-length="formData.charMaxLength" show-word-limit/>
        </a-form-item>
      </a-col>
      <!--   默认范围 defaultValue 字典项、流水号、实体   -->
      <a-col v-if="['DICTIONARY','CODE','ENTITY'].includes(formData.selectType)" :span="24">
        <a-form-item
            :label="$t('model.column.index.form.defaultRange')"
            :label-col-props="{ span: (pageData.formCol===1?8:4) }"
            :wrapper-col-props="{ span: (pageData.formCol===1?16:20) }"
            field="defaultValue">
          <a-select v-if="pageData.button&&['DICTIONARY'].includes(formData.selectType)" v-model="formData.defaultValue" allow-clear allow-search>
            <a-option v-for="item of selectDictionaryOptions" :key="item.id" :label="`${item.dictName}[${item.dictCode}]`" :value="item.dictCode"/>
          </a-select>
          <a-select v-if="pageData.button&&['CODE'].includes(formData.selectType)" v-model="formData.defaultValue" allow-clear allow-search>
            <a-option v-for="item of selectCodeOptions" :key="item.id" :label="`${item.title}[${item.example}]`" :value="item.id"/>
          </a-select>
          <a-select v-if="pageData.button&&['ENTITY'].includes(formData.selectType)" v-model="formData.defaultValue" allow-clear allow-search>
            <a-option v-for="item of selectEntityOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.id"/>
          </a-select>
        </a-form-item>
      </a-col>
      <!--  布尔值 defaultValue -->
      <a-col v-if="['BIT','SWITCH'].includes(formData.selectType)" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-radio-group v-model="formData.defaultValue">
            <a-radio value="1">TRUE</a-radio>
            <a-radio value="0">FALSE</a-radio>
            <a-radio v-if="['BIT'].includes(formData.selectType)" value="">NULL</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <!--      <a-col v-if="['BIT'].includes(formData.dataType)" :span="24/pageData.formCol">
              <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
                <a-checkbox-group v-model="formData.defaultValue" :max="1">
                  <a-checkbox value="1">TRUE</a-checkbox>
                  <a-checkbox value="0">FALSE</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-col>-->
      <!--  数值类型 number   -->
      <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL'].includes(formData.selectType)" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-input-number
              v-model="formData.defaultValue"
              :max="selectData.max"
              :min="selectData.min"
              :placeholder="$t('model.form.rules.match.length.title')+`[${selectData.min},${selectData.max}]`"
              :precision="formData.numericScale"/>
        </a-form-item>
      </a-col>
      <!--   最大分数 score   -->
      <a-col v-if="['SCORE'].includes(formData.selectType)" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.defaultMaxValue')"
            :rules="[{required: ['SCORE'].includes(formData.selectType),message: $t('model.form.rules.match.required')}]"
            field="defaultValue">
          <a-input-number
              v-model="formData.defaultValue"
              :max="selectData.max"
              :min="selectData.min"
              :placeholder="$t('model.form.rules.match.length.title')+`[${selectData.min},${selectData.max}]`"
              :precision="formData.numericScale"/>
        </a-form-item>
      </a-col>

      <!--  json类型，多组件   -->
      <a-divider v-if="['MULTICOMPONENT'].includes(formData.selectType)" style="margin: 5px 0;"/>
      <a-col v-if="['MULTICOMPONENT'].includes(formData.selectType)" :span="24">
        <a-form-item :wrapper-col-props="{ span: 24 }" field="defaultValue">
          <a-space :style="{'width':'100%'}" direction="vertical" size="mini">
            <a-card v-for="(item,index) of multiComponentData" :key="index" :title="item.title" hoverable size="small">
              <template #extra>
                <a-space>
                  <a-tooltip v-if="(index+1)===multiComponentData.length" :content="$t('model.column.index.multi.add.text')">
                    <a-link @click="clickAddMulti($event)">
                      <icon-plus/>
                    </a-link>
                  </a-tooltip>
                  <a-tooltip v-if="item.isEdit" :content="$t('model.column.index.multi.save.text')">
                    <a-link status="success" @click="clickSaveMulti(item)">
                      <icon-save/>
                    </a-link>
                  </a-tooltip>
                  <a-tooltip v-if="!item.isEdit" :content="$t('model.column.index.multi.edit.text')">
                    <a-link @click="clickEditMulti(item)">
                      <icon-edit/>
                    </a-link>
                  </a-tooltip>
                  <a-tooltip v-if="1!==multiComponentData.length" :content="$t('model.column.index.multi.delete.text')">
                    <a-link status="danger" @click="clickDeleteMulti(item)">
                      <icon-delete/>
                    </a-link>
                  </a-tooltip>
                </a-space>
              </template>
              <a-col v-if="item.isEdit" :span="24">
                <a-form-item :label="$t('model.column.index.form.title')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-input v-model.trim="item.title" :max-length="32" size="small"/>
                </a-form-item>
              </a-col>
              <a-col v-if="item.isEdit" :span="24">
                <a-form-item :label="$t('model.column.index.form.fieldName')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-input v-model.trim="item.fieldName" :max-length="32" size="small"/>
                </a-form-item>
              </a-col>
              <a-col v-if="item.isEdit" :span="24">
                <a-form-item :label="$t('model.column.index.form.dataType')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-select v-model="item.selectType" :options="selectTypeOptions" allow-search size="small" @change="selectTypeMultiChange(item)"/>
                </a-form-item>
              </a-col>
              <a-col v-if="item.isEdit&&['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'].includes(item.dataType)" :span="24">
                <a-form-item :label="$t('model.column.index.form.charMaxLength')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-input-number v-model="item.charMaxLength" :max="item.columnSelectType.radius.max" :min="1" :precision="0"
                                  :placeholder="$t('model.form.rules.match.length.title')+`[1,${item.columnSelectType.radius.max}]`"
                                  :disabled="item.columnSelectType.fixed"/>
                </a-form-item>
              </a-col>
              <a-col v-if="item.isEdit&&['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(item.selectType)" :span="24">
                <a-form-item :label="$t('model.column.index.form.numericPrecision')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-input-number v-model="item.numericPrecision" :max="item.columnSelectType.radius.unDigit" :min="1" :precision="0"
                                  :placeholder="$t('model.form.rules.match.length.title')+`[1,${item.columnSelectType.radius.unDigit}]`"/>
                </a-form-item>
              </a-col>
              <a-col v-if="item.isEdit&&['DECIMAL'].includes(item.dataType)" :span="24">
                <a-form-item :label="$t('model.column.index.form.numericScale')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-input-number v-model="item.numericScale" :max="item.columnSelectType.radius.precision" :min="1" :precision="0"
                                  :placeholder="$t('model.form.rules.match.length.title')+`[1,${item.columnSelectType.radius.precision}]`"/>
                </a-form-item>
              </a-col>
              <div v-if="!item.isEdit">
                <div v-if="['CHAR','VARCHAR','REMARK','ORG','USER','UPLOAD'].includes(item.selectType)">
                  {{ `${item.fieldName} | ${item.dataType}(${item.charMaxLength}) | ${getFormatSelectType(item.selectType)}` }}
                </div>
                <div v-else-if="['DICTIONARY','RADIO','CODE','COLOR','ENTITY','TEXT','RICHTEXT','SCRIPT'].includes(item.selectType)">
                  {{ `${item.fieldName} | ${getFormatSelectType(item.selectType)}` }}
                </div>
                <div v-else-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT'].includes(item.selectType)">
                  {{ `${item.fieldName} | ${item.dataType}(${item.numericPrecision}) | ${getFormatSelectType(item.selectType)}` }}
                </div>
                <div v-else-if="['DECIMAL','SCORE'].includes(item.selectType)">
                  {{ `${item.fieldName} | ${item.dataType}(${item.numericPrecision}, ${item.numericScale}) | ${getFormatSelectType(item.selectType)}` }}
                </div>
                <div v-else>
                  {{ `${item.fieldName} | ${getFormatSelectType(item.selectType)}` }}
                </div>
              </div>
            </a-card>
          </a-space>
        </a-form-item>
      </a-col>

      <!--   组织用户特供   -->
      <a-divider v-if="['ORG','USER'].includes(formData.selectType)" style="margin: 5px 0;"/>
      <a-col v-if="['ORG','USER'].includes(formData.selectType)" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.autoAdd')"
                     :tooltip="$t('model.column.index.form.autoAdd.tip')"
                     field="autoAdd">
          <a-checkbox-group v-model="formData.autoAdd"
                            :max="1"
                            @change="autoAddChange(formData.autoAdd.toString())">
            <a-checkbox value="1">{{ $t('model.column.index.form.autoAdd.1') }}</a-checkbox>
            <a-checkbox value="0">{{ $t('model.column.index.form.autoAdd.0') }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-col>
      <a-col v-if="formData.autoAdd.toString()==='1'" :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.column.index.form.autoName')"
            :rules="[{required: formData.autoAdd.toString()==='1',message: $t('model.form.rules.match.required')},
            {match: /^[a-z][a-z0-9_]+$/,message:$t('model.form.rules.match.columnName.match')}]"
            :tooltip="$t('model.column.index.form.autoName.tip')"
            field="autoName">
          <a-input v-model="formData.autoName" :max-length="32" @blur="autoNameBlur($event)"/>
        </a-form-item>
      </a-col>

      <a-divider style="margin: 5px 0;"/>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.nullable')" field="nullable">
          <a-radio-group v-model="formData.nullable"
                         :options="nullableOptions"
                         :rules="[{required: true,message: $t('model.form.rules.match.required')}]">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.key')" field="key">
          <a-radio-group v-model="formData.key"
                         :options="keyOptions"
                         :rules="[{required: true,message: $t('model.form.rules.match.required')}]">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <!--  数值类型，自动递增    -->
      <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT'].includes(formData.selectType)&&formData.key===1" :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.autoIncrement')" field="autoIncrement">
          <a-radio-group v-model="formData.autoIncrement" :options="autoIncrementOptions">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('model.column.index.form.uniqued')" field="key">
          <a-radio-group v-model="formData.uniqued"
                         :options="uniquedOptions"
                         :rules="[{required: true,message: $t('model.form.rules.match.required')}]">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {FormInstance, Modal, Notification} from "@arco-design/web-vue";
import {ListUrlParams, PageQueryRequest} from '@/api/base';
import {
  autoIncrementOptions,
  columnSelectType,
  enableStatusOptions,
  keyOptions,
  nullableOptions,
  numericSignedOptions,
  selectTypeOptions,
  uniquedOptions
} from "@/views/model/column/searchTable";
import {
  ColumnSelectType,
  createOrUpdateTableColumn as createOrUpdateForm,
  getTableColumn as getForm,
  QueryMultiComponentForm,
  QueryTableColumnForm as QueryForm,
  QueryTableForm,
  queryTables,
  validateTableColumnName
} from '@/api/model';
import {formatSeparator,  toCamelCase} from '@/utils/strings';
import {isBlank, isNotBlank} from '@/utils/is';
import {useRoute} from "vue-router";
import {QueryDictForm, queryDicts} from "@/api/security";
import {QueryEncodingForm, queryEncodings} from "@/api/encoding";

// 国际化
const {t} = useI18n();
const route = useRoute();
const pageData = ref({
  formState: 'add', button: true, formCol: 1,
  mainTable: '', maxNumber: -1, editName: true
});
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
    selectType: 'VARCHAR',
    extra: '', // 特别 auto_increment
    autoIncrement: 0, // auto_increment
    uniqued: 0, // 唯一约束
    charMaxLength: 64, // 长度
    numericPrecision: 0, // 整数位
    numericScale: 0, // 小数位
    numericSigned: 0, // 是否有符号，默认有，若无符号，则需在type中增加：unsigned
    datetimePrecision: '', // datetime 时间类型
    enableStatus: 1, // 状态
    linked: 0, // 链接
    description: '', // 描述
    isRefColumn: false,  // 1-外表字段，默认0
    refLocalCol: '', // isRefColumn为true时，需要通过本表引用字段
    refTables: '', // 外表表名
    refColName: '', // 外表字段名称
    autoAdd: '',
    autoName: '',
    seqNo: 1,
    tenantCode: (route.params && route.params.tenantCode as string) || '',
  };
}
const formData = ref(generateFormData());
const selectData = ref({fixed: false, max: 21845, min: 0, digit: 5, precision: 0});
const multiComponentData = ref<QueryMultiComponentForm[]>([]);
const generateMultiComponentData = (): QueryMultiComponentForm => {
  return {
    title: '', fieldName: '', selectType: 'VARCHAR', dataType: 'VARCHAR',
    charMaxLength: 64, numericPrecision: 0, numericScale: 0, isEdit: true,
    // eslint-disable-next-line no-use-before-define
    columnSelectType: formatSelectType('VARCHAR')
  };
}
const validateMulti = () => {
  let isValid = true;
  if (multiComponentData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of multiComponentData.value) {
      item.isEdit = false;
      if (!item.title || !item.fieldName || !item.selectType) {
        item.isEdit = true;
        isValid = false;
      }
    }
  }
  if (!isValid) {
    Notification.warning(t('model.column.index.multi.valid.text'));
  }
  return isValid;
}
const clickAddMulti = (ev?: MouseEvent) => {
  if (validateMulti()) {
    multiComponentData.value.push(generateMultiComponentData());
  }
}
const clickEditMulti = (data: QueryMultiComponentForm) => {
  if (validateMulti()) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of multiComponentData.value) {
      if (item.fieldName === data.fieldName) {
        item.isEdit = true;
      } else {
        item.isEdit = false;
      }
    }
  }
}
const clickSaveMulti = (data: QueryMultiComponentForm) => {
  if (validateMulti()) {
    data.isEdit = false;
  }
}
const clickDeleteMulti = (data: QueryMultiComponentForm) => {
  if (multiComponentData.value.length > 0) {
    const indexs = [];
    for (let i = 0; i < multiComponentData.value.length; i += 1) {
      multiComponentData.value[i].isEdit = false;
      if (multiComponentData.value[i].fieldName === data.fieldName) {
        indexs.push(i);
      }
    }
    for (let i = 0; i < indexs.length; i += 1) {
      multiComponentData.value.splice(indexs[i], 1);
    }
  }
}
const getMultiData = () => {
  if (multiComponentData.value.length > 0) {
    const indexs = [];
    for (let i = 0; i < multiComponentData.value.length; i += 1) {
      const item = multiComponentData.value[i];
      delete item.isEdit;
      delete item.columnSelectType;
      if (!item.title || !item.fieldName || !item.selectType) {
        indexs.push(i);
      }
    }
    for (let i = 0; i < indexs.length; i += 1) {
      multiComponentData.value.splice(indexs[i], 1);
    }
  }
  return multiComponentData.value.length > 0 ? JSON.stringify(multiComponentData.value) : '';
}
const selectTypeMultiChange = (data: QueryMultiComponentForm) => {
  // eslint-disable-next-line no-use-before-define
  data.columnSelectType = formatSelectType(data.selectType);
  // 数据类型
  data.dataType = data.columnSelectType.mysql && data.columnSelectType.mysql.toUpperCase();
  // 字符串 默认长度
  if (data.columnSelectType.extent > 0) {
    data.charMaxLength = data.columnSelectType.extent;
  } else if (['CHAR', 'VARCHAR', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT'].includes(data.dataType)) {
    data.charMaxLength = data.columnSelectType.radius.max;
  }
  // 数值 默认长度
  if (['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'BIGINT'].includes(data.selectType)) {
    data.numericPrecision = data.columnSelectType.radius.digit;
    data.numericScale = data.columnSelectType.radius.precision;
  }
  if (['DECIMAL'].includes(data.selectType)) {
    data.numericPrecision = 12;
    data.numericScale = 2;
  }
  if (['SCORE'].includes(data.selectType)) {
    data.numericPrecision = 3;
    data.numericScale = 1;
  }
}
const loadMultiData = (list: QueryMultiComponentForm[]) => {
  if (list != null && list.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of list) {
      item.isEdit = false;
      selectTypeMultiChange(item);
    }
  }
  return list;
}

const selectDictionaryOptions = ref<QueryDictForm[]>([]);
const getSelectDictionaryOptions = async () => {
  try {
    const {data} = await queryDicts({
      enableStatus: 1,
      appId: (route.params && route.params.appId as string) || '',
      tenantCode: (route.params && route.params.tenantCode as string) || '',
    } as unknown as QueryDictForm);
    selectDictionaryOptions.value = data || [];
  } catch (err) {
    selectDictionaryOptions.value = [];
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
const selectCodeOptions = ref<QueryEncodingForm[]>([]);
const getSelectCodeOptions = async () => {
  try {
    const {data} = await queryEncodings({
      enableStatus: 1,
      appId: (route.params && route.params.appId as string) || '',
      tenantCode: (route.params && route.params.tenantCode as string) || '',
    } as unknown as QueryEncodingForm);
    selectCodeOptions.value = data || [];
  } catch (err) {
    selectCodeOptions.value = [];
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
const selectEntityOptions = ref<QueryTableForm[]>([]);
const getSelectEntityOptions = async (params: PageQueryRequest = {
  appId: (route.params && route.params.appId as string) || '',
  tenantCode: (route.params && route.params.tenantCode as string) || '',
  enableStatus: 1, tableType: 'table'
} as unknown as PageQueryRequest) => {
  try {
    const {data} = await queryTables(params);
    selectEntityOptions.value = data;
  } catch (err) {
    selectEntityOptions.value = [];
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    params.autoAdd = Number(params.autoAdd.toString());
    params.defaultValue = params.defaultValue && params.defaultValue.toString();
    if (['MULTICOMPONENT'].includes(params.selectType)) {
      params.defaultValue = getMultiData();
    }
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

const formatFieldString = (value: string) => {
  value = formatSeparator(value, " ").join("_");
  value = formatSeparator(value, "_").join("_");
  return value.toLowerCase();
}
/**
 * 字段名称 生成 字段名称
 */
const columnNameBlur = (ev: FocusEvent) => {
  formData.value.name = formatFieldString(formData.value.name);
  validateForm.value?.validateField("name");
  formData.value.fieldName = toCamelCase(formData.value.name);
  // eslint-disable-next-line no-use-before-define
  autoNameBlur();
}

const formatSelectType = (value: string): ColumnSelectType => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of columnSelectType) {
    if (item.value === value) {
      if (value === "SCORE") {
        item.radius = {max: 10000, min: 0, digit: 5, unDigit: 5, precision: 2};
      } else {
        item.radius = item.radius ? item.radius : {max: 1, min: 1, digit: 1, unDigit: 1, precision: 0};
        // 数据类型范围处理
        // eslint-disable-next-line no-restricted-globals
        item.radius.max = !isNaN(item.radius.max) ? Number(item.radius.max) : 0;
        // eslint-disable-next-line no-restricted-globals
        item.radius.min = !isNaN(item.radius.min) ? Number(item.radius.min) : 0;
        // eslint-disable-next-line no-restricted-globals
        item.extent = !isNaN(item.extent) ? Number(item.extent) : 0;
      }
      return item;
    }
  }
  return {} as unknown as ColumnSelectType;
}

const selectTypeChange = (value: string) => {
  const cst: ColumnSelectType = formatSelectType(formData.value.selectType);
  // 清理数据
  formData.value.autoAdd = '';
  formData.value.autoName = '';
  formData.value.charMaxLength = 0;
  formData.value.defaultValue = '';
  formData.value.numericPrecision = 0;
  formData.value.numericScale = 0;
  formData.value.numericSigned = 0;
  formData.value.autoIncrement = 0;
  // 数据类型
  formData.value.dataType = cst.mysql && cst.mysql.toUpperCase();
  // 字符串 默认长度
  if (cst.extent > 0) {
    formData.value.charMaxLength = cst.extent;
  } else if (['CHAR', 'VARCHAR', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT'].includes(formData.value.dataType)) {
    formData.value.charMaxLength = cst.radius.max;
  }
  // 长度限制
  selectData.value.fixed = cst.fixed;
  selectData.value.max = cst.radius.max;
  selectData.value.min = cst.radius.min;
  selectData.value.digit = formData.value.numericSigned ? cst.radius.digit : cst.radius.unDigit;
  selectData.value.precision = cst.radius.precision;
  // 数值 默认长度
  if (['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'BIGINT', 'DECIMAL', 'SCORE'].includes(formData.value.selectType)) {
    if (['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'BIGINT'].includes(formData.value.selectType)) {
      formData.value.numericPrecision = cst.radius.digit;
      formData.value.numericScale = cst.radius.precision;
    }
    if (['DECIMAL'].includes(formData.value.selectType)) {
      formData.value.numericPrecision = 12;
      formData.value.numericScale = 2;
    }
    if (['SCORE'].includes(formData.value.selectType)) {
      formData.value.numericPrecision = 3;
      formData.value.numericScale = 1;
    }
    // eslint-disable-next-line no-use-before-define
    numericPrecisionBlur();
  }
  // 布尔值 开关
  if (['SWITCH'].includes(formData.value.selectType)) {
    formData.value.defaultValue = '0';
  }
}
const numericPrecisionBlur = (ev?: FocusEvent) => {
  const cst: ColumnSelectType = formatSelectType(formData.value.selectType);
  // 最大、最小 限制
  selectData.value.digit = formData.value.numericSigned ? cst.radius.digit : cst.radius.unDigit;
  selectData.value.max = formData.value.numericSigned ? cst.radius.max : (cst.radius.max - cst.radius.min);
  selectData.value.min = formData.value.numericSigned ? cst.radius.min : 0;
  // 表单整数位、小数位 限制
  const currentMaxScale = ((10 ** formData.value.numericScale - 1) / 10 ** formData.value.numericScale);
  const currentMaxPrecision = 10 ** formData.value.numericPrecision - 1;
  const currentMax = currentMaxPrecision + currentMaxScale;
  selectData.value.max = currentMax > selectData.value.max ? selectData.value.max : currentMax;
  selectData.value.min = (0 - currentMax) < selectData.value.min ? selectData.value.min : (0 - currentMax);
  // 评分默认值
  if (['SCORE'].includes(formData.value.selectType)) {
    setTimeout(() => {
      formData.value.defaultValue = '';
      formData.value.defaultValue = Number(formData.value.numericPrecision <= 1 ? 5 : 10 ** (formData.value.numericPrecision - 1));
    }, 50);
  }
}
const numericScaleBlur = (ev?: FocusEvent) => {
  numericPrecisionBlur();
}
const numericSignedChange = (value: boolean, ev?: Event) => {
  numericPrecisionBlur();
}

const autoNameBlur = (ev?: FocusEvent) => {
  formData.value.autoName = formatFieldString(formData.value.autoName);
  if (formData.value.name === formData.value.autoName) {
    formData.value.autoName = '';
  }
  if (formData.value.autoAdd.toString() === '1' && isNotBlank(formData.value.name)) {
    if (isBlank(formData.value.autoName)) {
      if (formData.value.name.endsWith('id')) {
        formData.value.autoName = formData.value.name.replace('id', 'name');
      } else if (formData.value.name.endsWith('name')) {
        formData.value.autoName = formData.value.name.replace('name', 'id');
      }
    }
  } else {
    formData.value.autoName = '';
  }
  validateForm.value?.validateField("autoName");
}
const autoAddChange = (value: string) => {
  autoNameBlur();
}
const getFormatSelectType = (value: string): string => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of columnSelectType) {
    if (item.value === value) {
      return item.label;
    }
  }
  return '';
}

const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};
/**
 * 唯一性校验
 * @param value
 * @param callback
 */
const validateCode = async (value: any, callback: any) => {
  try {
    const params = {...formData.value};
    params.autoAdd = Number(params.autoAdd.toString());
    params.defaultValue = params.defaultValue && params.defaultValue.toString();
    const {data} = await validateTableColumnName(params);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

/* 对外调用方法 */
const loadModel = (urlParams: ListUrlParams) => {
  getSelectDictionaryOptions();
  getSelectCodeOptions();
  getSelectEntityOptions();
  // 全局
  pageData.value.formState = urlParams.action || "view";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.formCol = urlParams.formCol || 1;
  pageData.value.editName = urlParams.params?.editName || false;
  formData.value = generateFormData();
  formData.value.tableId = urlParams.params?.pId || '';
  formData.value.tableName = urlParams.params?.pName || '';
// 重置验证
  resetValidate();
  multiComponentData.value = [generateMultiComponentData()];
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
      data.isRefColumn = data.isRefColumn === true ? 1 : 0;
      data.autoAdd = [(data.autoAdd === true ? 1 : 0).toString()];
      if (['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'BIGINT', 'DECIMAL', 'SCORE'].includes(data.selectType)) {
        data.defaultValue = (data.defaultValue == null || data.defaultValue === '') ? data.defaultValue : Number(data.defaultValue);
      }
      if (['BIT', 'SWITCH'].includes(data.selectType)) {
        data.defaultValue = (data.defaultValue == null || data.defaultValue === '') ? '' : data.defaultValue.toString();
      }
      if (['MULTICOMPONENT'].includes(data.selectType)) {
        multiComponentData.value = (data.defaultValue == null || data.defaultValue === '' || data.defaultValue === '[]')
          ? [generateMultiComponentData()] : loadMultiData(JSON.parse(data.defaultValue as string) as QueryMultiComponentForm[]);
      }

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