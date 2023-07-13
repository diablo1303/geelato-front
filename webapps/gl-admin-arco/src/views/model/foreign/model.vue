<template v-model="pageData">
  <a-form
      ref="validateForm" :label-col-props="{ span: 8 }" :model="formData" :wrapper-col-props="{ span: 16 }"
      class="form">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item v-show="false">
          <a-input v-show="false" v-model="formData.id"/>
          <a-input v-show="false" v-model="formData.updateAction"/>
          <a-input v-show="false" v-model="formData.deleteAction"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.mainTable')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="mainTable">
          <a-select
              v-if="pageData.button" v-model="formData.mainTable" :disabled="pageData.mainTable!==''" allow-search
              @change="mainTableChange(formData.mainTable)">
            <a-option v-for="item of tableOptions" :key="item.id" :label="item.entityName" :value="item.entityName"/>
          </a-select>
          <span v-else>{{ formData.mainTable }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.mainTableCol')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="mainTableCol">
          <a-select v-if="pageData.button" v-model="formData.mainTableCol" allow-search>
            <a-option v-for="item of mainTableColOptions" :key="item.id" :label="item.name" :value="item.name"/>
          </a-select>
          <span v-else>{{ formData.mainTableCol }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.foreignTable')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="foreignTable">
          <a-select v-if="pageData.button" v-model="formData.foreignTable" allow-search @change="foreignTableChange">
            <a-option v-for="item of tableOptions" :key="item.id" :label="item.entityName" :value="item.entityName"/>
          </a-select>
          <span v-else>{{ formData.foreignTable }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.foreignTableCol')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="foreignTableCol">
          <a-select v-if="pageData.button" v-model="formData.foreignTableCol" allow-search>
            <a-option v-for="item of foreignTableColOptions" :key="item.id" :label="item.name" :value="item.name"/>
          </a-select>
          <span v-else>{{ formData.foreignTableCol }}</span>
        </a-form-item>
      </a-col>
      <!-- <a-col :span="24/pageData.formCol">
              <a-form-item :label="$t('model.foreign.index.form.updateAction')"
                           :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                           :tooltip="$t('model.foreign.index.form.action.tip')" field="updateAction">
                <a-select v-model="formData.updateAction">
                  <a-option value="RESTRICT">RESTRICT</a-option>
                  <a-option value="NO ACTION">NO ACTION</a-option>
                  <a-option value="SET NULL">SET NULL</a-option>
                  <a-option value="CASCADE">CASCADE</a-option>
                </a-select>
              </a-form-item>
            </a-col>-->
      <!-- <a-col :span="24/pageData.formCol">
              <a-form-item :label="$t('model.foreign.index.form.deleteAction')"
                           :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                           :tooltip="$t('model.foreign.index.form.action.tip')" field="deleteAction">
                <a-select v-model="formData.deleteAction">
                  <a-option value="RESTRICT">RESTRICT</a-option>
                  <a-option value="NO ACTION">NO ACTION</a-option>
                  <a-option value="SET NULL">SET NULL</a-option>
                  <a-option value="CASCADE">CASCADE</a-option>
                </a-select>
              </a-form-item>
            </a-col>-->
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.enableStatus')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="pageData.button" v-model="formData.enableStatus">
            <a-option
                v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)"
                :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.foreign.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.seqNo')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="seqNo">
          <a-input-number
              v-if="pageData.button"
              v-model="formData.seqNo"
              :max="999999"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,999999]'"
              :precision="0"/>
          <span v-else>{{ formData.seqNo }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
            :label="$t('model.foreign.index.form.description')"
            :label-col-props="{ span: (pageData.formCol===1?8:4) }"
            :wrapper-col-props="{ span: (pageData.formCol===1?16:20) }"
            field="description">
          <a-textarea
              v-if="pageData.button" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}"
              :max-length="512" show-word-limit/>
          <span
              v-else :title="formData.description" class="textarea-span"
              @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {Modal} from "@arco-design/web-vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {ListUrlParams, PageQueryRequest} from '@/api/base';
import {
  createOrUpdateTableForeign as createOrUpdateForm,
  getTableForeign as getForm,
  QueryTableColumnForm,
  queryTableColumns,
  QueryTableForeignForm as QueryForm,
  QueryTableForm,
  queryTables
} from '@/api/model';
import {enableStatusOptions} from "@/views/model/foreign/searchTable";

const pageData = ref({formState: 'add', button: true, formCol: 1, mainTable: ''});
const validateForm = ref<FormInstance>();
const tableOptions = ref<QueryTableForm[]>([]);
const mainTableColOptions = ref<QueryTableColumnForm[]>([]);
const foreignTableColOptions = ref<QueryTableColumnForm[]>([]);
const actionTooltip = ref("");
// 国际化
const {t} = useI18n();
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: '',
    mainTable: '', // 主表表名
    mainTableCol: '', // 主表表名字段
    foreignTable: '', // 外键关联表表名
    foreignTableCol: '', // 外键关联表字段
    updateAction: 'NO ACTION',
    deleteAction: 'NO ACTION',
    enableStatus: 1, // 状态
    description: '',
    seqNo: 999
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

const fetchTables = async (params: PageQueryRequest = {
  enableStatus: 1,
  tableType: 'table'
} as unknown as PageQueryRequest) => {
  try {
    const {data} = await queryTables(params);
    tableOptions.value = data;
  } catch (err) {
    tableOptions.value = [];
  }
}
const fetchTableColumns = async (params: PageQueryRequest = {enableStatus: 1} as unknown as PageQueryRequest): Promise<QueryTableColumnForm[]> => {
  let columnOptions: QueryTableColumnForm[] = [];
  try {
    const {data} = await queryTableColumns(params);
    columnOptions = data;
  } catch (err) {
    columnOptions = [];
  }

  return columnOptions;
}

const mainTableChange = (value: string) => {
  const name = formData.value.mainTable;
  if (name) {
    fetchTableColumns({enableStatus: 1, tableName: name} as unknown as PageQueryRequest).then((data) => {
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
    fetchTableColumns({enableStatus: 1, tableName: value} as unknown as PageQueryRequest).then((data) => {
      foreignTableColOptions.value = data;
    });
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
  // 表单
  fetchTables();
  // 全局
  pageData.value.formState = urlParams.action || "view";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.formCol = urlParams.formCol || 1;
  formData.value = generateFormData();
  pageData.value.mainTable = urlParams.params?.pId || '';
  if (pageData.value.mainTable) {
    mainTableChange(pageData.value.mainTable);
    formData.value.mainTable = pageData.value.mainTable;
  }
  fetchTableColumns({enableStatus: 1, tableName: formData.value.mainTable} as unknown as PageQueryRequest).then((data) => {
    mainTableColOptions.value = data;
  });
// 重置验证
  resetValidate();
// 特色
  if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      mainTableChange(formData.value.mainTable);
      foreignTableChange(formData.value.foreignTable);
      data.seqNo = Number(data.seqNo);
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