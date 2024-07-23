<script lang="ts">
export default {
  name: 'GlDictionaryLayout'
}
</script>
<script lang="ts" setup>
import {ref, shallowRef, watch} from "vue";
import {fileApi, dictApi, useGlobal} from "@geelato/gl-ui";
import type {QueryDictForm, QueryDictItemForm} from "@geelato/gl-ui";
import GlDictionaryModel from "./model.vue";
import GlDictionaryEntryList from "./item/list.vue";

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

const global = useGlobal();
const dictLoading = ref<boolean>(false);
const visibleForm = ref<boolean>(false);
const tableFormRef = shallowRef(GlDictionaryModel);
const tableListRef = shallowRef(GlDictionaryEntryList);
const dictItemTotal = ref<number>(0);
// 表单
const generateFormData = () => {
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
const generateListParams = () => {
  return {
    visible: false, // 是否加载列表
    parameter: {
      dictId: props.modelValue,
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || ''
    },
    formState: props.formState,
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
      global.$message.success({content: '字典更新成功！'});
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
    global.$message.warning({content: '请先保存字典，再配置字典项！'});
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
    global.$message.warning({content: '"请先保存字典，再新建字典项！'});
  }
}

/**
 * 导出数据字典
 * @param data
 */
const exportDictAndItems = async (dictId: string) => {
  if (dictId) {
    try {
      // 字典
      const dictData = await dictApi.getDict(dictId);
      // @ts-ignore
      dictData.data.enableStatus = dictData.data.enableStatus === 1 ? '启用' : '禁用';
      // 字典项
      const itemData = await dictApi.queryDictItems({dictId: dictData.data.id});
      itemData.data.forEach((item: QueryDictItemForm) => {
        // @ts-ignore
        item.enableStatus = item.enableStatus === 1 ? '启用' : '禁用';
      });
      // 导出
      const exportData = {
        "valueMap": dictData.data || {},
        "valueMapList": [{"dictItem": itemData.data}] || []
      }
      console.log(exportData);
      const {data} = await fileApi.exportExcel(dictData.data.dictName || '字典管理数据导出', '4942276091403440128', 'data', exportData);
      if (data && data.id) {
        fileApi.downloadFileById(data.id);
        global.$message.success({content: '导出成功！'});
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    global.$message.warning({content: '导出时，数据字典主键不能为空！'});
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
  <a-modal draggable v-model:visible="visibleForm" :footer="false" :title="title || '数据字典'" :width="width || ''" title-align="start">
    <a-layout :style="{height: `${height}px`}">
      <a-layout style="flex-direction: row;">
        <a-layout-content style="width: 30%;">
          <a-card class="" size="small" title="字典">
            <template #extra>
              <a-popconfirm v-if="formState!=='view'" :content="`是否${modelParams.formState==='add'?'保存':'更新'}字典？`"
                            position="br" type="info" @ok="updateDict">
                <a-button :loading="dictLoading" class="app-button" status="success" type="text">
                  <template #icon>
                    <gl-iconfont type="gl-save"/>
                  </template>
                  {{ modelParams.formState === 'add' ? '保存' : '更新' }}
                </a-button>
              </a-popconfirm>
            </template>
            <GlDictionaryModel ref="tableFormRef"
                               :formCol="formCol"
                               :formState="modelParams.formState"
                               :model-value="modelParams.id"
                               :parameter="parameter"
                               :visible="visibleForm"/>
          </a-card>
        </a-layout-content>
        <a-divider direction="vertical"/>
        <a-layout-content style="width: 68%;">
          <a-card class="" size="small" title="字典项">
            <template #title>
              字典项（当前 {{ dictItemTotal }} 条）
            </template>
            <template #extra>
              <a-button v-if="formState!=='view'&&modelParams.id" class="app-button" type="text" @click="exportDictAndItems(modelParams.id)">
                <template #icon>
                  <gl-iconfont type="gl-export"/>
                </template>
                导出
              </a-button>
              <a-tooltip v-if="formState!=='view'" content="新建字典项">
                <a-button class="app-button" type="text" @click="addDictItem">
                  <template #icon>
                    <gl-iconfont type="gl-plus-circle"/>
                  </template>
                  新建
                </a-button>
              </a-tooltip>
              <a-tooltip v-if="formState!=='view'" content="批量配置字典项">
                <a-button class="app-button" type="text" @click="enterDictItems">
                  <template #icon>
                    <gl-iconfont type="gl-setting"/>
                  </template>
                  配置
                </a-button>
              </a-tooltip>
            </template>
            <GlDictionaryEntryList v-if="listParams.visible"
                                   ref="tableListRef"
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