<template>
  <div class="gl-component-param-setter">
    <div v-if="methodMeta?.params?.length === 0">
      <span style="margin-left: 1em">无参数</span>
    </div>
    <div v-else-if="methodMeta">
      <a-collapse :default-active-key="[1]" accordion>
        <a-collapse-item
            v-for="(paramMeta, index) in methodMeta.params"
            :key="index"
            style="width: 100%"
        >
          <template #header>
            <div style="display: flex">
              <div style="flex: auto">
                <span style="color: red" v-if="paramMeta.required" title="必需">*</span>
                <template v-if="methodMeta.isDynamicParams">
                  <input
                      class="gl-input-as-text-editor"
                      v-model="paramMeta.title"
                      @dblclick="startEdit"
                      @click="startEdit"
                      @change="()=>paramInsts[index].title = paramMeta.title"
                      title="参数标题，点击修改"
                  />
                  <input
                      class="gl-input-as-text-editor"
                      v-model="paramMeta.name"
                      @dblclick="startEdit"
                      @click="startEdit"
                      @change="()=>paramInsts[index].name = paramMeta.name"
                      title="参数名称，点击修改，必填"
                  />
                </template>
                <template v-else>
                  {{paramMeta.title}} {{paramMeta.name}}
                </template>
              </div>
              <div style="width: 120px; text-align: right">
                <a-tag color="blue"> {{ paramMeta.type }}</a-tag>
              </div>
              <div>
                <a-button type="text" @click="removeParamMeta(index)" size="mini" status="danger"
                >删除
                </a-button>
              </div>
            </div>
          </template>
          <GlExpressionSetter
              v-model="paramInsts[index].valueExpression"
              show-input
              placeholder="值"
          ></GlExpressionSetter>
          {{ paramMeta.description }}
        </a-collapse-item>
      </a-collapse>
    </div>
    <div>
      <a-button type="text" @click="addParamMeta" v-if="methodMeta.isDynamicParams">添加</a-button>
    </div>
  </div>
</template>
<script lang="ts">
/**
 *  组件方法的参数配置
 *  支持基于方法的参数元数据定义，进行固定参数配置
 *  支持方法中指定需动态配置参数时(isDynamicParams为true)，实现动态参数配置
 */
export default {
  name: 'GlComponentParamSetter'
}
</script>
<script lang="ts" setup>
import {inject, onUnmounted, type Ref, ref, watch} from 'vue'
import {ComponentSetterProvideKey, ComponentSetterProvideProxy} from '@geelato/gl-ide'
import {MethodMeta, ParamMeta} from '@geelato/gl-ui-schema'
import {type Param, utils} from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  /**
   *  参数数组
   */
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  /**
   *  dependVar*，是命名规范，便于看出需要依赖其它变量
   *  依赖于inject进来的componentSetterProvideProxy中的变量
   *  一般不需要配置，当在同一个ComponentSetter中有多个methodMeta时，需要明确依赖哪一个
   */
  dependVarMethodMeta: {
    type: String,
    default() {
      return 'methodMeta'
    }
  }
})

const paramInsts: Ref<Param[]> = ref([])
watch(
    paramInsts.value,
    () => {
      console.log('update:modelValue')
      emits('update:modelValue', paramInsts.value)
    },
    {deep: true}
)

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!

const methodMeta: Ref<MethodMeta> = ref(new MethodMeta())
const setData = (params: ParamMeta[]) => {
  try {
    // 以参数元数据为准
    params.forEach((paramMeta: ParamMeta) => {
      // 初始传入的值
      const foundParamInst: any = props.modelValue?.find((paramInst: any) => {
        return paramInst.name === paramMeta.name
      })
      if (!paramInsts.value.find((paramInst) => paramMeta.name === paramInst.name)) {
        paramInsts.value.push({
          name: paramMeta.name,
          value: undefined,
          valueExpression: foundParamInst?.valueExpression
        })
      }
    })
    // 对于支持动态参数的，在修改的场景中，需要以参数实例数据为准，动态生成元数据
    if (methodMeta.value?.isDynamicParams) {
      paramInsts.value.forEach((paramInst: Param) => {
        // 元数据中不存在，则添加
        if (!params.find((paramMeta) => paramInst.name === paramMeta.name)) {
          params.push({
            title: paramInst.name,
            name: paramInst.name,
            required: false,
            type: 'any'
          })
        }
      })
    }
  } catch (e) {
    console.error(e)
  }
}
const initData = () => {
  methodMeta.value =
      componentSetterProvideProxy.getVarValue(props.dependVarMethodMeta) || new MethodMeta()
  methodMeta.value.params = methodMeta.value.params || []
  setData(methodMeta.value.params)
}
const token = componentSetterProvideProxy.addVarValueChangeCallback(
    props.dependVarMethodMeta,
    initData
)
onUnmounted(() => {
  componentSetterProvideProxy.removeVarValueChangeCallback(token)
})

/**
 *  在动态参数的场景中，添加参数元数据，同步添加实例默认数据
 */
const addParamMeta = () => {
  let newParamMeta = {
    name: utils.gid('param', 8),
    title: utils.gid('参数', 5),
    type: 'any',
    required: true,
    description: ''
  }

  methodMeta.value.params = methodMeta.value.params || []
  if (methodMeta.value.params.find((paramMeta) => paramMeta.name === newParamMeta.name)) {
    // 存在同名参数
    return
  }
  methodMeta.value.params.push(newParamMeta)
  setData(methodMeta.value.params)
}

/**
 * 删除参数元数据，同步删除实例数据
 * @param index
 */
const removeParamMeta = (index: number) => {
  if (methodMeta.value) {
    methodMeta.value.params!.splice(index, 1)
    paramInsts.value.splice(index, 1)
  }
}
/**
 * 开始编辑，停止向上触发事件，避免触发父组件的折叠事件
 * @param e
 */
const startEdit = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
}
initData()
</script>

<style>
.gl-component-param-setter .arco-collapse-item-header-title {
  width: 100%;
}
.gl-component-param-setter .gl-input-as-text-editor {
  width: 5em;
  margin-right: 0.5em;
  border: 1px solid #d9d9d9;
  padding: 4px 2px;
}
</style>
