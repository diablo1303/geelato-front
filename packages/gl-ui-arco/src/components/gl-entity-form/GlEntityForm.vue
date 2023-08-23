<template>
  <div class="gl-entity-form" v-if="refreshFlag">
    <a-form ref="formRef" :model="formData" :layout="layout!"
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
import {inject, onMounted, type PropType, provide, ref} from 'vue';
import type {FormInstance} from '@arco-design/web-vue/es/form';
import useLoading from '../../hooks/loading';
import {isDataEntry} from "@geelato/gl-ui-schema-arco";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import {
  entityApi,
  mixins,
  useGlobal,
  PageProvideProxy,
  PageProvideKey,
  FormProvideKey,
  FormProvideProxy, utils
} from "@geelato/gl-ui";

// onLoadedData：从服务端加载完数据并设置到表单中
const emits = defineEmits(['onLoadedData'])
const formProvideProxy = new FormProvideProxy()
provide(FormProvideKey, formProvideProxy)

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
// console.log('GlEntityForm > inject pageProvideProxy:', pageProvideProxy)

const refreshFlag = ref(true)
const global = useGlobal()

type LayoutType = "inline" | "horizontal" | "vertical"

class FormItem {
  componentName: string = ''
  label: string = ''
  fieldName: string = ''
  value?: any
  isFormSubTable?: boolean = false
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
const isRead = pageProvideProxy.isPageStatusRead()
const formParams = pageProvideProxy.getParamsByPrefixAsObject('form')
// formData中不包括记录id，记录id在entityRecordId中定义
const formData = ref<{ [key: string]: any }>(formParams);
// console.log('GlEntityForm > formData:', formData, 'formParams:', formParams)
let entityRecordId = ref<string>(formParams.id)
formProvideProxy.setRecordId(entityRecordId.value)

const formItems = ref<Array<FormItem>>([]);
const subFormTableInstIds = ref<Array<string>>([])
const formRef = ref<FormInstance>();

const checkValidDataEntry = (componentName: string) => {
  return isDataEntry(componentName) && componentName !== 'GlEntityTableSub'
}

/**
 * 遍历取得所有表单项的值
 */
const buildFieldItems = () => {
  formItems.value.length = 0
  subFormTableInstIds.value.length = 0

  function buildFieldItem(inst: ComponentInstance) {
    for (let index in inst.children) {
      // @ts-ignore
      let subInst = inst.children[index]
      // console.log('checkValidDataEntry:', subInst.componentName, checkValidDataEntry(subInst.componentName), ' subInst:', subInst)
      // 处理主表字段，排除子表单GlEntityTableSub，子表单另行处理
      if (checkValidDataEntry(subInst.componentName)) {
        // console.log('subInst form:', subInst.componentName)
        if (!subInst.props.bindField) {
          // console.error('GlEntityForm > 组件未进行数据绑定，组件为：', subInst)
          let moreInfo = ''
          if (subInst.group === 'dataEntry') {
            moreInfo = subInst.props.label || ''
            moreInfo = moreInfo ? '，' + moreInfo : ''
          }
          const content = `组件未进行数据绑定，组件标识为：${subInst.id}${moreInfo}`
          global.$notification.error({title: '组件未绑定', content: content})
          // console.error('GlEntityForm > ', content)
          continue
        }
        let formItem = {
          componentName: subInst.componentName,
          label: subInst.props.label || '',
          fieldName: subInst.props.bindField.fieldName,
          value: subInst.value
        }
        const foundSameBindFiled = formItems.value.find((formItem: any) => {
          return formItem.fieldName === subInst.props.bindField?.fieldName
        })
        if (foundSameBindFiled) {
          const info = `多组件绑定同字段：${subInst.props.bindField.fieldName}，组件：${foundSameBindFiled.label}、${subInst.props.label}`
          console.error(info)
          global.$notification.error({
            title: '字段重复',
            content: info
          })
          return
        } else {
          formData.value[subInst.props.bindField.fieldName] = subInst.value
        }
        formItems.value.push(formItem)
      } else if (subInst.componentName === 'GlEntityTableSub' && subInst.props?.base?.isFormSubTable) {
        // 处理从表信息，只有明确是子表的才算
        // 先记录，后续在其它方法中处理
        subFormTableInstIds.value.push(subInst.id)
      }
      if (subInst.children && subInst.children.length > 0) {
        buildFieldItem(subInst)
      }
    }
  }

  buildFieldItem(props.glComponentInst)
  formProvideProxy.setValues(formData.value)
  // console.log('buildFieldItems formItems:', formItems.value, 'formData:', formData.value)
}

/**
 * 构建formItems
 * 同时设置inst的value
 * @param dataItem
 */
const setFormItemValues = (dataItem: { [key: string]: any }) => {
  formItems.value.length = 0

  // subFormTableInstIds.value.length = 0
  function setFieldItemValue(inst: ComponentInstance) {
    for (let index in inst.children) {
      let subInst = inst.children[index]
      // console.log('setFieldItemValue() > checkValidDataEntry:', subInst.componentName, checkValidDataEntry(subInst.componentName), ' subInst:', subInst)
      // 只要做了数据绑定，不管是输入还是展示类的组件，都需进行值设置
      if (subInst.props.bindField) {
        const foundFieldName = Object.keys(dataItem).find((key: string) => {
          return key === subInst.props.bindField!.fieldName
        })
        if (foundFieldName) {
          const value = dataItem[subInst.props.bindField.fieldName]
          // 注意！！ 由于AInputNumber的值不支持设置字符串，这里对可能的字符串值进行转换
          if (subInst.componentName === 'AInputNumber') {
            // @ts-ignore
            subInst.value = typeof value !== 'number' ? Number(value) : value
          } else {
            subInst.value = value
          }

          // 对于输入表单项，需要另外记录formItems、formData
          if (checkValidDataEntry(subInst.componentName)) {
            let formItem = {
              componentName: subInst.componentName,
              label: subInst.props.label || '',
              fieldName: subInst.props.bindField.fieldName,
              value: subInst.value,
              isFormSubTable: false
            }
            formItems.value.push(formItem)
            // @ts-ignore
            formData.value[subInst.props.bindField.fieldName] = subInst.value
          }
        }
      }
      // console.log('setFieldItemValue ', subInst.componentName, subInst.props.label, subInst.id, subInst.value)

      if (subInst.children && subInst.children.length > 0) {
        setFieldItemValue(subInst)
      }
    }
  }

  setFieldItemValue(props.glComponentInst)

  // !!!注意  刷新表单会导致表单内的所有组件重建，有性能问题，【禁用】该操作；若存在组件信息未能更新的情况，需针对相应的组件，设置自动更新
  // 设置表单值后，刷新表单
  // refreshFlag.value = false
  // nextTick(() => {
  //   refreshFlag.value = true
  // })

  // console.log('GlEntityForm > setFormItemValues() > formData:', formData.value, dataItem)
  emits('onLoadedData', {data: formData.value})
}

/**
 *  加载表单数据
 */
const loadForm = async () => {
  if (!entityRecordId.value) {
    // 1、不需要从服务端获取
    if (isRead && props.glIsRuntime) {
      global.$notification.error({
        duration: 8000,
        title: '参数不全',
        content: '当前表单为只读模式，但没有传递参数form.id，请检查表单页面的打开事件配置中，是否已配置了参数，如参数名：form.id，值$ctx.record.id。',
        closable: true
      })
    }
    pageProvideProxy.addPageMountedEvent(() => {
      // await utils.sleep(100)
      setFormItemValues(formData.value)
    })
  } else {
    // 2、需要从服务端获取
    // 2.1 构建表单数据项
    buildFieldItems()
    // 2.2基于上面构建的表单项，构建数据加载字段
    const fieldNames: Array<string> = []
    formItems.value.forEach((item) => {
      if (item.fieldName) {
        fieldNames.push(item.fieldName)
      } else {
        console.error('存在未绑定字段', item)
      }
    })
    if (checkBindEntity()) {
      entityApi.query(props.bindEntity.entityName, fieldNames.join(','), {id: entityRecordId.value}).then((resp) => {
        const items = resp?.data
        if (items && items.length > 0) {
          setFormItemValues(items[0])
        }
      })
    }
  }
}

/**
 *  检查是否已绑定实体
 */
const checkBindEntity = () => {
  // 检查实体
  if (!props.bindEntity || !props.bindEntity.entityName) {
    const title = `表单${props.glComponentInst?.id}未绑定实体`
    global.$notification.error({
      duration: 8000,
      title: title,
      content: '请在设计器中选择表单组件，右边的属性面板选择实体进行绑定。',
      closable: true
    })
    console.error(title, props.glComponentInst)
    return false
  }
  // 检查字段

  return true
}

/**
 *  保存表单数据，将数据保存到服务端
 *  在submitForm方法内调用此方法
 */
const saveForm = async () => {
  if (checkBindEntity()) {
    // 先设置主表单部分
    const entityKeyValues: { [key: string]: any } = {id: entityRecordId.value, ...formData.value}
    // console.log('GlEntityForm > saveForm() > formData:', formData.value, 'entityKeyValues:', entityKeyValues)

    // 获取子表单值信息，并设置到保存表单中
    subFormTableInstIds.value.forEach((instId: string) => {
      const componentInst: ComponentInstance = pageProvideProxy.getComponentInst(instId)
      const getRenderColumnsFn = pageProvideProxy.getMethod(instId, 'getRenderColumns')
      const getDeleteDataFn = pageProvideProxy.getMethod(instId, 'getDeleteData')
      // console.log('GlEntityForm > saveForm() > getRenderColumnsFn', getRenderColumnsFn)
      const subEntityFlag = '#'
      const subEntityKey = subEntityFlag + componentInst.props?.base?.entityName
      // 处理需保存的子表单数据
      if (typeof getRenderColumnsFn === 'function') {
        const renderColumns = getRenderColumnsFn()
        // console.log('GlEntityForm > submitForm() > subFormTableColumns', renderColumns)
        const getRenderDataFn = pageProvideProxy.getMethod(instId, 'getRenderData')
        // console.log('GlEntityForm > submitForm() > getRenderDataFn', getRenderDataFn)
        if (typeof getRenderDataFn === 'function') {
          const subFormTableData = getRenderDataFn()
          // console.log('GlEntityForm > submitForm() > subFormTableData', subFormTableData)
          if (subFormTableData && subFormTableData.length > 0) {
            // 子表中，对应主表单ID的字段名
            const subTablePidName = componentInst.props?.base?.subTablePidName
            subFormTableData.forEach((record: any) => {
              // 设置主表父ID
              // 如果是新增，则采用变量，在后台保存主表单后，更换该值 $parent.id
              // 如果是修改，则直接获取当前的entityRecordId
              record[subTablePidName] = entityRecordId.value || '$parent.id'
            })
            entityKeyValues[subEntityKey] = subFormTableData
          }
        }
      }
      // 处理需删除子表单数据
      // 当前为逻辑删除，可依据子表的isLogicDeleteMode来区分，在非逻辑删除场景下的处理方式 TODO
      // console.log('GlEntityForm > saveForm() > getDeleteDataFn', getDeleteDataFn)
      if (typeof getDeleteDataFn === 'function') {
        const deleteData = getDeleteDataFn()
        // console.log('GlEntityForm > saveForm() > deleteData:', deleteData)
        if (deleteData && deleteData.length > 0) {
          entityKeyValues[subEntityKey] = entityKeyValues[subEntityKey] || []
          entityKeyValues[subEntityKey].push(...deleteData)
        }
      }
    })
    // console.log('saveForm props.bindEntity:', props.bindEntity, 'entityKeyValues:', entityKeyValues)
    return await entityApi.save(props.bindEntity.entityName, entityKeyValues)
  }
}

const {loading, setLoading} = useLoading();
const hasSubFormTable = () => {
  return subFormTableInstIds.value.length > 0
}
/**
 *  提交表单：构建表单项、校验、保存到服务端
 *  submitForm() --> saveForm()
 */
const submitForm = async () => {
  // checkConfig()
  // 构建表单数据项，设置值
  buildFieldItems()
  // 再进一步进行表单数据项值校验
  const validateResult = await formRef.value?.validate();
  // 验证子表单，若存在则验证
  let subFormTableValidError = false
  subFormTableInstIds.value.forEach((instId: string) => {
    const validateTableFn = pageProvideProxy.getMethod(instId, 'validateTable')
    if (typeof validateTableFn === 'function') {
      const validateTableData = validateTableFn()
      // console.log('GlEntityForm > submitForm() > validateTableData', validateTableData)
      if (validateTableData.error) {
        subFormTableValidError = true
      }
    }
  })

  // console.log('submitForm() > validate form:', formRef.value, ' result:', validateResult)
  if (!validateResult && !subFormTableValidError) {
    setLoading(true);
    // console.log('submitForm() > formData', formData)
    const saveResult = await saveForm()
    entityRecordId.value = saveResult?.data
    // 将表单值，注册到表单的子项中
    formProvideProxy.setRecordId(entityRecordId.value)
    if (hasSubFormTable()) {
      // 保存之后刷新子表
      subFormTableInstIds.value.forEach((instId: string) => {
        const refreshFn = pageProvideProxy.getMethod(instId, 'refresh')
        if (typeof refreshFn === 'function') {
          refreshFn()
        }
      })
    }
    // console.log('saveResult:', saveResult)
    setLoading(false)
    return true
  } else {
    // console.error('保存表单验证失败', validateResult, subFormTableValidError)
    return false
  }
};

/**
 *  检查配置是否正常
 *  用于设计时
 */
const checkConfig = () => {
  function checkFieldItem(inst: ComponentInstance) {
    for (let index in inst.children) {
      let subInst = inst.children[index]
      if (checkValidDataEntry(subInst.componentName)) {
        if (!subInst.props.bindField || !subInst.props.bindField.fieldName) {
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
// console.log('GLEntityForm > create > id', props.glComponentInst.id)

onMounted(() => {
  // console.log('GLEntityForm > onMounted() > id', props.glComponentInst.id)
})

loadForm()
defineExpose({submitForm})
</script>

<style>
.gl-entity-form {
  width: 100%;
}

/**
 * 在arco-drawer-body内，不显示提交按钮
 */
.arco-drawer-body .gl-entity-form .formSubmit, .arco-modal-body .gl-entity-form .formSubmit {
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
