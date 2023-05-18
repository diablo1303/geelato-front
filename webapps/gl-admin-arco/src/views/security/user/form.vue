<template>
  <a-modal
      v-model:visible="visibleModel"
      width="65%"
      :title="$t(`${modelAttr.title}`)"
      :footer="modelAttr.footer"
      :cancel-text="$t(`${modelAttr.cancelText}`)"
      :ok-text="$t('sercurity.user.index.model.ok.text')"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <a-form :model="formData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item v-show="false">
            <a-input v-show="false" v-model="formData.id"/>
            <a-input v-show="false" v-model="formData.salt"/>
            <a-input v-show="false" v-model="formData.avatar"/>
            <a-input v-show="false" v-model="formData.password"/>
            <a-input v-show="false" v-model="formData.plainPassword"/>
            <a-input v-show="false" v-model="formData.orgId"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="name" :label="$t('sercurity.user.index.form.name')">
            <a-input v-if="modelAttr.footer" v-model="formData.name" :max-length="32"/>
            <a-span v-else>{{ formData.name }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="loginName" :label="$t('sercurity.user.index.form.loginName')">
            <a-input v-if="modelAttr.footer" v-model="formData.loginName" :max-length="32"/>
            <a-span v-else>{{ formData.loginName }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="orgName" :label="$t('sercurity.user.index.form.orgName')">
            <a-input v-if="modelAttr.footer" v-model="formData.orgName" :max-length="32"/>
            <a-span v-else>{{ formData.orgName }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="sex" :label="$t('sercurity.user.index.form.sex')">
            <a-select v-if="modelAttr.footer" v-model="formData.sex">
              <a-option v-for="item of sexOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
            </a-select>
            <a-span v-else>{{ $t(`sercurity.user.index.form.sex.${formData.sex}`) }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="mobilePhone" :label="$t('sercurity.user.index.form.mobilePhone')">
            <a-input v-if="modelAttr.footer" v-model="formData.mobilePhone" :max-length="32"/>
            <a-span v-else>{{ formData.mobilePhone }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="telephone" :label="$t('sercurity.user.index.form.telephone')">
            <a-input v-if="modelAttr.footer" v-model="formData.telephone" :max-length="32"/>
            <a-span v-else>{{ formData.telephone }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="email" :label="$t('sercurity.user.index.form.email')">
            <a-input v-if="modelAttr.footer" v-model="formData.email" :max-length="32"/>
            <a-span v-else>{{ formData.email }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="post" :label="$t('sercurity.user.index.form.post')">
            <a-input v-if="modelAttr.footer" v-model="formData.post" :max-length="32"/>
            <a-span v-else>{{ formData.post }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="provinceCode" :label="$t('sercurity.user.index.form.provinceCode')">
            <a-input v-if="modelAttr.footer" v-model="formData.provinceCode" :max-length="32"/>
            <a-span v-else>{{ formData.provinceCode }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="cityCode" :label="$t('sercurity.user.index.form.cityCode')">
            <a-input v-if="modelAttr.footer" v-model="formData.cityCode" :max-length="32"/>
            <a-span v-else>{{ formData.cityCode }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="type" :label="$t('sercurity.user.index.form.type')">
            <a-select v-if="modelAttr.footer" v-model="formData.type">
              <a-option v-for="item of typeOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
            </a-select>
            <a-span v-else>{{ $t(`sercurity.user.index.form.type.${formData.type}`) }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="source" :label="$t('sercurity.user.index.form.source')">
            <a-select v-if="modelAttr.footer" v-model="formData.source">
              <a-option v-for="item of sourceOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
            </a-select>
            <a-span v-else>{{ $t(`sercurity.user.index.form.source.${formData.source}`) }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="seqNo" :label="$t('sercurity.user.index.form.seqNo')">
            <a-input-number v-if="modelAttr.footer" v-model="formData.seqNo" :precision="0" :max="999999" :min="1" placeholder="length[1,999999]"/>
            <a-span v-else>{{ formData.seqNo }}</a-span>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item field="description" :label="$t('sercurity.user.index.form.description')"
                       :label-col-props="{ span: 3 }" :wrapper-col-props="{ span: 21 }">
            <a-textarea v-if="modelAttr.footer" v-model="formData.description" :max-length="512" :auto-size="{minRows:3,maxRows:6}" show-word-limit/>
            <a-span v-else :title="formData.description" @click="openModal(`${formData.description}`)">{{ formData.description }}</a-span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {Modal} from "@arco-design/web-vue";
import {sexOptions, sourceOptions, typeOptions} from "@/views/security/user/searchTable";
import {createOrUpdateUser, getUser, QueryUserForm} from '@/api/sercurity_service'

const generateFormData = (): QueryUserForm => {
  return {
    id: '',
    name: '',
    loginName: '',
    seqNo: 999,
    sex: 0,
    salt: '',
    avatar: '',
    password: '',
    plainPassword: '',
    mobilePhone: '',
    telephone: '',
    orgId: '',
    orgName: '',
    email: '',
    post: '',
    provinceCode: '',
    cityCode: '',
    type: 0,
    source: 0,
    description: ''
  };
}
const visibleModel = ref(false);
const formData = ref(generateFormData());
const modelAdd = {title: 'sercurity.user.index.model.title.add', cancelText: 'sercurity.user.index.model.cancel.text', footer: true};
const modelEdit = {title: 'sercurity.user.index.model.title.edit', cancelText: 'sercurity.user.index.model.cancel.text', footer: true};
const modelView = {title: 'sercurity.user.index.model.title.view', cancelText: 'sercurity.user.index.model.close.text', footer: false};
let modelAttr = modelAdd;
// 页面响应
let okSuccessBack: any;
const createOrUpdateData = async (params: QueryUserForm, done: any) => {
  try {
    const {data} = await createOrUpdateUser(params);
    done();
    okSuccessBack();
  } catch (err) {
    console.log(err);
  }
};
const getData = async (id: string, successBack: any) => {
  try {
    const {data} = await getUser(id);
    successBack(data);
  } catch (err) {
    console.log(err);
  }
};

const openForm = (action: string, id: string, okBack?: any) => {
  if (action === "add") {
    formData.value = generateFormData();
    modelAttr = modelAdd;
    visibleModel.value = true;
  } else {
    formData.value = generateFormData();
    modelAttr = (action === "edit") ? modelEdit : modelView;

    getData(id, function (data: QueryUserForm) {
      data.seqNo = Number(data.seqNo);
      formData.value = data;
      visibleModel.value = true;
    });
  }

  okSuccessBack = okBack || null;
}

/* 表单 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, done);
};
const handleModelCancel = () => {
  visibleModel.value = false;
}

const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}

// 将方法暴露出去
defineExpose({openForm});
</script>

<style scoped lang="less">
div.arco-form-item-content > a-span {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}
</style>