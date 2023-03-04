<template>
  <div>
    <div class="gl-table">
      <table class="gl-table">
        <tr>
          <td class="gl-table-cell gl-label" style="width: 8em">属性分组</td>
          <td class="gl-table-cell">
            <a-radio-group size="small" v-model="modelValue.group"
                           v-if="!modelValue.group?modelValue.group='base':true">
              <a-radio value="base">基础</a-radio>
              <a-radio value="view">外观</a-radio>
              <a-radio value="result">数据</a-radio>
            </a-radio-group>
          </td>
        </tr>
        <tr>
          <td class="gl-table-cell gl-label" style="width: 7em" title="显示名称。显示在设计器中">
            <GlIconfont type="gl-info-circle"></GlIconfont>
            名称（中文）
          </td>
          <td class="gl-table-cell">
            <a-input v-model="modelValue.title"></a-input>
          </td>
        </tr>
        <!--<tr>-->
        <!--<td class="gl-table-cell gl-label" style="width: 7em" title="属性名，即属性配置对象中的key">-->
        <!--<GlIconfont type="gl-info-circle"></GlIconfont>-->
        <!--属性名（英）-->
        <!--</td>-->
        <!--<td class="gl-table-cell">-->
        <!--<a-input v-model="modelValue.name" placeholder="属性名，即属性配置对象中的key"></a-input>-->
        <!--</td>-->
        <!--</tr>-->

        <tr v-if="hasNoSub">
          <td class="gl-table-cell gl-label" style="width: 7em" title="该属性是否是插槽">
            <GlIconfont type="gl-info-circle"></GlIconfont>
            类型
          </td>
          <td class="gl-table-cell">
            <a-radio-group size="small" v-model="modelValue.slot"
                           v-if="!modelValue.slot?modelValue.slot='property':true">
              <a-radio value="property">普通属性</a-radio>
              <a-radio value="slot">插槽</a-radio>
              <a-radio value="child">子项</a-radio>
            </a-radio-group>
          </td>
        </tr>
        <tr v-if="hasNoSub">
          <td class="gl-table-cell gl-label" style="width: 7em" title="用于控制在设置面板中是否显示该属性，不显示时，常与默认值配合使用">
            <GlIconfont type="gl-info-circle"></GlIconfont>
            是否需配置
          </td>
          <td class="gl-table-cell">
            <template v-if="modelValue.show=(modelValue.show===false?false:true)"></template>
            <a-switch default="true" v-model:checked="modelValue.show"></a-switch>
          </td>
        </tr>
        <tr>
          <td class="gl-table-cell gl-label" style="width: 7em" title="指定该属性采用什么组件进行配置">
            <GlIconfont type="gl-info-circle"></GlIconfont>
            属性配置器
          </td>
          <td class="gl-table-cell">
            <a-select
                v-model="modelValue.componentName"
                style="width: 180px"
                ref="select"
                title="指定该属性采用什么组件进行配置"
            >
              <a-option v-if="hasNoSub" v-for="item in selectedOptions" :value="item.name">{{ item.label }}
              </a-option>
              <a-option v-else v-for="item in selectedOptionsForObject" :value="item.name">{{ item.label }}
              </a-option>
            </a-select>
          </td>
        </tr>
        <tr v-if="hasNoSub&&modelValue.componentName==='GlSubComponentSetting'">
          <td class="gl-table-cell gl-label" style="width: 7em" title="指定该属性采用什么组件进行配置">
            <GlIconfont type="gl-info-circle"></GlIconfont>
            子组件
          </td>
          <td class="gl-table-cell" v-if="modelValue.props = modelValue.props || {}">
            <table style="width: 100%">
              <tr>
                <td class="gl-table-cell gl-label" style="width: 20%" title="设置目标组件componentName">
                  名称
                </td>
                <td class="gl-table-cell" style="width: 80%">
                  <a-input v-model="modelValue.props.subComponentName"
                           placeholder="设置目标组件componentName"></a-input>
                </td>
              </tr>
              <tr>
                <td class="gl-table-cell gl-label" title="设置目标组件componentName">
                  个数
                </td>
                <td class="gl-table-cell">
                  <!--                  <a-radio-group size="small" v-model="modelValue.props.subComponentCount">-->
                  <!--                    <a-radio value="one">一个</a-radio>-->
                  <!--                    <a-radio value="many">多个</a-radio>-->
                  <!--                  </a-radio-group>-->
                  <a-input-number v-model="modelValue.props.subComponentCount" :min="0"
                                  title="0表示多个，1表示1个，2表示2个，以此类推。"></a-input-number>
                  &nbsp;0 表示不限
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr v-if="hasNoSub">
          <td class="gl-table-cell gl-label" style="width: 7em"
              title="该属性配置器的v-model名称，默认为“value”，对于Radio则为“checked”，即配置器自动进行如下值绑定v-model:checked，该值与属性配置器联动，自动填写">
            <GlIconfont type="gl-info-circle"></GlIconfont>
            配置器的v-model名称
          </td>
          <td class="gl-table-cell">
            <a-input v-model="modelValue.vModelName" :disabled="!vModelNameEditable"
                     placeholder="默认为value，对于Radio则为checked，使用时v-model:checked"></a-input>
          </td>
        </tr>
        <tr v-if="hasNoSub">
          <td class="gl-table-cell gl-label" style="width: 7em" title="属性名，即属性配置对象中的key">
            <GlIconfont type="gl-info-circle"></GlIconfont>
            是否v-model
          </td>
          <td class="gl-table-cell">
            <a-switch v-model:checked="modelValue.isVModel"></a-switch>
          </td>
        </tr>


        <tr v-if="hasNoSub">
          <td class="gl-table-cell gl-label" style="width: 7em" title="属性名，即属性配置对象中的key">
            <GlIconfont type="gl-info-circle"></GlIconfont>
            默认值
          </td>
          <td class="gl-table-cell">
            <a-switch v-if="defaultValueType==='Boolean'" v-model:checked="modelValue.defaultValue"></a-switch>
            <a-input-number v-else-if="defaultValueType==='Number'"
                            v-model="modelValue.defaultValue"></a-input-number>
            <a-input v-else v-model="modelValue.defaultValue" placeholder="默认值"></a-input>
          </td>
        </tr>
        <tr v-if="hasNoSub&&selectedOption.dataSelect">
          <td class="gl-table-cell gl-label" style="width: 7em" title="指定该属性采用什么组件进行配置">
            <GlIconfont type="gl-info-circle"></GlIconfont>
            属性值可选项
          </td>
          <td class="gl-table-cell" v-if="modelValue.props = modelValue.props || {}">
            <span>模式：</span>
            <a-radio-group size="small" v-model="modelValue.props.mode">
              <a-radio value='SECRET_COMBOBOX_MODE_DO_NOT_USE'>单选</a-radio>
              <a-radio value="multiple">多选</a-radio>
              <a-radio value="tags">标签</a-radio>
            </a-radio-group>
            <span>&nbsp;&nbsp;可选项：</span>
            <GlOptions v-model="modelValue.result"
                                :columns="[{dataIndex: 'label'},{dataIndex: 'value'}]"></GlOptions>
          </td>
        </tr>
        <tr>
          <td class="gl-table-cell gl-label" style="width: 7em" title="">
            占位描述
          </td>
          <td class="gl-table-cell">
            <a-input v-model="modelValue.placeholder"></a-input>
          </td>
        </tr>
        <tr>
          <td class="gl-table-cell gl-label" style="width: 7em" title="">
            <!--<GlIconfont type="gl-info-circle"></GlIconfont>-->
            提示描述
          </td>
          <td class="gl-table-cell">
            <a-input v-model="modelValue.description"></a-input>
          </td>
        </tr>
        <!--        <template v-if="hasNoSub">-->
        <!--          &lt;!&ndash; 若属性为child，即该组件有子组件&ndash;&gt;-->
        <!--          <tr>-->
        <!--            <td class="gl-table-cell gl-label" style="width: 7em" title="">-->
        <!--              子组件名称-->
        <!--            </td>-->
        <!--            <td class="gl-table-cell">-->
        <!--              <a-input v-model="modelValue.subComponentName"></a-input>-->
        <!--            </td>-->
        <!--          </tr>-->
        <!--          <tr>-->
        <!--            <td class="gl-table-cell gl-label" style="width: 7em" title="">-->
        <!--              子组件个数-->
        <!--            </td>-->
        <!--            <td class="gl-table-cell">-->
        <!--              <a-input-number v-model="modelValue.subComponentCount" :min="0" title="0表示多个，1表示1个，2表示2个，以此类推。"></a-input-number>-->
        <!--            </td>-->
        <!--          </tr>-->
        <!--        </template>-->
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import GlOptions from "../setters/GlOptions.vue";

export default defineComponent({
  name: "SettingBuilder",
  components:{GlOptions},
  props: {
    modelValue: {
      type: Object,
      default() {
        return {
          props: {}
        }
      }
    }
  },
  data() {
    return {
      // type 用于控制默认值的配置
      selectedOptions: [
        {name: 'AInput', label: '单行文本', vModelName: 'value', type: 'String'},
        {name: 'AInputNumber', label: '数值', vModelName: 'value', type: 'Number'},
        {name: 'ASwitch', label: '开关(是/否)', vModelName: 'checked', type: 'Boolean'},
        {name: 'ASelect', label: '可选项', vModelName: 'value', dataSelect: true, type: 'String'},
        {name: 'GlIconfontSetting', label: '图标选择器', vModelName: 'modelValue', type: 'String'},
        {name: 'GlIconfontSettingForSlot', label: '图标选择器（用于插槽）', vModelName: 'modelValue', type: 'String'},
        {name: 'GlHtmlSettingForSlot', label: 'Html设置（用于插槽）', vModelName: 'modelValue', type: 'String'},
        {name: 'GlUserSelect', label: '用户选择器', vModelName: 'value', type: 'String'},
        {name: 'GlGroupSelect', label: '组织选择器', vModelName: 'value', type: 'String'},
        {name: 'GlJson', label: 'Json编辑器', vModelName: 'modelValue'},
        {name: 'GlColor', label: '颜色选择器（TODO）', vModelName: 'modelValue', type: 'String'},
        {name: 'GlStyle', label: '样式设置器（TODO）', vModelName: 'modelValue', type: 'String'},
        {name: 'GlSubComponentSetting', label: '组件设置', vModelName: 'modelValue', type: 'String'}
      ],
      selectedOptionsForObject: [
        {name: 'GlObjectArraySetter', label: '对象数组-[{}]'},
        {name: 'GlSimpleObjectSetter', label: '简单对象-{}'},
      ],
      vModelNameEditable: true,
      defaultValueType: '',
      selectedOption: {}
    }
  },
  mounted() {
  },
  computed: {
    /**
     *  属性是否有子属性
     *  若有子属性，则当前属性的一些配置项需去掉
     */
    hasNoSub() {
      return !(this.modelValue.properties && this.modelValue.properties.length > 0)
      // return this.modelValue.slot!=='child'
    }
  },
  watch: {
    'modelValue.componentName': {
      handler: function (val, oval) {
        console.log(val, oval)
        let option = this.selectedOptions.find((item) => {
          return item.name === val
        })
        if (option) {
          this.selectedOption = option
          this.modelValue.vModelName = option.vModelName
          this.vModelNameEditable = false
          this.defaultValueType = option.type
        } else {
          this.selectedOption = {}
          this.modelValue.vModelName = ''
          this.vModelNameEditable = true
        }
      },
      immediate: true
    }
    // modelValue: {
    //     handler: function (val, oval) {
    //         console.log(val, oval)
    //         this.update()
    //     },
    //     immediate: true
    // }
  },
  methods: {
    findSelectOptionByValue(value: string) {
      return this.selectedOptions.find((item) => {
        return item.value === value
      })
    },
    update() {
      // this.$emit('update:modelValue', this.modelValue)
    }
  }
})
</script>

<style scoped>

</style>
