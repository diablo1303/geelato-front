<script setup lang="ts">
// @ts-nocheck
import {useI18n} from "vue-i18n";
import {type PropType, ref} from "vue";
import type {EntityReaderParam} from "@geelato/gl-ui";
import {ConvertUtil, CheckUtil} from "@geelato/gl-ui";
import type {QueryCol} from "./query";

const {t} = CheckUtil.isBrowser() ? useI18n() : {
  t: () => {
  }
};

const emit = defineEmits(["search"]);
const props = defineProps({
  items: {
    type: Array as PropType<QueryCol[]>,
    default() {
      return [];
    },
  },
});

const generateDefaultFormModel = () => {
  const defaultFormModel: any = {};
  props.items?.forEach((item, index) => {
    if (item.name) {
      defaultFormModel[index] = undefined;
    }
  });
  return defaultFormModel;
};
const formModel = ref(generateDefaultFormModel());

const getEntityReaderParams = () => {
  const entityReaderParams: Array<EntityReaderParam> = [];
  console.log("formModel", formModel.value);
  props.items?.forEach((item: QueryCol, index) => {
    if (
        formModel.value[index] !== undefined &&
        ConvertUtil.trim(`${formModel.value[index]}`).length > 0
    ) {
      entityReaderParams.push({
        name: item.id,
        cop: item.cop,
        value: formModel.value[index],
      });
    }
  });
  return entityReaderParams;
};

const onSearch = () => {
  emit("search", getEntityReaderParams(), formModel.value);
};
const reset = () => {
  formModel.value = generateDefaultFormModel();
};
defineExpose({getEntityReaderParams, reset});
</script>

<template>
  <a-row>
    <a-col :flex="1">
      <a-form
          :model="formModel"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
      >
        <a-row :gutter="16">
          <a-col
              v-for="(item, index) in items"
              :key="index"
              :span="item.colspan"
          >
            <a-form-item :field="item.id" :label="item.title ? t(item.title) : t(item.name)">
              <GlComponent v-if="item.component" :glComponentInst="item.component"></GlComponent>
<!--              <component v-if="item.component"-->
              <!--                         :is="item.component.componentName"-->
              <!--                         v-bind="item.component.props"-->
              <!--                         v-model="formModel[index]"-->
              <!--                         :placeholder="t(item.component.props?.placeholder || '')"-->
              <!--                         @keyup.enter="onSearch"/>-->
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
            <icon-search/>
          </template>
          {{ t("searchTable.form.search") }}
        </a-button>
        <a-button @click="reset">
          <template #icon>
            <icon-refresh/>
          </template>
          {{ t("searchTable.form.reset") }}
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<style scoped></style>
