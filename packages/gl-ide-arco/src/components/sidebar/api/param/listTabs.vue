<script lang="ts">
export default {
  name: 'GlApiParamListTabs'
};
</script>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {utils, useGlobal} from "@geelato/gl-ui";
import type {QueryApiParamForm} from "@geelato/gl-ui";
import {bodyTypeOptions, paramTypeOptions} from "../searchTable";
import GlApiParamList from './list.vue';
import GlApiParamLisp from './lisp.vue';

// 页面所需 参数
type PageParams = {
  apiId: string;
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<QueryApiParamForm>, default: []},
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'edit'},
  isModal: {type: Boolean, default: false},
  pageSize: {type: Number, default: 10000},
  height: {type: Number, default: 0},
});

const global = useGlobal();
const tabsKey = ref<number>(1);// 定位tabs页面
const bodyTabsKey = ref<number>(1);// 定位tabs页面
const generateFormData = (paramType?: string, bodyType?: string): QueryApiParamForm => {
  return {
    id: utils.generateRandom(19),
    pid: '',
    apiId: props.parameter?.apiId || '',
    paramType: paramType || '',
    bodyType: bodyType || '',
    name: '',
    dataType: 'string',
    required: false,
    demoValue: '',
    defaultValue: '',
    remark: '',
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const mv = ref<QueryApiParamForm[]>(props.modelValue);
const paramsData = ref<QueryApiParamForm[]>([]);
const bodyData = ref<QueryApiParamForm[]>([]);
const bodyFormData = ref<QueryApiParamForm[]>([]);
const bodyFormUrlData = ref<QueryApiParamForm[]>([]);
const bodyJsonData = ref<QueryApiParamForm[]>([]);
const bodyXmlData = ref<QueryApiParamForm[]>([]);
const bodyRawData = ref<QueryApiParamForm>({} as unknown as QueryApiParamForm);
const bodyBinaryData = ref<QueryApiParamForm>({} as unknown as QueryApiParamForm);
const headersData = ref<QueryApiParamForm[]>([]);
const cookiesData = ref<QueryApiParamForm[]>([]);

const showAddBotton = computed<boolean>(() => {
  if ([2].includes(tabsKey.value)) {
    return false;
  }
  return true;
});
const showBodyAddBotton = computed<boolean>(() => {
  if ([2].includes(tabsKey.value)) {
    if ([1].includes(bodyTabsKey.value)) {
      return false;
    } else if ([4].includes(bodyTabsKey.value) && bodyJsonData.value.length > 0) {
      return false;
    } else if ([5].includes(bodyTabsKey.value) && bodyXmlData.value.length > 0) {
      return false;
    } else if ([6].includes(bodyTabsKey.value) && !!bodyRawData.value?.id) {
      return false;
    } else if ([7].includes(bodyTabsKey.value) && !!bodyBinaryData.value?.id) {
      return false;
    }
  }
  return true;
});

const addApiParam = () => {
  let data = {} as unknown as QueryApiParamForm;
  switch (tabsKey.value) {
    case 1:
      mv.value.push(generateFormData('params'));
      break;
    case 2:
      switch (bodyTabsKey.value) {
        case 2:
          mv.value.push(generateFormData("body", "form-data"));
          break;
        case 3:
          mv.value.push(generateFormData("body", "x-www-form-urlencoded"));
          break;
        case 4:
          data = generateFormData("body", "json");
          Object.assign(data, {name: 'ROOT', dataType: 'object'})
          mv.value.push(data)
          break;
        case 5:
          data = generateFormData("body", "xml");
          Object.assign(data, {name: 'ROOT', dataType: 'object'})
          mv.value.push(data);
          break;
        case 6:
          mv.value.push(generateFormData("body", "raw"));
          break;
        case 7:
          mv.value.push(generateFormData("body", "binary"))
          break;
        default:
          break;
      }
      break;
    case 3:
      mv.value.push(generateFormData('headers'));
      break;
    case 4:
      mv.value.push(generateFormData('cookies'));
      break;
    default:
      break;
  }
}
const emptyApiParamBody = () => {
  switch (bodyTabsKey.value) {
    case 2:
      mv.value = mv.value.filter(item => item.bodyType !== 'form-data');
      break;
    case 3:
      mv.value = mv.value.filter(item => item.bodyType !== 'x-www-form-urlencoded');
      break;
    case 4:
      mv.value = mv.value.filter(item => item.bodyType !== 'json');
      break;
    case 5:
      mv.value = mv.value.filter(item => item.bodyType !== 'xml');
      break;
    case 6:
      mv.value = mv.value.filter(item => item.bodyType !== 'raw');
      break;
    case 7:
      mv.value = mv.value.filter(item => item.bodyType !== 'binary');
      break;
    default:
      break;
  }
}
const emptyApiParam = () => {
  switch (tabsKey.value) {
    case 1:
      mv.value = mv.value.filter(item => item.paramType !== 'params');
      break;
    case 2:
      mv.value = mv.value.filter(item => item.paramType !== 'body');
      break;
    case 3:
      mv.value = mv.value.filter(item => item.paramType !== 'headers');
      break;
    case 4:
      mv.value = mv.value.filter(item => item.paramType !== 'cookies');
      break;
    default:
      break;
  }
}

const paramListDelete = (record: QueryApiParamForm) => {
  mv.value = mv.value.filter(item => item.id !== record.id);
}

const validateForm = (form: QueryApiParamForm) => {
  let isValid = true;
  if (!['raw', 'binary'].includes(form.bodyType) && (!form.name || !form.dataType)) {
    return false;
  }
  return isValid;
}

const validateData = (isValid: boolean, data: QueryApiParamForm[]) => {
  if (data && data.length > 0) {
    for (const item of data) {
      if (!validateForm(item)) {
        isValid = false;
        break;
      } else if (item.children && item.children.length > 0) {
        validateData(isValid, item.children);
      }
    }
  }
  return isValid;
}

const validate = () => {
  return validateData(true, mv.value);
}

watch(() => mv.value, () => {
  paramsData.value = mv.value.filter(item => item.paramType === 'params');
  bodyData.value = mv.value.filter(item => item.paramType === 'body');

  bodyFormData.value = mv.value.filter(item => item.paramType === 'body' && item.bodyType === 'form-data');
  bodyFormUrlData.value = mv.value.filter(item => item.paramType === 'body' && item.bodyType === 'x-www-form-urlencoded');
  bodyJsonData.value = mv.value.filter(item => item.paramType === 'body' && item.bodyType === 'json');
  bodyXmlData.value = mv.value.filter(item => item.paramType === 'body' && item.bodyType === 'xml');

  const rawData = mv.value.filter(item => item.paramType === 'body' && item.bodyType === 'raw');
  bodyRawData.value = (rawData && rawData.length > 0) ? rawData[0] : {} as unknown as QueryApiParamForm;

  const binaryData = mv.value.filter(item => item.paramType === 'body' && item.bodyType === 'binary');
  bodyBinaryData.value = (binaryData && binaryData.length > 0) ? binaryData[0] : {} as unknown as QueryApiParamForm;

  headersData.value = mv.value.filter(item => item.paramType === 'headers');
  cookiesData.value = mv.value.filter(item => item.paramType === 'cookies');

  emits('update:modelValue', mv.value);
}, {deep: true, immediate: true});

watch(() => props.modelValue, () => {
  mv.value = props.modelValue || [];
}, {deep: true, immediate: true});

/* 提供外部调用方法 */
defineExpose({validate});
</script>

<template>
  <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :destroy-on-hide="true" class="api-param-list-tabs" position="top" type="line">
    <template #extra>
      <a-space v-if="formState!=='view'">
        <a-button v-if="showAddBotton" class="tabs-extra-btn" type="text" @click="addApiParam">
          <template #icon>
            <gl-iconfont type="gl-plus-circle"/>
          </template>
          {{ `添加 ${paramTypeOptions[tabsKey - 1]?.label}` }}
        </a-button>
        <a-popconfirm :content="`是否清空“${paramTypeOptions[tabsKey - 1]?.label}”模块数据？`" position="br" type="warning" @ok="emptyApiParam">
          <a-button class="tabs-extra-btn" status="danger" type="text">
            <template #icon>
              <gl-iconfont type="gl-delete"/>
            </template>
            {{ `清空 ${paramTypeOptions[tabsKey - 1]?.label}` }}
          </a-button>
        </a-popconfirm>
      </a-space>
    </template>
    <a-tab-pane class="list-tabs-pane" :key="1">
      <template #title>
        Params
        <span class="title-mark">
            {{ `${paramsData.length > 0 ? paramsData.length : ''}` }}
        </span>
      </template>
      <a-card class="general-card general-card13">
        <GlApiParamList :form-state="formState"
                        :height="height"
                        :model-value="paramsData"
                        :parameter="{'paramType':'params','bodyType':''}"
                        @delete="paramListDelete"/>
      </a-card>
    </a-tab-pane>
    <a-tab-pane :key="2">
      <template #title>
        Body
        <span class="title-mark">
            {{ `${bodyData.length > 0 ? bodyData.length : ''}` }}
        </span>
      </template>
      <a-card class="general-card general-card13">
        <a-tabs v-model:active-key="bodyTabsKey" :default-active-tab="1" :destroy-on-hide="true" position="top" type="text"
                class="api-param-list-tabs-2">
          <template #extra>
            <a-space v-if="formState!=='view'">
              <a-button v-if="showBodyAddBotton" class="tabs-extra-btn" type="text" @click="addApiParam">
                <template #icon>
                  <gl-iconfont type="gl-plus-circle"/>
                </template>
                {{ `添加 ${bodyTypeOptions[bodyTabsKey - 1]?.value}` }}
              </a-button>
              <a-popconfirm v-if="![1].includes(bodyTabsKey)" :content="`是否清空“Body -> ${bodyTypeOptions[bodyTabsKey-1]?.label}”模块数据？`"
                            position="br" type="warning" @ok="emptyApiParamBody">
                <a-button class="tabs-extra-btn" status="danger" type="text">
                  <template #icon>
                    <gl-iconfont type="gl-delete"/>
                  </template>
                  {{ `清空 ${bodyTypeOptions[bodyTabsKey - 1]?.value}` }}
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <a-tab-pane :key="1" title="none">
            <a-card class="general-card general-card15">
              <a-empty>该请求没有 Body 体</a-empty>
            </a-card>
          </a-tab-pane>
          <a-tab-pane :key="2">
            <template #title>
              form-data
              <span class="title-mark">
            {{ `${bodyFormData.length > 0 ? bodyFormData.length : ''}` }}
        </span>
            </template>
            <a-card class="general-card general-card14">
              <GlApiParamList :form-state="formState"
                              :height="height-48"
                              :model-value="bodyFormData"
                              :parameter="{'paramType':'body','bodyType':'form-data'}"
                              @delete="paramListDelete"/>
            </a-card>
          </a-tab-pane>
          <a-tab-pane :key="3">
            <template #title>
              x-www-form-urlencoded
              <span class="title-mark">
            {{ `${bodyFormUrlData.length > 0 ? bodyFormUrlData.length : ''}` }}
        </span>
            </template>
            <a-card class="general-card general-card14">
              <GlApiParamList :form-state="formState"
                              :height="height-48"
                              :model-value="bodyFormUrlData"
                              :parameter="{'paramType':'body','bodyType':'x-www-form-urlencoded'}"
                              @delete="paramListDelete"/>
            </a-card>
          </a-tab-pane>
          <a-tab-pane :key="4">
            <template #title>
              json
              <span class="title-mark">
                {{ `${bodyJsonData.length > 0 ? '*' : ''}` }}
              </span>
            </template>
            <a-card class="general-card general-card14">
              <GlApiParamLisp :form-state="formState"
                              :height="height-48"
                              :model-value="bodyJsonData"
                              :parameter="{'paramType':'body','bodyType':'json','apiId':parameter.apiId,'appId':parameter.appId,'tenantCode':parameter.tenantCode}"/>
            </a-card>
          </a-tab-pane>
          <a-tab-pane :key="5">
            <template #title>
              xml
              <span class="title-mark">
                {{ `${bodyXmlData.length > 0 ? '*' : ''}` }}
              </span>
            </template>
            <a-card class="general-card general-card14">
              <GlApiParamLisp :form-state="formState"
                              :height="height-48"
                              :model-value="bodyXmlData"
                              :parameter="{'paramType':'body','bodyType':'xml','apiId':parameter.apiId,'appId':parameter.appId,'tenantCode':parameter.tenantCode}"/>
            </a-card>
          </a-tab-pane>
          <a-tab-pane :key="6">
            <template #title>
              raw
              <span class="title-mark">
                {{ `${bodyRawData?.id ? '*' : ''}` }}
              </span>
            </template>
            <a-card class="general-card general-card15">
              <a-empty v-if="!bodyRawData?.id">{{ formState === 'view' ? '暂无数据' : '请点击“添加”按钮' }}</a-empty>
              <a-form v-else :label-col-props="{ span: 4 }" :model="bodyRawData" :wrapper-col-props="{ span: 18 }" class="form">
                <a-row :gutter="18">
                  <a-col :span="24">
                    <a-form-item :wrapper-col-props="{ span: 14 }">
                      <div class="form-wrapper-div">media type: text/plain</div>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item :wrapper-col-props="{ span: 14 }" field="keyName" label="示例值">
                      <a-textarea v-model="bodyRawData.demoValue" :auto-size="{minRows:1,maxRows:4}" :max-length="512" show-word-limit/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item :wrapper-col-props="{ span: 14 }" field="keyName" label="默认值">
                      <a-textarea v-model="bodyRawData.defaultValue" :auto-size="{minRows:1,maxRows:4}" :max-length="512" show-word-limit/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item :wrapper-col-props="{ span: 14 }" field="keyName" label="备注">
                      <a-textarea v-model="bodyRawData.remark" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-card>
          </a-tab-pane>
          <a-tab-pane :key="7">
            <template #title>
              binary
              <span class="title-mark">
            {{ `${bodyBinaryData?.id ? '*' : ''}` }}
        </span>
            </template>
            <a-card class="general-card general-card15">
              <a-empty v-if="!bodyBinaryData?.id">{{ formState === 'view' ? '暂无数据' : '请点击“添加”按钮' }}</a-empty>
              <a-form v-else :label-col-props="{ span: 4 }" :model="bodyBinaryData" :wrapper-col-props="{ span: 18 }" class="form">
                <a-row :gutter="18">
                  <a-col :span="24">
                    <a-form-item :wrapper-col-props="{ span: 14 }">
                      <div class="form-wrapper-div">media type: application/octet-stream</div>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item :wrapper-col-props="{ span: 14 }" field="keyName" label="示例值">
                      <GlUpload v-model="bodyBinaryData.demoValue" :disabled="formState==='view'" :limit="1"/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item :wrapper-col-props="{ span: 14 }" field="keyName" label="默认值">
                      <GlUpload v-model="bodyBinaryData.defaultValue" :disabled="formState==='view'" :limit="1"/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item :wrapper-col-props="{ span: 14 }" field="keyName" label="备注">
                      <a-textarea v-model="bodyBinaryData.remark" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-tab-pane>
    <a-tab-pane :key="3">
      <template #title>
        Headers
        <span class="title-mark">
            {{ `${headersData.length > 0 ? headersData.length : ''}` }}
        </span>
      </template>
      <a-card class="general-card general-card13">
        <GlApiParamList :form-state="formState"
                        :height="height"
                        :model-value="headersData"
                        :parameter="{'paramType':'headers','bodyType':''}"
                        @delete="paramListDelete"/>
      </a-card>
    </a-tab-pane>
    <a-tab-pane :key="4">
      <template #title>
        Cookies
        <span class="title-mark">
            {{ `${cookiesData.length > 0 ? cookiesData.length : ''}` }}
        </span>
      </template>
      <a-card class="general-card general-card13">
        <GlApiParamList :form-state="formState"
                        :height="height"
                        :model-value="cookiesData"
                        :parameter="{'paramType':'cookies','bodyType':''}"
                        @delete="paramListDelete"/>
      </a-card>
    </a-tab-pane>
  </a-tabs>
</template>

<style lang="less">
.api-param-list-tabs {
  margin-bottom: -16px;

  .arco-tabs-content {
    padding-left: 0px !important;
  }

  .general-card13 {
    margin-top: 16px;
    border: 0px solid var(--color-neutral-3) !important;
  }

  .api-param-list-tabs-2 {
    margin-bottom: -16px;

    .general-card14 {
      border: 0px solid var(--color-neutral-3) !important;
    }

    .general-card14 .arco-card-body {
      padding: 0px 0px 16px 0px !important;
    }

    .general-card15 {
      margin-bottom: 16px !important;
    }

    .general-card15 .arco-card-body {
      padding: 16px 0px 0px 0px !important;
    }
  }

  .general-card13 .arco-card-body {
    padding: 0px 0px 16px 0px !important;
  }

  .title-mark {
    color: rgb(var(--success-6));
  }

  .form-wrapper-div {
    width: 100%;
    text-align: center;
    background-color: var(--color-fill-2);
    padding: 5px 0px;
  }

  .tabs-extra-btn {
    padding: 5px 5px !important;
  }

  div.arco-form-item-content > span.textarea-span {
    cursor: pointer;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    white-space: normal;
    word-wrap: break-word;
  }
}
</style>