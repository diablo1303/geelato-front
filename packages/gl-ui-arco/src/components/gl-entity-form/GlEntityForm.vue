<template>
  <div class="gl-entity-form" v-if="refreshFlag">
    <a-form ref="formRef" :model="formData" :layout="layout!"
            :autoLabelWidth="autoLabelWidth" :disabled="isRead&&glIsRuntime">
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
import {inject, onMounted, type PropType, provide, type Ref, ref} from 'vue';
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
  FormProvideProxy,
} from "@geelato/gl-ui";
import {type EntitySavingObject, getFormParams} from "./GlEntityForm";

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
  ...mixins.subFormProps,
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
// 通过默认通用关键字form获取的表单值，好处就是在配置打开页面传参时，不需要配置具体表单名，配置方便
// ！！！注意，该方式在同一页面多表单嵌套时，很可能会污染子级表单的值，没法做到精确控制表单传值
const formParams = getFormParams(pageProvideProxy, props.bindEntity)
// formData中不包括记录id，记录id在entityRecordId中定义
const formData = ref<Record<string, any>>(formParams);
// console.log('GlEntityForm[' + props.bindEntity?.entityName + '] > formData:', formData.value, 'formParams:', formParams)
let entityRecordId: Ref<string> = ref(formParams.id)
formProvideProxy.setRecordId(entityRecordId.value)

const formItems: Ref<Array<FormItem>> = ref([]);
const subFormInstIds: Ref<string[]> = ref([])
const formRef = ref<FormInstance>();

const checkValidDataEntry = (componentName: string) => {
  return isDataEntry(componentName) && componentName !== 'GlEntityTableSub' && componentName !== 'GlEntityForm'
}

/**
 * 遍历构建表单数据项，设置值
 * 在初始化构建时，由于子表单不存在，不会调用子表单的构建方法，另外，各层级子表单组件在加载数据时，需自动加载各自的构建方法
 * 在保存构建时，需要调用子表单的构建方法buildFieldItems,设置各子表单项的值
 */
const buildFieldItems = () => {
  // console.log('buildFieldItems ', props.bindEntity.entityName)
  formItems.value.length = 0
  subFormInstIds.value.length = 0

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
        // console.log('formItem', formItem)
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
        subFormInstIds.value.push(subInst.id)
      } else if (subInst.componentName === 'GlEntityForm') {
        // 处理从表信息，只有明确是子表的才算
        // 先记录，后续在其它方法中处理
        subFormInstIds.value.push(subInst.id)
      }
      // 构建子项
      if (subInst.children && subInst.children.length > 0) {
        if (subInst.componentName === 'GlEntityForm') {
          // ！！！由于是动态组件，子组件此时还可能未渲染完成，基于组件实例id获不到方法体
          const subBuildFieldItems = pageProvideProxy.getMethod(subInst.id, 'buildFieldItems')
          if (subBuildFieldItems) {
            subBuildFieldItems()
          }
        } else {
          // 嵌套的表单属性不计入主表单在，在子表单中build
          buildFieldItem(subInst)
        }
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
    console.error(title, props.glComponentInst)
    global.$notification.error({
      duration: 8000,
      title: title,
      content: '请在设计器中选择表单组件，右边的属性面板选择实体进行绑定。',
      closable: true
    })
    return false
  }
  // 检查字段

  return true
}


/**
 * 创建表格的实体保存GQL对象，递归创建子级表单（包括列表、表单形式）
 * 可被父表单调用，集到父表单一起保存
 * @param subFormPidValue 本表单中，指向父表单ID的字段值
 */
const createEntitySavingObject = (subFormPidValue: string): EntitySavingObject | null => {
  const parentIdFlag = '$parent.id'
  if (checkBindEntity()) {
    // 先设置主表单部分
    const entityKeyValues: Record<string, any> = {id: entityRecordId.value, ...formData.value}
    console.log(props.bindEntity.entityName, 'formData', formData.value)
    // 如果本表单作为另了个表单的子表单
    if (props.isSubForm) {
      entityKeyValues[props.subFormPidName!] = subFormPidValue || parentIdFlag
    }

    // 获取子表单值信息，并设置到保存表单中
    subFormInstIds.value.forEach((instId: string) => {
      const createEntitySavingObject = pageProvideProxy.getMethod(instId, 'createEntitySavingObject')
      if (typeof createEntitySavingObject === 'function') {
        const subEntitySavingObject: EntitySavingObject = createEntitySavingObject(entityRecordId.value || parentIdFlag)
        if (subEntitySavingObject) {
          const subEntityKey = '#' + subEntitySavingObject.key
          entityKeyValues[subEntityKey] = entityKeyValues[subEntityKey] || []
          entityKeyValues[subEntityKey].push(...subEntitySavingObject.value)
        }
      }
    })
    return {key: props.bindEntity.entityName, value: [entityKeyValues]}
  }
  return null
}

/**
 *  保存表单数据，将数据保存到服务端
 *  在submitForm方法内调用此方法
 */
const saveForm = async () => {
  const entitySavingObject = createEntitySavingObject(entityRecordId.value)
  if (entitySavingObject?.value) {
    return await entityApi.save(props.bindEntity.entityName, entitySavingObject?.value[0])
  }
}

const {loading, setLoading} = useLoading();
const hasSubFormTable = () => {
  return subFormInstIds.value.length > 0
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
  subFormInstIds.value.forEach((instId: string) => {
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
      subFormInstIds.value.forEach((instId: string) => {
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

const getValue = async () => {
  buildFieldItems()
  // 再进一步进行表单数据项值校验
  const validateResult = await formRef.value?.validate();
  if (!validateResult) {
    return {id: entityRecordId.value, ...formData.value}
  } else {
    return {id: entityRecordId.value}
  }
}

onMounted(() => {
  // console.log('GLEntityForm > onMounted() > id', props.glComponentInst.id)
})


loadForm()

defineExpose({submitForm, buildFieldItems, createEntitySavingObject, getValue})
</script>

<style>
.gl-entity-form {
  width: 100%;
}

/**
 * 在arco-drawer-body和arco-modal-body内，不显示提交按钮
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
