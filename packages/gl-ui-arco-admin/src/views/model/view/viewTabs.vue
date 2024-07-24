<script lang="ts">
export default {
  name: 'ModelViewTabs'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import ModelTableList from "../table/list.vue";
import ModelTableViewList from "../view/list.vue";

type PageParams = {
  connectId: string; // 连接主键
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'edit'},// 表单状态
  height: {type: Number, default: 0},// 表单宽度
});

const {t} = useI18n();// 国际化
const tabsKey = ref<number>(1);// 定位tabs页面

const generateListParams = () => {
  return {
    visible: false,
    parameter: {
      connectId: props.parameter?.connectId || '',
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || '',
    },
    formState: props.formState,
    filterCol: 2,
    height: props.height - 255,
    pageSize: 50,
  }
};

const tableListParams = ref(generateListParams());
const viewListParams = ref(generateListParams());

watch(() => props, (val) => {
  if (props.visible === true) {
    tabsKey.value = 1;
  }
}, {deep: true, immediate: true});
</script>

<template>
  <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" position="top" type="line">
    <a-tab-pane :key="1" :title="$t('model.table.index.menu.list.searchTable')" class="a-tabs-one">
      <a-card class="general-card">
        <ModelTableList :filterCol="tableListParams.filterCol"
                        :formState="tableListParams.formState"
                        :height="tableListParams.height"
                        :pageSize="tableListParams.pageSize"
                        :parameter="tableListParams.parameter"
                        :visible="tableListParams.visible"/>
      </a-card>
    </a-tab-pane>
    <a-tab-pane :key="2" :title="$t('model.view.index.menu.list.searchTable')" class="a-tabs-one">
      <a-card class="general-card">
        <ModelTableViewList :filterCol="viewListParams.filterCol"
                            :formState="viewListParams.formState"
                            :height="viewListParams.height"
                            :pageSize="viewListParams.pageSize"
                            :parameter="viewListParams.parameter"
                            :visible="viewListParams.visible"/>
      </a-card>
    </a-tab-pane>
  </a-tabs>
</template>

<style lang="less" scoped>
</style>