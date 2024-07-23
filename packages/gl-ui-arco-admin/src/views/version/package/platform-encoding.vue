<script lang="ts">
export default {
  name: 'PlatformEncodingList'
};
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import cloneDeep from "lodash/cloneDeep";
import type {TableColumnData, TableData, TableSortable} from '@arco-design/web-vue';
import {isUtil} from "@geelato/gl-ui";
import type {PageQueryFilter} from '@geelato/gl-ui';
import type {AppMeta, PageParams} from "../../compare/type";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<AppMeta>, default: []},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'view'}, // 页面状态
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
  data: {type: Array<PageQueryFilter>, default: () => []}
});

// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 1600, y: props.height});
// 列表 - 数据
const renderData = ref<PageQueryFilter[]>([]);
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  createAt: {sortDirections: ['descend', 'ascend'], sorter: false}
});
// 列表 - 数据列表
const visibleForm = ref<boolean>(false);
const templateData = ref<PageQueryFilter[]>([]);

const viewTemplate = (value: string) => {
  templateData.value = [];
  visibleForm.value = false;
  if (value && isUtil.isJSON(value)) {
    templateData.value = JSON.parse(value);
    visibleForm.value = true;
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    scroll.value.y = props.height - 115;
    // 加载数据
    renderData.value = cloneDeep(props.data);
    templateData.value = [];
  }
}, {deep: true, immediate: true});
</script>
<template>
  <a-table
      :bordered="{cell:true}"
      :columns="([] as TableColumnData[])"
      :data="renderData"
      :pagination="false"
      :scroll="{x: 70+180*7, y: scroll.y}"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id">
    <template #columns>
      <a-table-column :width="70" align="center" data-index="index" title="序号">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="title" title="标题"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="separators" title="间隔符"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="example" title="示例"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="template" title="规则">
        <template #cell="{ record }">
          <a-button style="width: 18px;height: 18px;" type="text" @click="viewTemplate(record.template)">
            <template #icon>
              <IconEye/>
            </template>
          </a-button>
          {{ record.template }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="enable_status" title="状态"/>
      <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="description" title="备注"/>
    </template>
  </a-table>
  <a-modal draggable  v-model:visible="visibleForm" :footer="false" title="编码规则" title-align="start">
    <a-form :model="templateData" :label-col-props="{ span: 0 }" :wrapper-col-props="{ span: 240 }" class="form">
      <a-form-item>
        <a-table
            :bordered="{cell:true}"
            :data="(templateData as TableData[])"
            :pagination="false"
            :scrollbar="false"
            :show-header="false"
            :stripe="true"
            column-resizable
            row-key="id"
            size="small">
          <template #columns>
            <a-table-column :ellipsis="true" :tooltip="true" :width="70" align="center" data-index="seqNo" title="排序"/>
            <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="itemType" title="类型"/>
            <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="itemContent" title="内容">
              <template #cell="{record}">
                <!--        固定字符          -->
                <span v-if="record.itemType==='constant'">{{ record.constantValue }}</span>
                <!--        系统变量          -->
                <span v-if="record.itemType==='variable'">{{ record.constantValue }}</span>
                <!--        传递参数          -->
                <span v-if="record.itemType==='argument'">{{ record.constantValue }}</span>
                <!--        序列号（唯一）          -->
                <a-space v-if="record.itemType==='serial'">
                  <span>{{ `${record.serialDigit} 位数` }}</span>
                  <a-divider direction="vertical" style="margin: 0 1px;border-left: 1px solid var(--color-neutral-9);"/>
                  <span> {{ record.serialType === 'random' ? '随机' : (record.serialType === 'order' ? '顺序' : '') }}</span>
                </a-space>
                <!--        日期          -->
                <span v-if="record.itemType==='date'">{{ record.dateType }}</span>
              </template>
            </a-table-column>
          </template>
          <template #empty></template>
        </a-table>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped>
:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>