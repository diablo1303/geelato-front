<script lang="ts">
export default {
  name: 'CreatePageNav'
}
</script>
<script lang="ts" setup>
import { ref, toRaw, watch } from 'vue'
import FormPage from './FormPage.vue'
import ListPage from './ListPage.vue'
import { PageInfo } from './CreatePageNav'
import { PageType } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})

const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const currentPageType = ref('')

const selectPageTemplate = (selectedTemplate: PageType) => {
  if (selectedTemplate !== currentPageType.value) {
    currentPageType.value = selectedTemplate
  }
}

const listPage = ref()
const formPage = ref()
/**
 *  需要创建的页面
 */
const getPages = async (): Promise<PageInfo[]> => {
  if (currentPageType.value === PageType.emptyPage) {
    // TODO
  } else if (currentPageType.value === PageType.formPage) {
    if (formPage.value) {
      const errors = await formPage.value.validate()
      if (errors) {
        return []
      }

      return [toRaw(formPage.value.getPage())]
    }
  }
  if (currentPageType.value === PageType.listPage) {
    if (listPage.value) {
      const errors = await listPage.value.validate()
      if (errors) {
        return []
      }
      return [toRaw(listPage.value.getPage())]
    }
  }
  return [toRaw(new PageInfo())]
}

defineExpose({ getPages })
</script>

<template>
  <div class="gl-create-from-nav">
    <div class="gl-left">
<!--      <div class="gl-title">自定义创建</div>-->
<!--      <a-button style="width: 120px; height: 120px">-->
<!--        <div>-->
<!--          <span style="font-size: 48px">+</span>-->
<!--          <div style="font-size: 14px">从空白创建</div>-->
<!--        </div>-->
<!--      </a-button>-->
      <div class="gl-title">从模板创建</div>
      <!--      <a-card-->
      <!--        class="gl-item"-->
      <!--        @click="selectPageTemplate('TableAndFormPage')"-->
      <!--        :class="{ 'gl-selected': currentPageType === 'TableAndFormPage' }"-->
      <!--      >-->
      <!--        <template #cover>-->
      <!--          <div :style="{ height: '150px', overflow: 'hidden' }">-->
      <!--            <img :style="{ width: '100%' }" src="../../../assets/pages/tableAndForm.jpg" />-->
      <!--          </div>-->
      <!--        </template>-->
      <!--        <a-card-meta title="表单+列表" description="创建增删改查（CRUD）页面组合。"></a-card-meta>-->
      <!--      </a-card>-->
      <a-card
        class="gl-item"
        @click="selectPageTemplate(PageType.formPage)"
        :class="{ 'gl-selected': currentPageType === PageType.formPage }"
      >
        <template #cover>
          <div :style="{ height: '150px', overflow: 'hidden' }">
            <img :style="{ width: '100%' }" src="../../../assets/pages/form.jpg" />
          </div>
        </template>
        <a-card-meta title="表单" description="只创建表单页面"></a-card-meta>
      </a-card>
      <a-card
        class="gl-item"
        @click="selectPageTemplate(PageType.listPage)"
        :class="{ 'gl-selected': currentPageType === PageType.listPage }"
      >
        <template #cover>
          <div :style="{ height: '150px', overflow: 'hidden' }">
            <img :style="{ width: '100%' }" src="../../../assets/pages/table.jpg" />
          </div>
        </template>
        <a-card-meta title="列表" description="只创列表页面"></a-card-meta>
      </a-card>
    </div>
    <div class="gl-right">
      <FormPage
        ref="formPage"
        v-if="currentPageType === PageType.formPage"
      ></FormPage>
      <ListPage
        ref="listPage"
        v-if="currentPageType === PageType.listPage"
      ></ListPage>
    </div>
  </div>
</template>

<style lang="less">
.gl-create-from-nav {
  max-height: 800px;
  min-height: 800px;

  display: flex;

  .gl-left {
    flex: 1;
    padding: 24px;
    width: 340px;
    max-width: 340px;
    border-right: 1px solid silver;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .gl-right {
    padding: 24px;
    flex: 1;
  }

  .gl-title {
    padding: 14px 0;
    border: 0;
  }

  .gl-item {
    width: 320px;
    margin-bottom: 16px;
    cursor: pointer;
  }

  .gl-item:hover,
  .gl-item.gl-selected {
    border: 1px solid royalblue;
    box-shadow: 2px 2px 2px 1px rgba(4, 103, 194, 0.2);
  }
}
</style>
