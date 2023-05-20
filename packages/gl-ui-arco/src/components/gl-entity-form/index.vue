<template>
  <div class="gl-entity-form">
    <a-form ref="formRef" :model="formData" :title="title" :layout="layout"
            :autoLabelWidth="autoLabelWidth" :disabled="isRead">
      <template v-if="glIsRuntime">
        <slot></slot>
      </template>
      <template v-else>
        <GlInsts :glComponentInst="glComponentInst"></GlInsts>
      </template>
    </a-form>
    <div class="formSubmit" style="text-align: center;padding: 2em 1em">
      <a-button type="primary" @click="submitForm">保存</a-button>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlEntityForm"
}
</script>
<script lang="ts" setup>
import {computed, inject, nextTick, type PropType, ref} from 'vue';
import type {FormInstance} from '@arco-design/web-vue/es/form';
import useLoading from '../../hooks/loading';
import {isDataEntry} from "@geelato/gl-ui-schema-arco";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import {entityApi, mixins, useGlobal, PageProvideProxy, PageParamType} from "@geelato/gl-ui";

const pageProvideProxy: PageProvideProxy = inject('pageProvideProxy')!
console.log('GlEntityForm > inject pageProvideProxy:', pageProvideProxy)
const isRead = pageProvideProxy.getParamValue('formState') === 'read'

const global = useGlobal()

type LayoutType = "inline" | "horizontal" | "vertical"

class FormItem {
  componentName: string = ''
  fieldName: string = ''
  value?: any
}

const form = ref({})
const props = defineProps({
  title: String,
  bindEntity: {
    type: Object,
    required: true
  },
  layout: {
    type: String as PropType<LayoutType>,
    default() {
      return 'horizontal'
    }
  },
  autoLabelWidth: {
    type: Boolean,
    default() {
      return false
    }
  },
  ...mixins.props
})
const formData = ref({});
const formItems = ref<Array<FormItem>>([]);
const formRef = ref<FormInstance>();
/**
 * 遍历取得所有表单项的值
 */
const buildFieldItems = () => {
  formItems.value.length = 0

  function buildFieldItem(inst: ComponentInstance) {
    for (let index in inst.children) {
      // @ts-ignore
      let subInst = inst.children[index]
      // console.log('isDataEntry:', subInst.componentName, isDataEntry(subInst.componentName), ' subInst:', subInst)
      if (isDataEntry(subInst.componentName)) {
        let formItem = {
          componentName: subInst.componentName,
          fieldName: subInst.props.bindField.fieldName,
          value: subInst.value
        }
        formItems.value.push(formItem)
        // @ts-ignore
        formData.value[subInst.props.bindField.fieldName] = subInst.value
      }
      if (subInst.children && subInst.children.length > 0) {
        buildFieldItem(subInst)
      }
    }
  }

  buildFieldItem(props.glComponentInst)
  console.log('buildFieldItems formItems:', formItems.value, 'formData:', formData.value)
}

const setFormItemValues = (dataItem: { [key: string]: any }) => {
  formItems.value.length = 0

  function setFieldItemValue(inst: ComponentInstance) {
    for (let index in inst.children) {
      let subInst = inst.children[index]
      // console.log('isDataEntry:', subInst.componentName, isDataEntry(subInst.componentName), ' subInst:', subInst)
      if (isDataEntry(subInst.componentName)) {
        subInst.value = dataItem[subInst.props.bindField.fieldName]
        let formItem = {
          componentName: subInst.componentName,
          fieldName: subInst.props.bindField.fieldName,
          value: subInst.value
        }
        formItems.value.push(formItem)
        // @ts-ignore
        formData.value[subInst.props.bindField.fieldName] = subInst.value
      }
      if (subInst.children && subInst.children.length > 0) {
        setFieldItemValue(subInst)
      }
    }
  }
  setFieldItemValue(props.glComponentInst)
}

let entityRecordId = pageProvideProxy.getParamValue('recordId')
/**
 *  加载表单数据
 */
const loadForm = () => {

  if (!entityRecordId) {
    if(isRead){
      global.$notification.error({
        duration: 8000,
        title: '参数不全',
        content: '当前表单为只读模式，但没有传递参数recordId，请检查表单页面的打开事件配置中，是否已配置了参数，如参数名：recordId，值$ctx.record.id。',
        closable: true
      })
    }
    return
  }
  // 构建表单数据项
  buildFieldItems()
  // 基于表单项，构建字段
  const fieldNames: Array<string> = []
  formItems.value.forEach((item) => {
    fieldNames.push(item.fieldName)
  })
  if (checkBindEntity()) {
    entityApi.query(props.bindEntity.entityName, fieldNames.join(','), {id: entityRecordId}).then((resp) => {
      const items = resp?.data?.data
      if (items && items.length > 0) {
        setFormItemValues(items[0])
      }
    })
  }
}

const checkBindEntity = () => {
  if (!props.bindEntity || !props.bindEntity.entityName) {
    global.$notification.error({
      duration: 6000,
      title: '表单未绑定实体',
      content: '请在设计器中选择表单组件，右边的属性面板选择实体进行绑定。',
      closable: true
    })
    return false
  }
  return true
}
/**
 *  保存表单数据
 */
const saveForm = async () => {
  if (checkBindEntity()) {
    console.log('saveForm props.bindEntity:', props.bindEntity)
    return await entityApi.save(props.bindEntity.entityName, {id: entityRecordId, ...formData.value})
  }
}

const {loading, setLoading} = useLoading();
/**
 *  提交表单：构建表单项、校验、保存到服务端
 */
const submitForm = async () => {
  // checkConfig()
  // 构建表单数据项，设置值
  buildFieldItems()
  // 再进一步进行表单数据项值校验
  const res = await formRef.value?.validate();
  console.log('submitForm() validate form:', formRef.value, ' result:', res)
  if (!res) {
    setLoading(true);
    const saveResult = await saveForm()
    entityRecordId = saveResult?.data.data
    console.log('saveResult:', saveResult)
    setLoading(false)
    return true
  } else {
    return false
  }
  setTimeout(() => {
    setLoading(false);
  }, 1000);
};

/**
 *  检查配置是否正常
 *  用于设计时
 */
const checkConfig = () => {
  function checkFieldItem(inst: ComponentInstance) {
    for (let index in inst.children) {
      let subInst = inst.children[index]
      if (isDataEntry(subInst.componentName)) {
        if (!subInst.props.bindField) {
          global.$notification.error(`组件[${subInst.componentName}],标题：${subInst.props.label},未绑定模型字段。`)
        }
      }
      if (subInst.children && subInst.children.length > 0) {
        checkFieldItem(subInst)
      }
    }
  }

  checkFieldItem(props.glComponentInst)
}

loadForm()
defineExpose([submitForm])
</script>

<style>
.gl-entity-form {
  width: 100%;
}

/**
 * 在arco-drawer-body内，不显示提交按钮
 */
.arco-drawer-body .gl-entity-form .formSubmit {
  display: none;
}

.gl-entity-form-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  padding: 14px 20px 14px 0;
  background: var(--color-bg-2);
  text-align: right;
}
</style>
