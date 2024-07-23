<script lang="ts">
export default {
  name: 'DictionaryLayout'
}
</script>
<script lang="ts" setup>
import {ref, shallowRef, watch} from "vue";
import {useI18n} from "vue-i18n";
import {Message} from "@arco-design/web-vue";
import {dictApi} from "@geelato/gl-ui";
import type {FormState, ListParams, QueryDictForm} from "@geelato/gl-ui";
import DictionaryModel from "./model.vue";
import DictionaryEntryList from "./item/list.vue";

// 页面所需 参数
type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess', 'listChange']);
const props = defineProps({
  modelValue: {type: String, default: ''},// 表单 - 主键
  visible: {type: Boolean, default: false},// 弹层 - 是否显示
  isModal: {type: Boolean, default: true},// 弹层 - 方式，true-弹窗；false-抽屉
  title: {type: String, default: ''},// 弹层 - 标题
  width: {type: String, default: ''},// 弹层 - 高度，为空-自然变化
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 页面状态
  height: {type: [Number, String], default: ''},// 弹层 - 高度，为空-自然变化
  formCol: {type: Number, default: 1},// 表单 - 一行显示个数
});

const {t} = useI18n();// 国际化
const dictLoading = ref<boolean>(false);
const visibleForm = ref<boolean>(false);
const tableFormRef = shallowRef(DictionaryModel);
const tableListRef = shallowRef(DictionaryEntryList);
const dictItemTotal = ref<number>(0);
// 表单
const generateFormData = (): Record<string, any> => {
  return {
    id: props.modelValue,
    formState: props.formState,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || ''
  };
}
const modelParams = ref(generateFormData());
// 列表信息
const resetListHeight = () => {
  return (props.height as number) - 240;
}
const generateListParams = (): ListParams => {
  return {
    visible: false, // 是否加载列表
    parameter: {
      dictId: props.modelValue,
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || ''
    },
    formState: props.formState as FormState,
    filterCol: 2,
    pageSize: 10000,
    height: resetListHeight(),
  }
}
const listParams = ref(generateListParams());

/**
 * 获取单条数据接口
 * @param id
 * @param successBack
 * @param failBack
 */
const fetchDict = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await dictApi.getDict(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 字典数据设置
 * @param data
 */
const dictFormat = (data: QueryDictForm) => {
  data.seqNo = Number(data.seqNo);
  modelParams.value = Object.assign(modelParams.value, data);
  if (props.formState === 'add') modelParams.value.formState = 'edit';
  // 字典项
  listParams.value.parameter = {
    dictId: data.id, appId: data.appId, tenantCode: data.tenantCode
  };
  listParams.value.visible = true;
}

/**
 * 更新字典信息
 */
const updateDict = () => {
  dictLoading.value = true;
  // @ts-ignore
  if (tableFormRef.value && typeof tableFormRef.value?.saveOrUpdate === 'function') {
    // @ts-ignore
    tableFormRef.value?.saveOrUpdate((data: QueryDictForm) => {
      // 加载状态、数据设置、更新提示、更新注册
      dictLoading.value = false;
      dictFormat(data);
      emits('saveSuccess', data, props.formState);
      Message.success("字典更新成功！");
    }, () => {
      dictLoading.value = false;
    });
  }
}

/**
 * 字典配置字典项
 */
const enterDictItems = () => {
  if (modelParams.value.id) {
    // @ts-ignore
    if (tableListRef.value && typeof tableListRef.value?.openLocker === 'function') {
      // @ts-ignore
      tableListRef.value?.openLocker(modelParams.value);
    }
  } else {
    Message.warning("请先保存字典，再配置字典项！");
  }
}
/**
 * 字典配置字典项
 */
const addDictItem = () => {
  if (modelParams.value.id) {
    // @ts-ignore
    if (tableListRef.value && typeof tableListRef.value?.openModel === 'function') {
      // @ts-ignore
      tableListRef.value?.openModel(modelParams.value);
    }
  } else {
    Message.warning("请先保存字典，再新建字典项！");
  }
}

const fetchDictItems = (type: string, data: any[]) => {
  dictItemTotal.value = data && data.length > 0 ? data.length : 0;
}
const changeDictItem = () => {
  emits('listChange', modelParams.value.id);
}

watch(() => props, () => {
  if (props.visible === true) {
    // 恢复设置
    listParams.value.height = resetListHeight();
    modelParams.value = generateFormData();
    listParams.value = generateListParams();
    dictItemTotal.value = 0;
    // 编辑、查看 状态 查询数据
    if (['edit', 'view'].includes(props.formState) && props.modelValue) {
      fetchDict(props.modelValue, (data: QueryDictForm) => {
        dictFormat(data);
      });
    }
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  if (visibleForm.value === false) {
    listParams.value.visible = false;
  }
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal draggable  v-model:visible="visibleForm"
           :footer="false"
           :title="title || $t(`security.dict.index.model.title.${formState}`)"
           :width="width || ''" title-align="start">
    <a-layout :style="{height: `${height}px`}">
      <a-layout style="flex-direction: row;">
        <a-layout-content style="width: 30%;">
          <a-card class="" size="small" :title="$t('security.dictItem.index.popover.dict.title')">
            <template #extra>
              <a-popconfirm v-if="formState!=='view'" :content="$t('searchTable.columns.operations.update.msg')"
                            position="br" type="info" @ok="updateDict">
                <a-button :loading="dictLoading" class="app-button" status="success" type="text">
                  <template #icon>
                    <icon-save/>
                  </template>
                  {{ $t('searchTable.columns.operations.update') }}
                </a-button>
              </a-popconfirm>
            </template>
            <DictionaryModel ref="tableFormRef" :formCol="formCol"
                             :formState="modelParams.formState" :model-value="modelParams.id"
                             :parameter="parameter" :visible="visibleForm"/>
          </a-card>
        </a-layout-content>
        <a-divider direction="vertical"/>
        <a-layout-content style="width: 68%;">
          <a-card class="" size="small">
            <template #title>
              {{ $t('security.dictItem.index.popover.item.title') }}（当前 {{ dictItemTotal }} 条）
            </template>
            <template #extra>
              <a-button v-if="formState!=='view'&&modelParams.id" class="app-button" type="text" @click="dictApi.exportDictAndItems(modelParams.id)">
                <template #icon>
                  <icon-export/>
                </template>
                {{ $t('searchTable.operation.export') }}
              </a-button>
              <a-tooltip v-if="formState!=='view'" content="新建字典项">
                <a-button class="app-button" type="text" @click="addDictItem">
                  <template #icon>
                    <icon-plus/>
                  </template>
                  {{ $t('searchTable.operation.create') }}
                </a-button>
              </a-tooltip>
              <a-tooltip v-if="formState!=='view'" content="批量配置字典项">
                <a-button class="app-button" type="text" @click="enterDictItems">
                  <template #icon>
                    <icon-settings/>
                  </template>
                  {{ $t('searchTable.columns.operations.config') }}
                </a-button>
              </a-tooltip>
            </template>
            <DictionaryEntryList v-if="listParams.visible" ref="tableListRef"
                                 :filterCol="listParams.filterCol"
                                 :formState="listParams.formState"
                                 :height="listParams.height"
                                 :pageSize="listParams.pageSize"
                                 :parameter="listParams.parameter"
                                 :visible="listParams.visible"
                                 @fetch="fetchDictItems"
                                 @change="changeDictItem"/>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-modal>
</template>
<style lang="less" scoped>
.arco-layout-content {
  flex: auto !important;
}

.app-button.arco-btn-size-medium {
  padding: 0 10px;
}
</style>