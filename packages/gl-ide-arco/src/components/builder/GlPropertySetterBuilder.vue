<template>
  <table class="gl-table">
    <tr>
      <td style="width: 9em;font-weight: bold;padding-left: 8px;line-height: 2em">
        属性基本信息
      </td>
      <td></td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" style="width: 9em" title="属性配置面板中分组展示">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        属性分组
      </td>
      <td class="gl-table-cell">
        <a-radio-group size="small" v-model="mv.group"
                       v-if="!mv.group?mv.group='base':true">
          <a-radio value="base">基础</a-radio>
          <a-radio value="view">外观</a-radio>
          <a-radio value="data">数据</a-radio>
        </a-radio-group>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="显示名称。显示在设计器中">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        属性名称
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.title"></a-input>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="该属性是否是插槽">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        属性类型
      </td>
      <td class="gl-table-cell">
        <a-radio-group size="small" v-model="mv.type"
                       v-if="!mv.type?mv.type='props':true">
          <a-radio value="props">普通属性</a-radio>
          <a-radio value="slots">插槽</a-radio>
          <a-radio value="children">子项</a-radio>
        </a-radio-group>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="若启用，则在属性的配置面板中，可以对该属性的值绑定变量">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        启用表达式
      </td>
      <td class="gl-table-cell">
        <template v-if="mv.enableValueExpress=(mv.enableValueExpress===true?true:false)"></template>
        <a-switch size="small" default="false" v-model="mv.enableValueExpress"></a-switch>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="">
        占位提示
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.placeholder" placeholder="placeholder"></a-input>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="">
        <!--<GlIconfont type="gl-info-circle"></GlIconfont>-->
        属性描述
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.description" placeholder="description"></a-input>
      </td>
    </tr>

    <tr>
      <td class="gl-table-cell gl-label" title="用于控制在设置面板中是否显示该属性，不显示时，常与默认值配合使用">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        是否显示
      </td>
      <td class="gl-table-cell">
        <template v-if="mv.show=(mv.show===false?false:true)"></template>
        <a-switch size="small" default="true" v-model="mv.show"></a-switch>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="font-weight: bold;padding-left: 8px;line-height: 2em">
        属性配置器设置
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="指定该属性采用什么组件进行配置">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        属性配置器
      </td>
      <td class="gl-table-cell">
        <a-select
            v-model="mv.setterComponentName"
            style="width: 100%"
            ref="select"
            title=""
            allow-search
        >
          <a-option v-if="hasNoSub" v-for="item in setterItems" :value="item.name" :title="item.name">{{ item.label }}-{{ item.name }}
          </a-option>
          <template v-else>
            <a-option v-if="mv.type==='children'" v-for="item in setterItemsForSubComponent"
                      :value="item.name" :title="item.name">{{ item.label }}-{{ item.name }}
            </a-option>
            <a-option v-else v-for="item in setterItemsForObject" :value="item.name">{{ item.label }}
            </a-option>
          </template>
        </a-select>
      </td>
    </tr>
    <tr v-if="hasNoSub&&mv.setterComponentName==='GlSubComponentSetting'">
      <td class="gl-table-cell gl-label" title="">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        子组件
      </td>
      <td class="gl-table-cell" v-if="mv.setterComponentProps = mv.setterComponentProps || {}">
        <table style="width: 100%">
          <tr>
            <td class="gl-table-cell gl-label" style="width: 20%" title="设置目标组件componentName">
              名称
            </td>
            <td class="gl-table-cell" style="width: 80%">
              <a-input v-model="mv.setterComponentProps.subComponentName"
                       placeholder="设置目标组件componentName"></a-input>
            </td>
          </tr>
          <tr>
            <td class="gl-table-cell gl-label" title="设置目标组件componentName">
              个数
            </td>
            <td class="gl-table-cell">
              <!--                  <a-radio-group size="small" v-model="mv.setterComponentProps.subComponentCount">-->
              <!--                    <a-radio value="one">一个</a-radio>-->
              <!--                    <a-radio value="many">多个</a-radio>-->
              <!--                  </a-radio-group>-->
              <a-input-number v-model="mv.setterComponentProps.subComponentCount" :min="0"
                              title="0表示多个，1表示1个，2表示2个，以此类推。"></a-input-number>
              &nbsp;0 表示不限
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr v-if="hasNoSub">
      <td class="gl-table-cell gl-label"
          title="该属性配置器的v-model名称，默认为“value”，对于Radio则为“checked”，即配置器自动进行如下值绑定v-model:checked，该值与属性配置器联动，自动填写">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        配置器v-model
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.setterComponentVModelName"
                 placeholder="默认值为modelValue，有些组件可能为checked（使用时v-model:checked）"></a-input>
      </td>
    </tr>
    <tr v-if="selectedSetterItem.propsSetter">
      <td class="gl-table-cell gl-label" title="配置该属性设置器组件的props">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        配置器Props
      </td>
      <td class="gl-table-cell">
        <component v-if="selectedSetterItem" :is="selectedSetterItem.propsSetter"
                   v-model="mv.setterComponentProps"></component>
      </td>
    </tr>
    <tr v-if="selectedSetterItem.slotComponentName">
      <td class="gl-table-cell gl-label" title="将该属性设置器组件的设置结果设置到该组件中，结合slot属性使用。">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        配置器Props
      </td>
      <td class="gl-table-cell">
        <component v-if="selectedSetterItem" :is="selectedSetterItem.propsSetter"
                   v-model="mv.setterComponentProps"></component>
      </td>
    </tr>
    <tr v-if="hasNoSub">
      <td class="gl-table-cell gl-label" title="属性名，即属性配置对象中的key">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        配置器默认值
      </td>
      <td class="gl-table-cell">
        <template v-if="mv.setterComponentProps">
          <a-switch size="small" v-if="defaultValueType==='Boolean'"
                    v-model="mv.setterDefaultValue"></a-switch>
          <a-input-number v-else-if="defaultValueType==='Number'"
                          v-model="mv.setterDefaultValue"></a-input-number>
          <a-input v-else v-model="mv.setterDefaultValue" placeholder="默认值"></a-input>
        </template>
      </td>
    </tr>
    <tr v-if="hasNoSub&&mv.type==='slots'">
      <td class="gl-table-cell gl-label"
          title="在运行时应用于该插槽的组件名称，属性配置器配置后的v-model值，需要适用于该插槽渲染组件">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        插槽渲染组件名
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.slotComponentName" placeholder=""></a-input>
      </td>
    </tr>
    <tr v-if="hasNoSub&&mv.type==='slots'">
      <td class="gl-table-cell gl-label" title="将配置该的结果绑定到槽渲染组件的v-model中还是v-bind中">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        属性值绑定目标
      </td>
      <td class="gl-table-cell">
        <template v-if="mv.slotComponentBindTarget = mv.slotComponentBindTarget || 'v-model'"></template>
        <a-switch v-model="mv.slotComponentBindTarget" checkedValue="v-bind" uncheckedValue="v-model">
          <template #checked>
            v-bind
          </template>
          <template #unchecked>
            v-model
          </template>
        </a-switch>
      </td>
    </tr>
    <tr v-if="hasNoSub&&mv.type==='slots'">
      <td class="gl-table-cell gl-label" title="将配置该的结果绑定到槽渲染组件的v-model:xxxName中还是v-bind:xxxName中">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        值绑定目标名称
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.slotComponentBindName" placeholder=""></a-input>
      </td>
    </tr>
    <template v-if="mv.type==='children'">
      <!-- 若属性为child，即该组件有子组件-->
      <tr>
        <td class="gl-table-cell gl-label" title="">
          子组件名称
        </td>
        <td class="gl-table-cell">
          <a-input v-model="mv.subComponentName"></a-input>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell gl-label" title="">
          子组件个数
        </td>
        <td class="gl-table-cell">
          <a-input-number v-model="mv.subComponentCount" :min="0"
                          title="0表示多个，1表示1个，2表示2个，以此类推。"></a-input-number>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell gl-label">
          属性
        </td>
        <td class="gl-table-cell">
          请在该属性的子属性中设置（左边的属性中设置）。
        </td>
      </tr>
    </template>
    <tr>
      <td class="gl-table-cell gl-label" title="该属性是否是插槽TODO??">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        是否显示配置器
      </td>
      <td class="gl-table-cell">
        <template v-if="mv.expanded=(mv.expanded===false?false:true)"></template>
        <a-switch size="small" v-model="mv.expanded"/>
      </td>
    </tr>
    <tr v-if="mv.setterComponentName==='GlObjectArraySetter'">
      <td class="gl-table-cell gl-label"
          title="在属性设置器中，若该属性为数组对象属性时，指定数组中对象的某一属性作为标题">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        标题字段名
      </td>
      <td class="gl-table-cell">
        <template v-if="mv.titleField=(mv.titleField===undefined?'':mv.titleField)"></template>
        <a-input size="small" v-model="mv.titleField"/>
      </td>
    </tr>
    <tr v-if="mv.setterComponentName==='GlObjectArraySetter'">
      <td class="gl-table-cell gl-label"
          title="在属性设置器中，若该属性为数组对象属性时，指定数组中对象的某一属性作为副标题">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        副标题字段名
      </td>
      <td class="gl-table-cell">
        <template v-if="mv.subTitleField=(mv.subTitleField===undefined?'':mv.subTitleField)"></template>
        <a-input size="small" v-model="mv.subTitleField"/>
      </td>
    </tr>
    <tr v-if="mv.setterComponentName==='GlObjectArraySetter'">
      <td class="gl-table-cell gl-label"
          title="设置了副标题字段名，但是在展示该字段名内容时，内容为空，是否需进行告警展示">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        无副标题告警
      </td>
      <td class="gl-table-cell">
        <template v-if="mv.alarmIfNoSubTitle=(mv.alarmIfNoSubTitle?mv.alarmIfNoSubTitle:'')"></template>
        <a-input size="small" v-model="mv.alarmIfNoSubTitle"/>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
export default {
  name: 'GlPropertySetterBuilder'
}
</script>
<script lang="ts" setup>
import {computed, onBeforeUpdate, reactive, ref, watch} from 'vue'
import {PropertySetterMetaImpl, PropertySetterSelectOption} from "@geelato/gl-ui-schema";
import {setterSelectOptions} from "./SetterSelectOptions";


// const builders = {
//   GlSimpleArrayBuilder
// }
// const getComponent = (name: string) => {
//   // @ts-ignore
//   return builders[name]
// }

const props = defineProps({
  modelValue: {
    type: PropertySetterMetaImpl,
    default() {
      return {
        setterComponentName: '',
        setterComponentProps: {}
      }
    }
  }
})
const emits = defineEmits(['updateSetter'])
// type 用于控制默认值的配置
const setterItems: Array<PropertySetterSelectOption> = setterSelectOptions
const setterItemsForObject = [
  {name: 'GlObjectArraySetter', label: '对象数组-[{}]'},
  {name: 'GlSimpleObjectSetter', label: '简单对象-{}'},
]

const setterItemsForSubComponent = [
  {name: 'GlSubComponentSetter', label: '组件设置'}
]
const vModelNameEditable = ref(true)
const defaultValueType = ref('')
const selectedSetterItem = ref(new PropertySetterSelectOption())
const mv = ref<PropertySetterMetaImpl>(new PropertySetterMetaImpl())
mv.value = props.modelValue
onBeforeUpdate(() => {
  mv.value = props.modelValue
})
/**
 *  属性是否有子属性
 *  若有子属性，则当前属性的一些配置项需去掉
 */
const hasNoSub = computed(() => {
  return !(props.modelValue.properties && props.modelValue.properties.length > 0)
})

// const findSetterItemByValue = (value: string)=> {
//     return setterItems.find((item) => {
//       return item.value === value
//     })
//   }

const setSetterItem = (componentName: String) => {
  let option = setterItems.find((item) => {
    if (componentName) {
      return item.name === componentName
    }
  })
  if (!mv.value.setterComponentProps) {
    mv.value.setterComponentProps = reactive({})
  }
  if (option) {
    selectedSetterItem.value = option
    mv.value.setterComponentVModelName = option.vModelName
    vModelNameEditable.value = true
    defaultValueType.value = option.type
  } else {
    selectedSetterItem.value = new PropertySetterSelectOption()
    mv.value.setterComponentVModelName = ''
    vModelNameEditable.value = true
  }
}

watch(mv, (val, oval) => {
  console.log('mv:', val, oval)
  setSetterItem(mv ? mv.value.setterComponentName : '')
  // this.$emit('update:modelValue', mv)
  emits('updateSetter', mv.value)
}, {immediate: true, deep: true})

</script>

<style scoped>

</style>
