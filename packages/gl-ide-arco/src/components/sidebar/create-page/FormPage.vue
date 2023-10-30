<script lang="ts">
export default {
  name: 'FormPageConfig'
}
</script>
<script lang="ts" setup>
import { type PropType, type Ref, ref, watch } from 'vue'
import type { EntityMeta, FieldMeta } from '@geelato/gl-ui'
import { FormPageCreator } from '../../stage/page-creator/FormPageCreator'
import { PageCreatorOptions } from '../../stage/page-creator/PageCreator'
import type { PageInfo } from './CreatePageNav'
import { PageType } from '@geelato/gl-ui'

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

const entityName = ref('')
const form: any = ref({
  fieldRange: 'ALL',
  colSpan: 3
})
const pageCreatorOptions = ref(new PageCreatorOptions())

const formPageCreator = new FormPageCreator()
const pageInfo: Ref<PageInfo> = ref(props.modelValue)
pageInfo.value.type = PageType.formPage
pageInfo.value.iconType = 'gl-form'
watch(
  form,
  () => {
    pageCreatorOptions.value.entityMeta.entityName = form.value.bindEntity?.entityName
    pageCreatorOptions.value.pageLabel = form.value.pageLabel
    pageCreatorOptions.value.colSpan = form.value.colSpan
    pageInfo.value.label = form.value.pageLabel
    pageInfo.value.content = formPageCreator.create(pageCreatorOptions.value)
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
      'updatorName',
      'delStatus',
      'seqNo',
      'deptId',
      'buId',
      'tenantCode'
    ].includes(fieldMeta.name)
  })
  pageCreatorOptions.value.entityMeta.entityName = em.entityName
  pageCreatorOptions.value.entityMeta.entityTitle = em.entityTitle
  form.value.pageLabel = entityMeta.entityTitle + '信息页面'
  pageInfo.value.content = formPageCreator.create(pageCreatorOptions.value)
  // console.log('loadFieldMetas', em)
}
/**
 *  获取页面配置
 */
const getPage = () => {
  return pageInfo.value
}

defineExpose({ getPage })
</script>

<template>
  <div>
    <a-form :model="form">
      <a-form-item field="bindEntity" label="选择模型" help="基于模型创建页面">
        <GlAppEntitySelect v-model="form.bindEntity" @loadFieldMetas="loadFieldMetas" />
      </a-form-item>
      <a-form-item field="pageLabel" label="页面名称">
        <a-input v-model="form.pageLabel" placeholder="" />
      </a-form-item>
      <a-form-item field="colSpan" label="页面布局">
        <a-radio-group type="button" v-model="form.colSpan">
          <a-radio :value="1">一行一列</a-radio>
          <a-radio :value="2">一行两列</a-radio>
          <a-radio :value="3">一行三列</a-radio>
          <a-radio :value="4">一行四列</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="fieldRange" label="选择字段">
        <a-radio-group type="button" v-model="form.fieldRange">
          <a-radio value="ALL">生成所有字段</a-radio>
          <a-radio value="SOME" disabled title="暂不支持">生成指定字段</a-radio>
        </a-radio-group>
        <div v-if="form.fieldRange === 'SOME'"></div>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped></style>
