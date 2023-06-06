<script setup lang="ts">
// @ts-nocheck
import {computed, onMounted, type PropType, ref} from "vue";
import type {EntityReaderParam} from "@geelato/gl-ui";
import {ConvertUtil} from "@geelato/gl-ui";
import QueryItem from "./query";
import {GlIconfont} from "@geelato/gl-ui";

const emit = defineEmits(["search"]);
const props = defineProps({
  items: {
    type: Array as PropType<QueryItem[]>,
    default() {
      return [];
    },
  },
});

const generateFormModel = () => {
  const fModel: any = {};
  props.items?.forEach((item: QueryItem) => {
    fModel[item.id] = item.component?.value;
  });
  // console.log('GlQuery > generateFormModel() > fModel:', fModel)
  return fModel;
};
const defaultValue = generateFormModel()

const formModel = ref(defaultValue);

/**
 *  创建查询参数
 */
const getEntityReaderParams = () => {
  const entityReaderParams: Array<EntityReaderParam> = [];
  props.items?.forEach((item: QueryItem) => {
    if (
        formModel.value[item.id] !== undefined &&
        ConvertUtil.trim(`${formModel.value[item.id]}`).length > 0
    ) {
      entityReaderParams.push({
        name: item.name,
        cop: item.cop,
        value: formModel.value[item.id],
      });
    }
  });
  return entityReaderParams;
};
/**
 *  基于页面的组件，设置form表单的值
 */

const onSearch = () => {
  formModel.value = generateFormModel()
  emit("search", getEntityReaderParams(), formModel.value);
};
const reset = () => {
  props.items?.forEach((item: QueryItem) => {
    if (item.component?.value) {
      item.component.value = defaultValue[item.id]
    }
  });
  onSearch()
};

const renderItems = computed(() => {
  return props.items.filter((item: QueryItem) => {
    return item.isHidden !== true
  })
})
const t = (value: any) => {
  return value
}
onMounted(() => {
  onSearch()
})
defineExpose({getEntityReaderParams, reset});
</script>

<template>
  <a-row>
    <a-col :flex="1">
      <a-form
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
      >
        <a-row :gutter="16">
          <a-col
              v-for="(item, index) in renderItems"
              :key="index"
              :span="item.colspan"
          >
            <a-form-item :field="item.id" :label="item.title ? t(item.title) : t(item.name)">
              <GlComponent v-if="item.component" :glComponentInst="item.component"
                           @change="onSearch"></GlComponent>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider style="height: 84px" direction="vertical"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space direction="vertical" :size="18">
        <a-button type="primary" @click="onSearch">
          <template #icon>
            <GlIconfont type="gl-search"></GlIconfont>
          </template>
          查询
        </a-button>
        <a-button @click="reset">
          <template #icon>
            <GlIconfont type="gl-reset"></GlIconfont>
          </template>
          重置
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<style scoped></style>
