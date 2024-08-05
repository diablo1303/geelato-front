<template>
  <div class="gl-entity-form">
    <a-spin :loading="loading" tip="" style="width: 100%">
      <div v-if="showEmpty" style="background-color: white; padding: 2em 0">
        <a-empty></a-empty>
      </div>
      <template v-else>
        <a-form
          :key="formKey"
          ref="formRef"
          :model="formData"
          :layout="layout!"
          :autoLabelWidth="autoLabelWidth"
          :disabled="isRead && glIsRuntime"
        >
          <template v-if="glIsRuntime">
            <slot></slot>
          </template>
          <template v-else>
            <GlInsts :glComponentInst="glComponentInst"></GlInsts>
          </template>
        </a-form>
<!--        <div v-if="!isRead" class="formSubmit" style="text-align: center; padding: 2em 1em">-->
<!--          <a-button type="primary" @click="submitForm">保存</a-button>-->
<!--        </div>-->
      </template>
    </a-spin>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlEntityForm'
}

enum DataEmptyShowMode {
  // 没有数据时，仍显示表单组件，此为默认值
  SHOW_ALWAYS = 'SHOW_ALWAYS',
  // 没有数据时，不显示表单组件，显示“无数据”，但有数据时显示表单组件
  SHOW_EMPTY = 'SHOW_EMPTY'
}
</script>
<script lang="ts" setup>
/**
 *  表单组件
 *  有关表单id，如果在表单组件中，有字段组件显性地绑定了id字段，则id值以该组件值为准
 *  一般地，不需要有组件绑定id字段，在表单组件中默认会有id字段
 *
 *  表单复制
 *  如果页面传的参数为复制创建，即isPageStatusCopyCreate为true
 *  则基于复制的id（formParams.id的值）进行数据加载
 */
import {
  computed,
  inject, onBeforeUnmount,
  onMounted, onUnmounted,
  type PropType,
  provide,
  type Ref,
  ref,
  watch
} from 'vue'
import type { FormInstance } from '@arco-design/web-vue/es/form'
import useLoading from '../../hooks/loading'
import { isDataEntry } from '@geelato/gl-ui-schema-arco'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import {
  entityApi,
  mixins,
  useGlobal,
  PageProvideProxy,
  PageProvideKey,
  FormProvideKey,
  FormProvideProxy,
  EntitySaver,
  GetEntitySaversResult,
  emitter,
  SubmitFormResult,
  UiEventNames,
  utils
} from '@geelato/gl-ui'
import { getFormParams, type ValidatedError } from './GlEntityForm'
import { NO_BIND_FLAG } from '../../types/global'
import type { WorkflowPageTemplate } from '@geelato/gl-ui/src/components/PageProvideProxy'

const __id = utils.gid('__form')
console.log('GlEntityForm > init',__id)

// loadingData：从服务端加载数据，但未设置到表单中
// loadedData：从服务端加载完数据并设置到表单中
// creatingEntitySavers 完成实体保存对象创建之后（表单验证已通过），关闭创建方法前调用，例于对实体保存对象进行处理
const emits = defineEmits([
  'loadingData',
  'loadedData',
  'creatingEntitySavers',
  'createdEntitySavers'
])
const formProvideProxy = new FormProvideProxy()
provide(FormProvideKey, formProvideProxy)
const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const global = useGlobal()
const { loading, setLoading } = useLoading()
type LayoutType = 'inline' | 'horizontal' | 'vertical'

class FormItem {
  componentName: string = ''
  label: string = ''
  fieldName: string = ''
  value?: any
  isFormSubTable?: boolean = false
}

const props = defineProps({
  title: String,
  /**
   *  绑定实体对象
   *  {entityName:string}
   */
  bindEntity: {
    type: Object,
    required: true
  },
  /**
   *  表单参数
   *  表的的参数值来源，一般是从页面传参中获取
   *  如果在此处配置了值，则以此的值为准，该值将覆盖从页面传参中获取的值
   */
  // params: {
  //   type: Array as PropType<Array<Param>>,
  //   default() {
  //     return []
  //   }
  // },
  // 是否立即加载
  immediate: {
    type: Boolean,
    default() {
      return true
    }
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
  /**
   *  在表单为只读状态时，若未传相应的表单id，是否告警提醒
   *  默认为否，在开发调试阶段可以配置为true，便于及时发现问题（如漏了传表单id）
   */
  alarmWhenReadInRuntime: Boolean,
  /**
   *  表单没有数据时的显示模式
   */
  dataEmptyShowMode: {
    type: String as PropType<DataEmptyShowMode>,
    default() {
      return DataEmptyShowMode.SHOW_ALWAYS
    }
  },
  readonly: Boolean,
  disabled: Boolean,
  ...mixins.props
})

// 若参数有配置valueExpression，在开始就先计算表单参数值
// 在getFormParams之前执行
// if (props.params && props.params.length > 0) {
//   for (const index in props.params) {
//     const param: Param = props.params[index]
//     if (param.valueExpression) {
//       if (typeof param.valueExpression === 'string') {
//         param.value = jsScriptExecutor.evalExpression(param.valueExpression, {
//           pageProxy: pageProvideProxy
//         })
//       } else {
//         // 不需要解析
//         param.value = param.valueExpression
//       }
//     }
//   }
// }

const formKey = ref(utils.gid('formKey'))
const isRead = ref(!!pageProvideProxy?.isPageStatusRead() || props.readonly || props.disabled)
// 是否复制新增，如果是复制新增，则在打开页面加载数据时，用copyEntityRecordId加载
const isCopyCreate = ref(pageProvideProxy.isPageStatusCopyCreate())
// 通过默认通用关键字form获取的表单值，好处就是在配置打开页面传参时，不需要配置具体表单名，配置方便
// ！！！注意，该方式在同一页面多表单嵌套时，很可能会污染子级表单的值，没法做到精确控制表单传值
const formParams = getFormParams(pageProvideProxy, props.bindEntity)

// formData中可能有id也有可能没有id，视传的参数而定，记录id在entityRecordId中定义
const formData = ref<Record<string, any>>(JSON.parse(JSON.stringify(formParams)))

const setFormData = (key: string, value: any, src?: string) => {
  formData.value[key] = value
}

// 是否最近一次fetchData返回的数据为空，用于控制是否显示无数据提示，避免获取不到最新数据时表单展示旧的数据，引起用户困惑
const isLastFetchedDataEmpty = ref(true)

// 在运行时下状态下
const showEmpty = computed(() => {
  return (
    props.glIsRuntime &&
    props.dataEmptyShowMode === DataEmptyShowMode.SHOW_EMPTY &&
    isLastFetchedDataEmpty.value
  )
})

// id在此entityRecordId中记录
let entityRecordId: Ref<string> = ref(isCopyCreate.value ? '' : formParams.id)
let copyEntityRecordId: Ref<string> = ref(isCopyCreate.value ? formParams.id : '')
formProvideProxy.setRecordId(entityRecordId.value)

// 在表单组件中，显性的使用字段组件绑定id属性的场景，需要将组件中的id设置到entityRecordId中
watch(
  () => {
    return formData.value.id
  },
  () => {
    // 不是copy的场景，且设置了id值，则将id值设置到entityRecordId中
    if (!isCopyCreate.value && formData.value.id) {
      entityRecordId.value = formData.value.id
      formProvideProxy.setRecordId(entityRecordId.value)
    }
  }
)

const formItems: Ref<Array<FormItem>> = ref([])
const subFormInstIds: Ref<string[]> = ref([])
const formRef = ref<FormInstance>()

/**
 * 可以通过脚本编排实现组件的规则是否启用
 * 暂不需启用该功能，默认返回[]
 */
const getIgnoreValidateFieldsIfHidden = () => {
  return []
}
/**
 * 验证表单
 * 依据字段的配置，可以忽略部分字段的验证
 */
const validate = async (): Promise<undefined | Record<string, ValidatedError>> => {
  const validateResult = await formRef.value?.validate()
  if (validateResult) {
    getIgnoreValidateFieldsIfHidden().forEach((ignoreField: string) => {
      if (validateResult && validateResult[ignoreField]) {
        formRef.value?.clearValidate(ignoreField)
        delete validateResult[ignoreField]
      }
    })
    return Object.keys(validateResult).length > 0 ? validateResult : undefined
  } else {
    return undefined
  }
}

const checkValidDataEntry = (componentName: string) => {
  return (
    isDataEntry(componentName) &&
    componentName !== 'GlEntityTableSub' &&
    componentName !== 'GlEntityForm'
  )
}

// 传进来的参数是否包括了所有的字段值
// const isFormParamsContainAllFields = (items: FormItem[]) => {
//   console.log('传进来的参数是否包括了所有的字段值', items, formParams)
//   if (!formParams) return false
//   const paramNames = Object.keys(formParams)
//   let isContain = true
//   for (let key in items) {
//     const item = items[key]
//     const foundResult = paramNames.find((paramName: string) => {
//       return paramName === item.fieldName
//     })
//     if (!foundResult) {
//       isContain = false
//       break
//     }
//   }
//   console.log('传进来的参数是否包括了所有的字段值', isContain)
//   return isContain
// }
/**
 * 遍历构建表单数据项，设置值
 * 在初始化构建时，由于子表单不存在，不会调用子表单的构建方法，另外，各层级子表单组件在加载数据时，需自动加载各自的构建方法
 * 在保存构建时，需要调用子表单的构建方法buildFieldItems,设置各子表单项的值
 */
const buildFieldItems = () => {
  // console.log('buildFieldItems ', props.bindEntity.entityName)
  formItems.value.length = 0
  subFormInstIds.value.length = 0

  /**
   * @param inst 表单实例，也可以是子表单实例
   */
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
          global.$notification.error({ title: '组件未绑定', content: content })
          // console.error('GlEntityForm > ', content)
          continue
        }
        if (subInst.props.bindField?.fieldName === NO_BIND_FLAG) {
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
          setFormData(subInst.props.bindField.fieldName, subInst.value, 'buildFieldItem')
        }
        formItems.value.push(formItem)
      } else if (subInst.props?.base?.isFormSubTable) {
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

          // if ((value===null||value===undefined)&&subInst.value!==null&&subInst.value!==undefined){
          //   // 对于表单一些字段在修改状态时在出现的场景，此时字段的默认值也是需要出现的
          //   // 所以若加载的字段数据为null或undefined且表单已有默认值时，以表单已有的默认值为准
          //   console.log('set inst value by defaultValue:', subInst.componentName, subInst.props.label, subInst.id, subInst.value)
          //   // TODO 这里
          // }else{
          //
          // }

          // 注意！！ 由于AInputNumber的值不支持设置字符串，这里对可能的字符串值进行转换
          if (subInst.componentName === 'AInputNumber') {
            // @ts-ignore
            subInst.value = typeof value !== 'number' ? Number(value) : value
          } else {
            subInst.value = value
            // console.log('set inst value:', subInst.componentName, subInst.props.label, subInst.id, subInst.value)
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
            setFormData(subInst.props.bindField.fieldName, subInst.value, 'setFieldItemValue')
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

  // console.log('GlEntityForm > setFormItemValues() > formData:', formData.value)
  emits('loadedData', { data: formData.value })
}

/**
 *  加载表单数据
 *  @param params 加载表单数据的参数，如：{id:xxx};如果参数有值，则以参数为准，否则取当前表单的id进行查询。
 *  @param reRender 重新渲染表单，默认true,一般在组件外部在调用时，不需要设置该值，即需要重新渲染；在表单首次加载时，需要设置该值为false，避免重复渲染
 */
const fetchData = async (params?: { id: string; [key: string]: any }, reRender: boolean = true) => {
  let recordId
  if (utils.isEmpty(params)) {
    // 如果是复制创建，则基于复制的id进行数据加载
    recordId = isCopyCreate.value ? copyEntityRecordId.value : entityRecordId.value
  }

  if (!recordId && utils.isEmpty(params)) {
    // 1、没有id同时又没有参数，此时为新增状态，不需要从服务端获取
    if (isRead.value && props.glIsRuntime && props.alarmWhenReadInRuntime) {
      global.$notification.error({
        duration: 8000,
        title: '参数不全',
        content:
          '当前表单(' +
          props.bindEntity.entityName +
          ')为只读模式，但没有传递参数"form.id"或具体实体名点id“xxx.id”，请检查表单页面的打开事件配置中，是否已配置了参数，如参数名：form.id，值$ctx.record.id。',
        closable: true
      })
    }
    pageProvideProxy.addPageMountedEvent(() => {
      setFormItemValues(formData.value)
    })
    isLastFetchedDataEmpty.value = true
  } else {
    // 2、需要从服务端获取，可能是基于ID查询，也可能是基于参数检查
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
    if (!fieldNames.includes('id')) {
      fieldNames.unshift('id')
    }
    if (checkBindEntity()) {
      setLoading(true)
      // 表单实体查询参数
      let queryParams: { [key: string]: any } = {}
      if (params && typeof params === 'object') {
        for (let key in params) {
          if (params[key]) {
            queryParams[key] = params[key]
          }
        }
      }
      // 分页参数，默认第1页，每页1条
      queryParams['@p'] = '1,1'
      // 传入的查询参数中已有id值，则以该id值为准，如果没有id值，否则以当前表单的id为准
      if (!queryParams.id) {
        queryParams.id = recordId
      }
      // 删除id参数，避免查询参数为:id:""
      if (!queryParams.id) {
        delete queryParams.id
      }

      // console.log('GlEntityForm > fetchData() > queryParams:', queryParams)
      // console.log('GlEntityForm > fetchData() > glComponentInst.id:', props.glComponentInst.id)
      entityApi
        .query(
          props.bindEntity.entityName,
          fieldNames.join(','),
          queryParams.id
            ? {
                id: recordId,
                '@p': '1,1'
              }
            : queryParams,
          false,
          true,
          props.glComponentInst.id + utils.gid('x', 6)
        )
        .then((resp) => {
          const items = resp?.data

          if (items?.length > 0) {
            isLastFetchedDataEmpty.value = false
            console.log(
              'GlEntityForm >',
              props.bindEntity.entityName,
              '从服务端加载数据并设置到当前页面中，数据：',
              items[0]
            )
            // 对于初始不加载表单，通过fetchData({id:xxx})加载表单数据的，需要将加载完成的id设置到表单中
            entityRecordId.value = items[0].id
            formProvideProxy.setRecordId(items[0].id)
            emits('loadingData', { data: items[0] })
            delete items[0].id
            setFormItemValues(items[0])
          } else {
            isLastFetchedDataEmpty.value = true
            emits('loadingData', { data: {} })
          }
          // console.log('GlEntityForm > fetchData() > reRender:', reRender,'formData',formData.value)
          if(reRender){
            formKey.value = utils.gid('formKey')
          }
        })
        .catch((err) => {
          isLastFetchedDataEmpty.value = true
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
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
 * 创建基于元数据的实体保存MQL对象，递归创建子级表单（包括列表、表单形式）
 * 可被父表单调用，集到父表单一起保存
 * @param subFormPidValue 本表单中，指向父表单ID的字段值
 */
const createEntitySavers = (subFormPidValue: string): EntitySaver[] | null => {
  if (checkBindEntity()) {
    const entitySaver = new EntitySaver(props.bindEntity.entityName)
    entitySaver.id = props.glComponentInst.id
    // 先设置主表单部分，注意这里的formData有可能会有id值
    // 在copyCreate的场景，页面加载之后entityRecordId.value会变为空
    const record: Record<string, any> = { ...formData.value, id: entityRecordId.value }
    // 如果本表单作为另了个表单的子表单
    if (props.isSubForm) {
      entitySaver.pidName = props.subFormPidName
      record[props.subFormPidName!] = subFormPidValue
    }

    // 获取子表单值信息，并设置到保存表单中
    subFormInstIds.value.forEach((instId: string) => {
      const subCreateEntitySaver = pageProvideProxy.getMethod(instId, 'createEntitySavers')
      if (typeof subCreateEntitySaver === 'function') {
        const subEntitySavers: EntitySaver[] = subCreateEntitySaver(entityRecordId.value)
        if (subEntitySavers && typeof subEntitySavers === 'object') {
          entitySaver.children.push(...subEntitySavers)
        }
      }
    })
    entitySaver.record = record
    const entitySavers = [entitySaver]
    emits('creatingEntitySavers', entitySavers)
    return entitySavers
  }
  return null
}

const hasSubFormTable = () => {
  return subFormInstIds.value.length > 0
}

const getEntitySavers = async (): Promise<GetEntitySaversResult> => {
  // checkConfig()
  // 构建表单数据项，设置值
  buildFieldItems()
  // 再进一步进行表单数据项值校验
  const validateResult = await validate()
  // 验证子表单（Form表单、可编辑列表表单等），若存在则验证
  let subValidateResults = {}
  for (const instId of subFormInstIds.value) {
    const validateFn = pageProvideProxy.getMethod(instId, 'validate')
    if (typeof validateFn === 'function') {
      const subValidateResult = await validateFn()
      // console.log(
      //   'GlEntityForm > getEntitySavers() > subForm(' + instId + ') validate',
      //   subValidateResult
      // )
      if (subValidateResult) {
        Object.assign(subValidateResults, subValidateResult)
      }
    }
  }
  const result = new GetEntitySaversResult()
  result.id = props.glComponentInst.id
  result.componentName = props.glComponentInst.componentName
  result.validateResult = validateResult
  // 数据验证
  if (validateResult) {
    result.message = '验证表单' + props.bindEntity?.entityName + '不通过'
  } else if (Object.keys(subValidateResults).length > 0) {
    result.message = '验证表单' + props.glComponentInst.props.label + '的子表单不通过'
    result.validateResult = subValidateResults
  } else {
    // 获取savers对象
    const savers = createEntitySavers(entityRecordId.value)
    if (savers) {
      result.values = savers
      result.message = ''
      result.error = false
    } else {
      result.message = '表单配置验证失败，表单或字段未绑定。'
    }
  }
  return result
}

/**
 *  提交表单：构建表单项、校验、保存到服务端
 *  submitForm() --> saveForm()
 */
const submitForm = async () => {
  const submitFormResult: SubmitFormResult = new SubmitFormResult()
  submitFormResult.entity = props.bindEntity.entityName
  submitFormResult.id = props.glComponentInst.id
  submitFormResult.success = true

  const notification = (entitySaversResult:GetEntitySaversResult) => {
    const content: string[] = []
    Object.keys(entitySaversResult.validateResult!).forEach((key: string) => {
      // @ts-ignore
      const err = entitySaversResult.validateResult[key]
      content.push(err.label)
    })
    global.$notification.error({
      title: '以下内容验证不通过',
      content: `${content.join(',')}`
    })
    submitFormResult.success = false
  }

  // 1、如果页面模板中，有isReject属性，则表示为退回操作，不进行表单保存，只调用模板的保存方法
  if(pageProvideProxy.pageTemplate?.isReject===true){
    if (typeof pageProvideProxy.pageTemplate?.onBeforeSubmit === 'function') {
      let workflowEntitySaversResult = new GetEntitySaversResult()
      let workflowEntitySaver = new EntitySaver()
      workflowEntitySaver.entity = props.bindEntity?.entityName
      workflowEntitySaver.record = {id: entityRecordId.value}
      workflowEntitySaversResult.error = false
      workflowEntitySaversResult.values.push(workflowEntitySaver)
      // 传入entitySaversResult给页面模板，用于页面模板将需要保存的信息，合并在一起，最终在表单中一起保存
      pageProvideProxy.pageTemplate?.onBeforeSubmit({
        id: props.glComponentInst.id,
        data: workflowEntitySaversResult
      })
      if (workflowEntitySaversResult.error) {
        notification(workflowEntitySaversResult)
        return false
      }
      setLoading(true)
      return entityApi.saveEntity(workflowEntitySaversResult.values[0]).then(response => {
        setLoading(false)
      })
    }
    return true
  }
  // 2、不是工作流的回退场景，即普通表单保存场景或工作流正向提交场景
  const entitySaversResult: GetEntitySaversResult = await getEntitySavers()

  // console.log('submitForm > entitySaversResult', entitySaversResult)
  // 先对表单验证结果进行通知处理
  if (entitySaversResult.error) {
    notification(entitySaversResult)
    emitter.emit(UiEventNames.EntityForm.onSubmitted, submitFormResult)
    return false
  }

  // 是否需要createdEntitySaversEvent事件同步执行，用于需要在该事件中对提交的表单数据进行处理的场景
  // if(params.iscreatedEntitySaversEventSync){
  //   //
  // }

  const promise = new Promise((resolve, reject) => {
    emits('createdEntitySavers', {
      result: entitySaversResult,
      $resolve: resolve,
      $reject: reject
    })
  })
  return promise
    .then(() => {
      if (typeof pageProvideProxy.pageTemplate?.onBeforeSubmit === 'function') {
        // 传入entitySaversResult给页面模板，用于页面模板将需要保存的信息，合并在一起，最终在表单中一起保存
        pageProvideProxy.pageTemplate?.onBeforeSubmit({
          id: props.glComponentInst.id,
          data: entitySaversResult
        })
      }
      // createdEntitySavers 事件中，可能对entitySaversResult做了修改，如验证模板的
      if (entitySaversResult.error) {
        notification(entitySaversResult)
        emitter.emit(UiEventNames.EntityForm.onSubmitted, submitFormResult)
        return false
      } else {
        setLoading(true)
        // console.log('submitForm() > formData', formData)
        return entityApi
          .saveEntity(entitySaversResult.values[0])
          .then((saveResult) => {
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
            submitFormResult.success = true
            submitFormResult.record = entitySaversResult.values[0].record
            emitter.emit(UiEventNames.EntityForm.onSubmitted, submitFormResult)
            return true
          })
          .catch((err) => {
            console.error('submitForm catch: ', err)
            return false
          })
      }
    })
    .catch((err) => {
      console.error('submitForm catch: ', err)
      return false
    })
    .finally(() => {
      setLoading(false)
    })
}

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
          global.$notification.error(
            `组件[${subInst.componentName}],标题：${subInst.props.label},未绑定模型字段。`
          )
        }
      }
      if (subInst.children && subInst.children.length > 0) {
        checkFieldItem(subInst)
      }
    }
  }

  checkFieldItem(props.glComponentInst)
}

const getValue = () => {
  buildFieldItems()
  // 再进一步进行表单数据项值校验
  const validateResult = validate()
  if (!validateResult) {
    return { id: entityRecordId.value, ...formData.value }
  } else {
    return { id: entityRecordId.value }
  }
}

onMounted(() => {
  // console.log('GLEntityForm > onMounted() > id', props.glComponentInst.id)
})

const loadDataImmediate = () => {
  // console.log('props.immediate', props.immediate, props.bindEntity.entityName)
  return props.immediate !== false
}

/**
 *  默认在初始化时加载数据
 *  如果immediate为false，则不加载数据，以输传的数据列新表单
 */
if (loadDataImmediate()) {
  fetchData(undefined, false)
} else {
  setFormItemValues(formParams)
}

onUnmounted(async () => {
  console.log('GlEntityForm > onUnmounted',__id)
})

defineExpose({
  fetchData,
  submitForm,
  buildFieldItems,
  getEntitySavers,
  createEntitySavers,
  getValue,
  validate
})
</script>

<style>
.gl-entity-form {
  width: 100%;
}

/**
 * 在arco-drawer-body和arco-modal-body内，不显示提交按钮
 */
.arco-drawer-body .gl-entity-form .formSubmit,
.arco-modal-body .gl-entity-form .formSubmit {
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
