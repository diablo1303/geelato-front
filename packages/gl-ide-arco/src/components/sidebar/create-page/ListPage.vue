<script lang="ts">
export default {
  name: 'ListPage'
}
</script>
<script lang="ts" setup>
import { type PropType, type Ref, ref, watch } from 'vue'
import type { EntityMeta, FieldMeta } from '@geelato/gl-ui'
import { ListPageCreator } from './json-creator/ListPageCreator'
import { PageCreatorOptions } from './json-creator/PageCreator'
import type { PageInfo } from './CreatePageNav'
import { entityApi, PageType } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  /**
   *  page配置
   */
  modelValue: {
    type: Object as PropType<PageInfo>,
    default() {
      return {}
    }
  }
})

const fieldMetas: Ref<FieldMeta[]> = ref([])
const entityName = ref('')
const form: any = ref({
  fieldRange: 'ALL',
  pageLabel: '',
  pageExtendId: '',
  queryFields: []
})
const pageCreatorOptions = ref(new PageCreatorOptions())

const listPageCreator = new ListPageCreator()
const pageInfo: Ref<PageInfo> = ref(props.modelValue)
pageInfo.value.type = PageType.listPage
pageInfo.value.iconType = 'gl-list'
watch(
  form,
  () => {
    pageCreatorOptions.value.entityMeta.entityName = form.value.bindEntity?.entityName
    pageCreatorOptions.value.queryFields = form.value.queryFields
    pageCreatorOptions.value.pageInfo = pageInfo.value
    pageInfo.value.label = form.value.pageLabel
    // 检测到配置信息变化之后即重新生成页面内容
    pageInfo.value.content =  listPageCreator.create(pageCreatorOptions.value)
    emits('update:modelValue', pageInfo.value)
  },
  { deep: true }
)

const loadFieldMetas = (entityMeta: EntityMeta) => {
  const em = JSON.parse(JSON.stringify(entityMeta))
  // 过滤掉系统内置的字段
  pageCreatorOptions.value.entityMeta.fieldMetas = em.fieldMetas.filter((fieldMeta: FieldMeta) => {
    return ![
      'id',
      'createAt',
      'creator',
      'creatorName',
      'updateAt',
      'updater',
      'updaterName',
      'delStatus',
      'seqNo',
      'deptId',
      'buId',
      'tenantCode'
    ].includes(fieldMeta.name)
  })
  pageCreatorOptions.value.entityMeta.entityName = em.entityName
  pageCreatorOptions.value.entityMeta.entityTitle = em.entityTitle
  fieldMetas.value = pageCreatorOptions.value.entityMeta.fieldMetas
  form.value.pageLabel = entityMeta.entityTitle + '列表页面'
  pageCreatorOptions.value.showFields = fieldMetas.value
  pageInfo.value.content =  listPageCreator.create(pageCreatorOptions.value)
}
const changePageExtendId = async (pageExtendId: string) => {
  return entityApi.queryPageByExtendId(pageExtendId, 'source').then((res) => {
    // console.log('changePageExtendId', pageExtendId, res)
    pageInfo.value.pageExtendId = form.value.pageExtendId
    pageInfo.value.pageExtendContent = JSON.parse(res.data[0].sourceContent)
  })
}
const myForm = ref()
/**
 *  获取页面配置
 */
const getPage = async () => {
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
        label="选择模型"
        help="基于模型创建页面"
        :rules="[{ required: true, message: '必填' }]"
      >
        <GlAppEntitySelect v-model="form.bindEntity" @loadFieldMetas="loadFieldMetas" />
      </a-form-item>
      <a-form-item
        field="pageLabel"
        label="页面名称"
        :rules="[{ required: true, message: '必填' }]"
      >
        <a-input v-model="form.pageLabel" placeholder="请先选择模型" />
      </a-form-item>
      <a-form-item
        field="pageExtendId"
        label="关联的表单页面"
        :rules="[{ required: true, message: '必填' }]"
      >
        <GlPageSelect v-model="form.pageExtendId" @change="changePageExtendId"></GlPageSelect>
      </a-form-item>
      <a-form-item field="queryFields" label="查询条件字段">
        <a-select v-model="form.queryFields" multiple value-key="name" placeholder="请先选择模型">
          <a-option v-for="fieldMeta in fieldMetas" :value="fieldMeta">
            {{ fieldMeta.title }} {{ fieldMeta.name }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        field="fieldRange"
        label="数据列字段"
        :rules="[{ required: true, message: '必填' }]"
      >
        <a-radio-group type="button" v-model="form.fieldRange">
          <a-radio value="ALL">生成所有字段</a-radio>
          <a-radio value="SOME" disabled title="暂不支持">生成指定字段</a-radio>
        </a-radio-group>
        <div v-if="form.fieldRange === 'SOME'"></div>
      </a-form-item>
    </a-form>
  </div>
</template>