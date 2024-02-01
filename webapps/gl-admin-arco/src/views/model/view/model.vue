<template v-model="pageData">
  <a-form
      ref="validateForm" :label-col-props="{ span: 6 }" :model="formData" :wrapper-col-props="{ span: 18 }"
      class="form">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item v-show="false">
          <a-input v-show="false" v-model="formData.id"/>
          <a-input v-show="false" v-model="formData.connectId"/>
          <a-input v-show="false" v-model="formData.entityName"/>
          <a-input v-show="false" v-model="formData.viewConstruct"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.view.index.form.title')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="title">
          <a-input v-if="pageData.button" v-model.trim="formData.title" :max-length="32"/>
          <span v-else>{{ formData.title }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.view.index.form.viewName')"
            :rules="[{required: pageData.formState==='add',message: $t('model.form.rules.match.required')},
            {match: /^[a-zA-Z][a-zA-Z0-9_]*$/,message:$t('model.form.rules.match.viewName.match')},
            {match:pageData.formState==='add'?/^(?!v_|V_)/:/^[vV][a-zA-Z0-9_]*$/,message:$t('model.form.rules.match.viewName.match')},
            {validator:validateCode}]"
            field="viewName">
          <a-input v-if="pageData.formState==='add'" v-model.trim="formData.viewName" :max-length="32" @blur="viewNameBlur($event)">
            <template #prepend>
              v_
            </template>
          </a-input>
          <span v-else>{{ formData.viewName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.view.index.form.viewType')"
            :rules="[{required: pageData.formState==='add',message: $t('model.form.rules.match.required')}]"
            field="viewType">
          <!-- <a-select v-model="formData.viewType">
                      <a-option v-for="item of viewTypeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
                    </a-select>-->
          <span>{{ $t(`model.view.index.form.viewType.${formData.viewType}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
            :label="$t('model.view.index.form.viewConstruct')"
            :label-col-props="{ span: (pageData.formCol===1?6:3) }"
            :rules="[{required: true,message: $t('model.form.rules.match.required')},
            {match:/^select .* from .*$/i,message:$t('model.form.rules.match.viewSql.match')}]"
            :wrapper-col-props="{ span: (pageData.formCol===1?18:21) }"
            field="viewConstruct">
          <a-space>
            <a-trigger :popup-offset="5" :unmount-on-close="false" position="left" show-arrow trigger="click">
              <a-button>
                {{ $t('model.view.index.form.viewConstruct.edit') }}
                <template #icon>
                  <icon-edit/>
                </template>
              </a-button>
              <template #content>
                <div
                    :style="{width:`${pageStyle.width}px`,height:`${pageStyle.height}px`}"
                    class="trigger-demo-translate">
                  <MonacoEditor
                      v-model="formData.viewConstruct"
                      :language="'sql'"
                      :read-only="false"
                      :theme="pageStyle.theme"
                      @editor-mounted="editorMounted"/>
                </div>
              </template>
            </a-trigger>
            <a-popconfirm
                :content="$t('model.view.index.form.viewConstruct.validateMsg')"
                position="tr" type="info" @ok="validateViewSql">
              <a-button status="success" type="primary">
                {{ $t('model.view.index.form.viewConstruct.validate') }}
                <template #icon>
                  <icon-scan/>
                </template>
              </a-button>
            </a-popconfirm>
          </a-space>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.view.index.form.enableStatus')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="pageData.button" v-model="formData.enableStatus">
            <a-option
                v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)"
                :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.view.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.view.index.form.linked')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="linked">
          <a-select v-if="pageData.button" v-model="formData.linked">
            <a-option v-for="item of linkedOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.view.index.form.linked.${formData.linked}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.view.index.form.seqNo')"
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
            :label="$t('model.view.index.form.description')"
            :label-col-props="{ span: (pageData.formCol===1?6:3) }"
            :wrapper-col-props="{ span: (pageData.formCol===1?18:21) }"
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
  <a-divider style="margin: 0 0 10px 0"/>
  <a-space v-if="pageData.button" style="margin-bottom: 10px">
    <a-button size="medium" type="primary" @click="customAddEntityClick($event)">
      <icon-plus/>
      {{ $t('model.view.index.form.entity.custom') }}
    </a-button>
    <a-popover v-model:popup-visible="entityPopover" position="left" trigger="click" style="max-width: 400px">
      <a-button size="medium" type="primary" @click="entityPopoverClick($event)">
        <icon-plus/>
        {{ $t('model.view.index.form.entity.model') }}
      </a-button>
      <template #content>
        <a-form ref="validateEntityForm" :label-col-props="{ span: 6 }" :model="entityData" :wrapper-col-props="{ span: 18 }" class="form2">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item :label="$t('model.view.index.form.entity.tableId')"
                           :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                           field="tableId">
                <a-select v-model="entityData.tableId" allow-search @change="entityChange">
                  <a-option v-for="item of selectEntityOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.id"/>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="$t('model.view.index.form.entity.columnIds')"
                           :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                           field="columnIds">
                <a-select v-if="pageData.button" v-model="entityData.columnIds" allow-search multiple>
                  <a-option v-for="item of selectEntityColumnOptions" :key="item.id" :label="`${item.title}[${item.fieldName}]`" :value="item.id"/>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-divider style="margin: 5px 0px"/>
        <a-space style="display: flex;align-items: center;justify-content: end;">
          <a-button size="medium" type="primary" @click="entitySubmitClick($event)">
            确定
          </a-button>
        </a-space>
      </template>
    </a-popover>
  </a-space>
  <a-table
      :bordered="{cell:true}"
      :columns="columnTitle"
      :data="(columnData as TableData[])"
      :draggable="pageData.button?{type:'handle',width:40}:{}"
      :pagination="false"
      :stripe="true"
      column-resizable
      row-key="id" @change="handleChange">
    <template #columns>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.title')" :tooltip="true" :width="150" data-index="title" fixed="left">
        <template #cell="{record}">
          <a-input v-if="pageData.button" v-model.trim="record.title" :max-length="32"/>
          <span v-else>{{ record.title }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.name')" :tooltip="true" :width="120" data-index="name">
        <template #cell="{record}">
          <a-input v-if="pageData.button&&!record.tableName" v-model.trim="record.name" :max-length="32"/>
          <span v-else>{{ record.name }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.fieldName')" :tooltip="true" :width="150" data-index="fieldName">
        <template #cell="{record}">
          <a-input v-if="pageData.button" v-model.trim="record.fieldName" :max-length="32"/>
          <span v-else>{{ record.fieldName }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.dataType')" :tooltip="true" :width="120" data-index="selectType">
        <template #cell="{record}">
          <a-select v-if="pageData.button" v-model="record.selectType" :options="selectTypeOptions" allow-search/>
          <span v-else>{{ formatSelectType(record.selectType) }}</span>
        </template>
      </a-table-column>
      <!--     <a-table-column :title="$t('model.column.index.form.key')" :width="100" data-index="key"/>-->
      <!--      <a-table-column :title="$t('model.column.index.form.nullable')" :width="100" data-index="nullable"/>-->
      <!--      <a-table-column :title="$t('model.column.index.form.charMaxLength')" :width="100" data-index="charMaxLength"/>-->
      <!--      <a-table-column :title="$t('model.column.index.form.precision')" :width="100" data-index="precision"/>-->
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.tableName')" :tooltip="true" :width="120" data-index="tableName"/>
      <a-table-column v-if="pageData.button" :title="$t('model.column.index.form.operations')" :width="80" align="center"
                      data-index="operations" fixed="right">
        <template #cell="{record}">
          <a-button status="danger" type="text" @click="deleteViewColumn(record.tableName,record.fieldName)">
            <template #icon>
              <icon-delete/>
            </template>
          </a-button>
        </template>
      </a-table-column>
    </template>
    <template #empty>
      <a-empty style="width: 57%;"/>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {FormInstance, Modal, Notification, TableData} from "@arco-design/web-vue";
import {ListUrlParams, PageQueryRequest} from '@/api/base';
import {
  createOrUpdateView as createOrUpdateForm,
  getView as getForm,
  QueryTableColumnForm,
  queryTableColumns,
  QueryTableForm,
  queryTables,
  QueryViewColumnForm,
  QueryViewForm as QueryForm,
  validateMetaView,
  validateViewName
} from '@/api/model';
import {enableStatusOptions, linkedOptions} from "@/views/model/view/searchTable";
import MonacoEditor from '@/components/monaco/index.vue';
import {useRoute} from "vue-router";
import {columnSelectType, selectTypeOptions} from "@/views/model/column/searchTable";

const pageData = ref({formState: 'add', button: true, formCol: 1});
const validateForm = ref<FormInstance>();
const validateEntityForm = ref<FormInstance>();
// 国际化
const {t} = useI18n();
const route = useRoute();
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || ''
});
// 页面样式
const resetPageStyle = () => {
  return {
    width: document.documentElement.clientWidth / 2,
    height: document.documentElement.clientHeight * 2 / 3,
    theme: document.body.getAttribute('arco-theme') === 'dark' ? 'vs-dark' : 'vs'
  };
}
const pageStyle = ref(resetPageStyle());
// html 属性变化监听
const bodyObserver = new MutationObserver(function (mutations, instance) {
  mutations.forEach(function (mutation) {
    pageStyle.value = resetPageStyle();
  });
});
// bodyObserver.observe(document.body, {attributes: true, attributeFilter: ["arco-theme"]});

/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: '',
    connectId: '', // 数据库连接 id
    entityName: '', // 实体名称
    title: '', // 名称(中文)
    viewName: '', // 数据库中的表名
    viewType: 'custom', // 视图类型 default:默认视图;custom:自定义视图
    viewConstruct: '',
    viewColumn: '',
    enableStatus: 1, // 状态
    seqNo: 1, // 排序
    linked: 0, // 已链接
    description: '', // 补充描述
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode,
  };
}
const formData = ref(generateFormData());
// 表单
const columnData = ref<QueryViewColumnForm[]>([]);
const handleChange = (_data: any[]) => {
  columnData.value = _data;
}

const viewColumnListToMysql = (): string => {
  const data = [];
  if (columnData.value && columnData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of columnData.value) {
      data.push({
        table_name: item.tableName,
        title: item.title,
        column_name: item.name,
        field_name: item.fieldName,
        select_type: item.selectType,
        column_comment: item.comment,
        column_key: item.key,
        is_nullable: item.nullable,
        character_maxinum_length: item.charMaxLength,
        numeric_precision: item.precision,
        numeric_scale: item.scale
      });
    }
  }

  return JSON.stringify(data);
}

const viewColumnMysqlToList = (viewColumn: string) => {
  const columns = viewColumn ? JSON.parse(viewColumn) : [];
  const data = [];
  if (columns && columns.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of columns) {
      data.push({
        tableName: item.table_name,
        title: item.title,
        name: item.column_name,
        fieldName: item.field_name,
        selectType: item.select_type,
        comment: item.column_comment,
        key: item.column_key,
        nullable: item.is_nullable,
        charMaxLength: item.character_maxinum_length,
        precision: item.numeric_precision,
        scale: item.numeric_scale
      });
    }
  }

  return data;
}

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    params.viewName = pageData.value.formState === 'add' ? `v_${params.viewName}` : params.viewName;
    params.viewColumn = viewColumnListToMysql();
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
const validateTableView = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await validateMetaView(params.connectId, params.viewConstruct);
      successBack(data);
    } catch (err) {
      failBack(err);
    }
  } else {
    failBack();
  }
};

const viewNameBlur = (ev?: FocusEvent) => {
  const entity = formData.value.entityName.toLowerCase();
  const view = formData.value.viewName ? formData.value.viewName.toLowerCase() : "";
  if (formData.value.viewType === "custom" && entity === view) {
    Notification.warning(`[v_${entity}]${t('model.view.index.form.entityName.valid')}`);
  }
  formData.value.viewName = view;
}
const editorMounted = (editor: any) => {
  console.log('editor实例加载完成', editor)
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
    if (params.viewName && !params.viewName.startsWith("v_")) params.viewName = `v_${params.viewName}`;
    const {data} = await validateViewName(params);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

const validateViewSql = () => {
  validateTableView(formData.value, (result: boolean) => {
    if (result === true) {
      Notification.success(t('model.view.index.model.viewSql.valid.success'));
    } else {
      Notification.error(t('model.view.index.model.viewSql.valid.fail'));
    }
  }, () => {
  });
}

const deleteViewColumn = (tableName: string, columnName: string) => {
  let index = -1;
  for (let i = 0; i < columnData.value.length; i += 1) {
    if (columnData.value[i].tableName === tableName && columnData.value[i].fieldName === columnName) {
      index = i;
    }
  }
  columnData.value.splice(index, 1);
}

const formatSelectType = (value: string): string => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of columnSelectType) {
    if (item.value === value) {
      return item.label;
    }
  }
  return '';
}

/**
 * 添加，自定义字段
 */
const customAddEntityClick = (ev?: MouseEvent) => {
  columnData.value.push({
    tableName: "",
    title: "",
    name: "",
    fieldName: "",
    selectType: "VARCHAR"
  } as QueryViewColumnForm);
}
/**
 * 添加，模型字段
 */
const entityPopover = ref(false);
const entityData = ref({tableId: '', columnIds: []});
const selectEntityOptions = ref<QueryTableForm[]>([]);
const getSelectEntityOptions = async (params: PageQueryRequest = {
  enableStatus: 1,
  tableType: 'table', ...routeParams.value
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
const selectEntityColumnOptions = ref<QueryTableColumnForm[]>([]);
const getSelectEntityColumnOptions = async (params: PageQueryRequest = {
  enableStatus: 1, tableId: entityData.value.tableId, ...routeParams.value
} as unknown as PageQueryRequest) => {
  try {
    if (entityData.value.tableId) {
      const {data} = await queryTableColumns(params);
      selectEntityColumnOptions.value = data;
    } else {
      selectEntityColumnOptions.value = [];
    }
  } catch (err) {
    selectEntityColumnOptions.value = [];
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const entityChange = (value?: string) => {
  entityData.value.columnIds = [];
  selectEntityColumnOptions.value = [];
  getSelectEntityColumnOptions();
}
const entityPopoverClick = async (ev?: MouseEvent) => {
  entityData.value = {tableId: "", columnIds: []};
  await validateEntityForm.value?.resetFields();
  entityPopover.value = true;
}
const entitySubmitClick = async (ev?: MouseEvent) => {
  const res = await validateEntityForm.value?.validate();
  if (!res) {
    entityPopover.value = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const entity of entityData.value.columnIds) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of selectEntityColumnOptions.value) {
        if (item.id === entity) {
          columnData.value.push({
            tableName: item.tableName,
            title: item.title,
            name: item.name,
            fieldName: item.fieldName,
            selectType: item.selectType,
            comment: item.comment,
            key: item.key,
            nullable: item.nullable,
            charMaxLength: item.charMaxLength,
            precision: item.numericPrecision,
            scale: item.numericScale
          });
        }
      }
    }
    console.log(entityData.value);
  }
}

/* 对外调用方法 */
const loadModel = (urlParams: ListUrlParams) => {
  getSelectEntityOptions();
  columnData.value = [];
  // 全局
  pageData.value.formState = urlParams.action || "view";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.formCol = urlParams.formCol || 1;
  formData.value = generateFormData();
  formData.value.connectId = urlParams.params?.connectId || '';
  formData.value.entityName = urlParams.params?.entityName || '';
  // 重置验证
  resetValidate();
  pageStyle.value = resetPageStyle();
  // 特色
  if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      data.seqNo = Number(data.seqNo);
      columnData.value = viewColumnMysqlToList(data.viewColumn);
      // data.viewName = data.viewName == null ? '' : data.viewName.replace(/^(v_|V_)*/, "");
      formData.value = data;
      console.log(columnData.value)
      urlParams.loadSuccessBack(data);
    }, urlParams.loadFailBack);
  }
}
const submitModel = (done: any, successBack?: any, failBack?: any) => {
  createOrUpdateData(formData.value, successBack, failBack);
};

// 将方法暴露出去
defineExpose({loadModel, submitModel});

const columnTitle = reactive([
  {
    title: '名称',
    dataIndex: 'title',

  },
  {
    title: '标识',
    dataIndex: 'name',
  }, {
    title: '操作',
    dataIndex: 'operations'
  }
]);
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

.trigger-demo-translate {
  padding: 10px;
  min-width: 500px;
  min-height: 360px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}

.tree-extra-icon {
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  color: #3370ff;
}
</style>