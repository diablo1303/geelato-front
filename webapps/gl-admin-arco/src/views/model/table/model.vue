<template v-model="pageData">
  <a-form
      ref="validateForm" :model="formData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
      class="form">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item v-show="false">
          <a-input v-show="false" v-model="formData.id"/>
          <a-input v-show="false" v-model="formData.connectId"/>
          <a-input v-show="false" v-model="formData.tableName"/>
          <a-input v-show="false" v-model="formData.viewSql"/>
          <a-input v-show="false" v-model="formData.seqNo"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.table.index.form.title')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="title">
          <a-input v-if="pageData.button" v-model="formData.title" :max-length="32"/>
          <span v-else>{{ formData.title }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.table.index.form.entityName')"
            :rules="[{required: pageData.formState==='add',message: $t('model.form.rules.match.required')}]"
            field="entityName">
          <a-input v-if="pageData.button" v-model="formData.entityName" :max-length="32"/>
          <span v-else>{{ formData.entityName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.table.index.form.tableName')"
            field="tableName">
          <!-- <a-input v-if="pageData.formState==='add'" v-model="formData.tableName" :max-length="32"/>-->
          <span>{{ formData.tableName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.table.index.form.tableType')"
            :rules="[{required: pageData.formState==='add',message: $t('model.form.rules.match.required')}]"
            field="tableType">
          <a-select v-if="pageData.formState==='add'" v-model="formData.tableType">
            <a-option v-for="item of tableTypeOptions" :key="item.value" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.table.index.form.tableType.${formData.tableType}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col v-show="formData.tableType==='view'" :span="24">
        <a-form-item
            :label="$t('model.table.index.form.viewSql')"
            :label-col-props="{ span: (pageData.formCol===1?6:3) }"
            :wrapper-col-props="{ span: (pageData.formCol===1?18:21) }"
            :rules="[{required: formData.tableType==='view',message: $t('model.form.rules.match.required')}]"
            field="viewSql">
          <a-trigger position="left" trigger="click" :popup-offset="5" :unmount-on-close="false" show-arrow>
            <a-button>
              {{ $t('model.table.index.form.viewSql.edit') }}
              <template #icon>
                <icon-edit/>
              </template>
            </a-button>
            <template #content>
              <div
                  class="trigger-demo-translate"
                  :style="{width:`${pageStyle.width}px`,height:`${pageStyle.height}px`}">
                <MonacoEditor
                    v-model="formData.viewSql"
                    :language="'sql'"
                    :read-only="!pageData.button"
                    :theme="pageStyle.theme"
                    @editor-mounted="editorMounted"/>
              </div>
            </template>
          </a-trigger>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.table.index.form.enableStatus')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="pageData.button" v-model="formData.enableStatus">
            <a-option
                v-for="item of enableStatusOptions" :key="item.value" :label="$t(`${item.label}`)"
                :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.table.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.table.index.form.linked')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="linked">
          <a-select v-if="pageData.button" v-model="formData.linked">
            <a-option v-for="item of linkedOptions" :key="item.value" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.table.index.form.linked.${formData.linked}`) }}</span>
        </a-form-item>
      </a-col>
      <!--      <a-col :span="24/pageData.formCol">
              <a-form-item
                  :label="$t('model.table.index.form.seqNo')"
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
            </a-col>-->
      <a-col :span="24">
        <a-form-item
            :label="$t('model.table.index.form.tableComment')"
            :label-col-props="{ span: (pageData.formCol===1?6:3) }"
            :wrapper-col-props="{ span: (pageData.formCol===1?18:21) }"
            field="tableComment">
          <a-textarea
              v-if="pageData.button" v-model="formData.tableComment" :auto-size="{minRows:2,maxRows:4}"
              :max-length="512" show-word-limit/>
          <span
              v-else :title="formData.tableComment" class="textarea-span"
              @click="openModal(`${formData.tableComment}`)">{{ formData.tableComment }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
            :label="$t('model.table.index.form.description')"
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
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {Modal} from "@arco-design/web-vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {ListUrlParams} from '@/api/service/base_service';
import {createOrUpdateTable as createOrUpdateForm, getTable as getForm, QueryTableForm as QueryForm} from '@/api/service/model_service';
import {enableStatusOptions, linkedOptions, tableTypeOptions} from "@/views/model/table/searchTable";
import MonacoEditor from '@/components/monaco/index.vue';

const pageData = ref({formState: 'add', button: true, formCol: 1});
const validateForm = ref<FormInstance>();

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
    title: '', // 名称(中文)
    tableName: '', // 数据库中的表名
    entityName: '', // 实体名称
    linked: 0, // 已链接
    tableType: 'table', // 表格类型 entity:实体;view:视图
    viewSql: '',
    enableStatus: 1, // 状态
    seqNo: 999, // 排序
    tableComment: '', // 备注
    description: '' // 补充描述
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

const editorMounted = (editor: any) => {
  console.log('editor实例加载完成', editor)
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
  formData.value.connectId = urlParams.params?.pId || '';
  // 重置验证
  resetValidate();
  pageStyle.value = resetPageStyle();
  // 特色
  if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
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

.trigger-demo-translate {
  padding: 10px;
  min-width: 500px;
  min-height: 360px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}
</style>