<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 6 }" :model="formData" :wrapper-col-props="{ span: 18 }" class="form">
    <a-form-item
        :label="$t('application.app.list.name')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="name">
      <a-input v-if="pageData.button" v-model.trim="formData.name" :max-length="32"/>
      <span v-else>{{ formData.name }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('application.app.list.code')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
        field="code">
      <a-input v-if="pageData.button" v-model.trim="formData.code" :max-length="32"/>
      <span v-else>{{ formData.code }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('application.app.list.icon')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="icon">
      <a-input v-if="pageData.button" v-model="formData.icon" :max-length="32" class="input-icon" readonly>
        <template #prefix>
          <GlIconfont :type="formData.icon"/>
        </template>
        <template #append>
          <a-button class="input-button input-button-primary" type="dashed" @click="showIconSelect($event)">
            <IconPlus/>
          </a-button>
          <a-button class="input-button input-button-close" type="dashed" @click="deleteIconClick($event)">
            <IconClose/>
          </a-button>
        </template>
      </a-input>
      <span v-else><GlIconfont :type="formData.icon"/> {{ formData.icon }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('application.app.list.logo')"
        :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
        field="logo">
      <a-space style="align-items: flex-end;">
        <a-image v-model:src="formData.logo" :preview="false" class="logo-img" width="82"/>
        <a-space v-if="pageData.button" style="flex-direction: column;align-items: flex-start;">
          <a-button size="mini" style="border-radius: 6px;margin-bottom: 5px;" type="outline" @click="logoDeleteClick($event)">
            <template #icon>
              <GlIconfont type="gl-delete"/>
            </template>
            {{ $t('application.app.list.logo.button.delete') }}
          </a-button>
          <a-button size="mini" style="border-radius: 6px;" type="outline" @click="logoSelectClick($event)">
            <template #icon>
              <GlIconfont type="gl-edit-square"/>
            </template>
            {{ $t('application.app.list.logo.button.select') }}
          </a-button>
        </a-space>
      </a-space>
    </a-form-item>
    <!--    <a-form-item
            :label="$t('application.app.list.logo')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="logo">
          <a-upload :action="getUploadUrl()" :disabled="!pageData.button" :file-list="logoFile"
                    :limit="1" accept="image/*"
                    image-preview
                    list-type="picture-card"
                    @error="uploadLogoError" @success="uploadLogoSuccess" @before-remove="beforeRemoveLogo"/>
        </a-form-item>-->
    <a-form-item
        :label="$t('application.app.list.watermark')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="watermark">
      <a-select v-if="pageData.button" v-model="formData.watermark">
        <a-option v-for="item of watermarkOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
      </a-select>
      <span v-else>{{ $t(`application.app.list.watermark.${formData.watermark}`) }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('application.app.list.applyStatus')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="applyStatus">
      <a-select v-if="pageData.button" v-model="formData.applyStatus">
        <a-option v-for="item of statusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
      </a-select>
      <span v-else>{{ $t(`application.app.list.status.${formData.applyStatus}`) }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('application.app.list.designStatus')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="designStatus">
      <a-select v-if="pageData.button" v-model="formData.designStatus">
        <a-option v-for="item of statusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
      </a-select>
      <span v-else>{{ $t(`application.app.list.status.${formData.designStatus}`) }}</span>
    </a-form-item>
    <!--    <a-form-item :label="$t('application.app.list.powerInfo')" field="powerInfo">
          <a-textarea v-if="pageData.button" v-model="formData.powerInfo" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.powerInfo" class="textarea-span" @click="openModal(`${formData.powerInfo}`)">
            {{ formData.powerInfo }}
          </span>
        </a-form-item>-->
    <!--    <a-form-item
            :label="$t('application.app.list.versionInfo')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="versionInfo">
          <a-input v-if="pageData.button" v-model="formData.versionInfo" :max-length="32"/>
          <span v-else>{{ formData.versionInfo }}</span>
        </a-form-item>-->
    <a-form-item
        :label="$t('application.app.list.seqNo')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="seqNo">
      <a-input-number
          v-if="pageData.button" v-model="formData.seqNo" :max="999999" :min="1"
          :placeholder="$t('security.form.rules.match.length.title')+'[0,999999]'"
          :precision="0"/>
      <span v-else>{{ formData.seqNo }}</span>
    </a-form-item>
    <a-form-item :label="$t('application.app.list.description')" field="description">
      <a-textarea v-if="pageData.button" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
      <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">
        {{ formData.description }}
      </span>
    </a-form-item>
  </a-form>
  <a-modal v-model:visible="visible" :footer="false" style="top: 20px" title="选择图标" width="80%">
    <div style="height:640px;overflow-y: scroll;padding:1em;margin:-24px">
      <div v-for="item in iconsJson.glyphs" :key="item.icon_id" class="gl-iconfont-setter-icon-item" @click="onSelected(item)">
        <div style="font-size: 2em;">
          <GlIconfont :type="iconsJson.css_prefix_text+item.font_class"/>
        </div>
        <div>{{ iconsJson.css_prefix_text + item.font_class }}</div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from 'vue-i18n';
import {FileItem, FormInstance, Modal, Notification} from "@arco-design/web-vue";
import {ListUrlParams} from '@/api/base';
import {createOrUpdateApp as createOrUpdateForm, getApp as getForm, QueryAppForm as QueryForm, validateAppCode} from '@/api/application'
import {statusOptions, watermarkOptions} from "@/views/application/searchTable";
import {iconsJson} from "@geelato/gl-ui";
import {uploadFile} from "@/components/vue-cropper/type";
import {useRoute} from "vue-router";

// 国际化
const {t} = useI18n();
const route = useRoute();
const visible = ref(false);
const pageData = ref({formState: 'add', button: true, formCol: 1});
const validateForm = ref<FormInstance>();
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: '',
    name: '',// 应用名称
    code: '',// 应用编码
    icon: '',// 图标
    appKey: '',
    token: '',
    tree: '',
    logo: '',// 标识
    theme: '',
    watermark: 0,// 应用水印
    href: '',// 首页链接
    dependAppCode: '',
    powerInfo: '',
    versionInfo: '',
    description: '',// 描述
    seqNo: 999,
    applyStatus: 1,
    designStatus: 1,
    tenantCode: (route.params && route.params.tenantCode as string) || '',
  };
}
const formData = ref(generateFormData());
const logoFile = ref<FileItem[]>([]);

const onSelected = (iconItem: any) => {
  // console.log('iconItem', iconItem, json)
  formData.value.icon = iconsJson.css_prefix_text + iconItem.font_class;
  visible.value = false
}
const showIconSelect = (ev: Event) => {
  visible.value = true
}
const deleteIconClick = (ev?: MouseEvent) => {
  formData.value.icon = ''
}

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await createOrUpdateForm(params);
      logoFile.value = [];
      successBack(data);
    } catch (err) {
      failBack(err);
    }
  } else {
    failBack();
  }
};

const logoDeleteClick = (ev?: MouseEvent) => {
  formData.value.logo = "";
}
const logoSelectClick = (ev?: MouseEvent) => {
  uploadFile((file: File, url: string) => {
    if (!file) { // 如果没有选择文件，则返回
      return;
    }
    const reader = new FileReader(); // 创建FileReader对象
    reader.onload = function (e) { // 当读取完成时触发该事件
      formData.value.logo = (e && e.target && e.target.result as string) || '';
      console.log(formData.value.logo);
    };
    reader.readAsDataURL(file); // 以DataURL格式读取文件内容
  });
}

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

const deleteFileItem = (fileList: FileItem[], delUid: string) => {
  if (fileList != null && fileList.length > 0) {
    let delIndex = -1;
    for (let i = 0; i < fileList.length; i += 1) {
      if (fileList[i].uid === delUid) {
        delIndex = i;
      }
    }
    if (delIndex > -1) {
      fileList.splice(delIndex, 1);
    }
  }
}

const setLogo = () => {
  formData.value.logo = logoFile.value.map((item) => {
    return item.uid;
  }).join(",");
}

const beforeRemoveLogo = async (fileItem: FileItem): Promise<boolean> => {
  try {
    // await deleteAttachment(fileItem.uid);
    Notification.success("删除成功");
    deleteFileItem(logoFile.value, fileItem.uid);
    setLogo();
    return true;
  } catch (err) {
    return false;
  }
}

const uploadLogoError = (fileItem: FileItem) => {
  Notification.error("上传失败，请重试！");
}

const uploadLogoSuccess = (fileItem: FileItem) => {
  Notification.success("上传成功");
  fileItem.uid = fileItem.response.data.id;
  logoFile.value.push(fileItem);
  setLogo();
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
    const {data} = await validateAppCode(formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

/* 对外调用方法 */
const loadModel = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action || "view";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.formCol = urlParams.formCol || 1;
  formData.value = generateFormData();
  logoFile.value = [];
  // 重置验证
  resetValidate();
  // 特色
  if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      data.seqNo = Number(data.seqNo);
      /* if (data.logo !== null && data.logo !== '') {
        getAttachmentByIds(data.logo, (attachs: AttachmentForm[]) => {
          if (attachs != null && attachs.length > 0) {
            attachs.forEach((value, index, array) => {
              if (value.delStatus === 0) {
                logoFile.value.push({
                  uid: value.id,
                  name: value.name,
                  url: getDownloadUrlById(value.id)
                });
              }
            });
          }
          console.log(logoFile.value);
        }, () => {
        });
      } */
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
.input-button {
  height: 31px;
  padding: 0 8px;
}

.input-button-primary {
  color: rgb(var(--primary-6));
  border-color: var(--color-primary-light-3);
}

.input-button-close {
  color: rgb(var(--danger-6));
  border-color: var(--color-danger-light-3);
}

.input-icon > :last-child {
  padding: 0px !important;
}

.gl-iconfont-setter-icon-item {
  display: inline-block;
  padding: 0.5em;
  text-align: center;
  cursor: pointer;
  min-width: 9em;
  max-width: 9em;
  height: 9em;
  vertical-align: top;
}

.gl-iconfont-setter-icon-item:hover {
  box-shadow: 0px 0px 4px #1890FF;
}

.logo-img {
  border-radius: 2px;
  border: 1px solid #e8e8e8;
  box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.08);
}
</style>