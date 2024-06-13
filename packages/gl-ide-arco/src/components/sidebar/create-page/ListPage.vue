<script lang="ts">
export default {
  name: 'ListPage'
}
</script>
<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue'
import type { EntityMeta, FieldMeta } from '@geelato/gl-ui'
import { entityApi, PageType } from '@geelato/gl-ui'
import { ListPageCreator } from './json-creator/ListPageCreator'
import { PageCreatorOptions } from './json-creator/PageCreator'
import { FilteredFieldNames, PageInfo } from './CreatePageNav'

const fieldMetas: Ref<FieldMeta[]> = ref([])
const form: any = ref({
  fieldRange: 'ALL',
  pageLabel: '',
  pageExtendId: '',
  queryFields: [],
  openPageWidth: '80%',
  openPageMode: 'Drawer'
})
const pageCreatorOptions = ref(new PageCreatorOptions())

const listPageCreator = new ListPageCreator()
const pageInfo: Ref<PageInfo> = ref(new PageInfo(PageType.listPage))
pageInfo.value.type = PageType.listPage
pageInfo.value.iconType = 'gl-list'
watch(
  form,
  () => {
    pageCreatorOptions.value.entityMeta.entityName = form.value.bindEntity?.entityName
    pageCreatorOptions.value.queryFields = form.value.queryFields
    pageInfo.value.label = form.value.pageLabel?.trim()
    pageInfo.value.openPageWidth = form.value.openPageWidth?.trim() || '80%'
    pageInfo.value.openPageMode = form.value.openPageMode?.trim()
    pageCreatorOptions.value.pageInfo = pageInfo.value
    console.log('pageInfo.value',pageInfo.value)
  },
  { deep: true, immediate: true }
)

const loadFieldMetas = (entityMeta: EntityMeta) => {
  const em = JSON.parse(JSON.stringify(entityMeta))
  // 过滤掉系统内置的字段
  pageCreatorOptions.value.entityMeta.fieldMetas = em.fieldMetas.filter((fieldMeta: FieldMeta) => {
    return !FilteredFieldNames.includes(fieldMeta.name)
  })
  pageCreatorOptions.value.entityMeta.entityName = em.entityName
  pageCreatorOptions.value.entityMeta.entityTitle = em.entityTitle
  fieldMetas.value = pageCreatorOptions.value.entityMeta.fieldMetas
  form.value.pageLabel = entityMeta.entityTitle + '列表'
  pageCreatorOptions.value.showFields = fieldMetas.value
}
const changePageExtendId = async (pageExtendId: string) => {
  return entityApi.queryPageByExtendId(pageExtendId, 'source').then((res) => {
    pageInfo.value.pageExtendId = form.value.pageExtendId
    if (res.data.length > 0) {
      pageInfo.value.pageExtendContent = JSON.parse(res.data[0].sourceContent)
    }
  })
}

watch(
  () => {
    return form.value.pageExtendId
  },
  (val, oval) => {
    if (val && !oval) {
      changePageExtendId(val)
    }
  }
)
const myForm = ref()
/**
 *  获取页面配置
 */
const getPage = async () => {
  pageInfo.value.content = await listPageCreator.createPage(pageCreatorOptions.value)
  console.log('create listPage pageInfo:', pageInfo.value)
  return pageInfo.value
}

const validate = () => {
  return myForm.value.validate()
}

defineExpose({ getPage, validate })
</script>

<template>
  <div>
    <a-form ref="myForm" :model="form">
      <a-form-item
        field="bindEntity"
        label="选择业务模型"
        help="基于模型创建页面"
        :rules="[{ required: true, message: '必填' }]"
      >
        <GlAppEntitySelect v-model="form.bindEntity" @loadFieldMetas="loadFieldMetas" />
      </a-form-item>
      <a-form-item
        field="pageLabel"
        label="列表页面标题"
        :rules="[{ required: true, message: '必填' }]"
      >
        <a-input v-model="form.pageLabel" placeholder="请先选择模型" />
      </a-form-item>
      <a-form-item field="queryFields" label="列表页面查询条件">
        <a-select v-model="form.queryFields" multiple value-key="name" placeholder="请先选择模型">
          <a-option v-for="fieldMeta in fieldMetas" :value="fieldMeta">
            {{ fieldMeta.title }} {{ fieldMeta.name }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        field="fieldRange"
        label="列表页面数据列"
        :rules="[{ required: true, message: '必填' }]"
      >
        <a-radio-group type="button" v-model="form.fieldRange">
          <a-radio value="ALL">生成所有字段</a-radio>
          <a-radio value="SOME" disabled title="暂不支持">生成指定字段</a-radio>
        </a-radio-group>
        <div v-if="form.fieldRange === 'SOME'"></div>
      </a-form-item>
      <a-form-item
        field="pageExtendId"
        label="打开的表单页面"
        :rules="[{ required: true, message: '必填' }]"
        extra="列表新增、修改、查看操作时，打开的表单页面"
      >
        <GlPageSelect
          v-model="form.pageExtendId"
          @change="changePageExtendId"
          :allow-open="false"
        ></GlPageSelect>
      </a-form-item>
      <a-form-item
        field="openPageWidth"
        label="打开的页面宽度"
        extra="列表新增、修改、查看操作时，打开的表单页面的宽度，默认为80%，可以是1024px等具体宽度。"
      >
        <a-input v-model="form.openPageWidth" placeholder="请输入宽度，如：1024px" />
      </a-form-item>
      <a-form-item
        field="openPageMode"
        label="打开的页面模式"
        extra="列表新增、修改、查看操作时，打开的表单页面的模式，默认为抽屉模式，即从右边向左滑出表单页面。"
      >
        <a-radio-group v-model="form.openPageMode">
          <a-radio value="Drawer">抽屉模式</a-radio>
          <a-radio value="Modal">弹窗模式</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>
</template>
