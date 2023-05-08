<template>
  <div class="gl-component-register">
    <!--:push-other-panes="false"-->
    <splitpanes class="default-theme gl-bg-white" style="height:750px;background-color:#FFF">
      <pane :size="paneSize.A" style="padding-right: 0.2em;overflow-y: auto">
        <div class="gl-title">
          <span>
            <GlIconfont type="gl-info-circle"></GlIconfont>
          组件基本信息
          </span>
        </div>
        <div>
          <table class="gl-table" style="font-weight: normal">
            <tr>
              <td class="gl-table-cell gl-label" style="width: 6em">分组</td>
              <td class="gl-table-cell">
                <a-select v-model="cMeta.group" style="width: 100%">
                  <a-option value="general">通用</a-option>
                  <a-option value="layout">布局</a-option>
                  <a-option value="navigation">导航</a-option>
                  <a-option value="dataEntry">数据输入</a-option>
                  <a-option value="dataDisplay">数据展示</a-option>
                  <a-option value="feedback">反馈</a-option>
                  <a-option value="other">其它</a-option>
                </a-select>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label">标题</td>
              <td class="gl-table-cell">
                <a-input v-model="cMeta.title" placeholder="title"/>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label">名称</td>
              <td class="gl-table-cell">
                <a-input v-model="cMeta.componentName" placeholder="组件名，如:AInput"
                         title="componentName"/>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label" title="用于作为id的前缀">图标</td>
              <td class="gl-table-cell">
                <a-input v-model="cMeta.iconType" placeholder="alias"/>
              </td>
            </tr>
<!--            <tr>-->
<!--              <td class="gl-table-cell gl-label" title="进属性进行打包">包名</td>-->
<!--              <td class="gl-table-cell">-->
<!--                <a-input v-model="cMeta.propsWrapper"/>-->
<!--              </td>-->
<!--            </tr>-->
            <tr>
              <td class="gl-table-cell gl-label" title="作为命令块组件(CommandBlockComponent)时，显示的内容，如：打开第三方页面，页面地址为：${url}">命令内容</td>
              <td class="gl-table-cell">
                <a-input v-model="cMeta.blockContent"/>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label" title="组件设置器面板的显示模式">面板模式</td>
              <td class="gl-table-cell">
                <template v-if="cMeta.displayMode=cMeta.displayMode||'Tile'"></template>
                <a-radio-group size="small" v-model="cMeta.displayMode" type="button">
                  <a-radio value="collapse">折叠</a-radio>
                  <a-radio value="tile">平铺</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label">适用舞台</td>
              <td class="gl-table-cell">
                <a-select
                    v-model="cMeta.useBy"
                    multiple
                    style="width: 100%"
                    placeholder="请选择"
                    :options="[{label:'自由页面',value:'freePage'},{label:'表单页面',value:'formPage'},{label:'列表页面',value:'listPage'},{label:'脚本页面',value:'scriptPage'}]"
                ></a-select>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label">舞台显示</td>
              <td class="gl-table-cell">
                <a-select
                    v-model="cMeta.displayOnStage"
                    style="width: 100%"
                    placeholder="请选择"
                    :options="[{label:'inline-block',value:'inline-block'},{label:'block',value:'block'}]"
                ></a-select>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label" title="用于生成组件id时，作为id的前缀">别名</td>
              <td class="gl-table-cell">
                <a-input v-model="cMeta.alias" placeholder="alias"/>
              </td>
            </tr>
          </table>
        </div>
        <div class="gl-title">
          <span>
            <GlIconfont type="gl-unorderedlist"></GlIconfont>
          组件属性(Properties)
          </span>
        </div>
        <div>
          <GlOptions v-model="cMeta.properties" :columns="[{dataIndex: 'name',title:'属性名'}]" :allowAddSub="true"
                     @selectedElement="selectProperty"></GlOptions>
        </div>
        <!--<div class="gl-title">-->
        <!--<span>-->
        <!--<GlIconfont type="gl-unorderedlist"></GlIconfont>-->
        <!--组件【子组件】元数据-->
        <!--</span>-->
        <!--</div>-->
        <!--<div>-->
        <!--<GlOptions v-model="cMeta.children" :columns="[{dataIndex: 'name'}]"-->
        <!--@selectedElement="selectChild"></GlOptions>-->
        <!--</div>-->
        <div class="gl-title">
          <span>
            <GlIconfont type="gl-thunderbolt"></GlIconfont>
          组件事件（Actions）
          </span>
        </div>
        <div>
          <GlOptions v-model="cMeta.actions" :columns="[{dataIndex: 'name'}]"
                     @selectedElement="selectAction"></GlOptions>
        </div>
      </pane>
      <!--
       ========================================================================================
       -->
      <pane :size="paneSize.B" style="overflow-y: auto">
        <template v-if="currentSetterTarget === setterTarget.props">
          <div class="gl-title">
              <span>
                <GlIconfont type="gl-setting"/>
              组件属性设置 (当前属性：{{ (currentProperty.name || '未设置') }})
              </span>
          </div>
          <GlPropertySetterBuilder v-model:modelValue="currentProperty"
                                   @updateSetter="updateGlPropertySetter"></GlPropertySetterBuilder>
        </template>
        <template v-else-if="currentSetterTarget===setterTarget.actions">
          <div class="gl-title">
              <span>
                <GlIconfont type="gl-setting"/>
              组件动作设置 (当前动作：{{ (currentAction.name || '未设置') }})
              </span>
          </div>
          <GlActionSetterBuilder v-model:modelValue="currentAction"
                                 @updateSetter="updateGlActionSetter"></GlActionSetterBuilder>
        </template>
        <template v-else>
          <div style="text-align: center;padding: 2em;background-color: #fafafa">请先从左边面板添加属性或事件动作</div>
        </template>
      </pane>
      <!--
      =======================================生成的组件元数据JSON及设置器Preview=================================================
      -->
      <pane :size="100-paneSize.A-paneSize.B" style="overflow-y: auto">
        <!--        <div class="gl-title">-->
        <!--          <span>-->
        <!--             <GlIconfont type="gl-eye"/>-->
        <!--          生成属性设置面板预览（{{ cMeta.componentName || '未设置' }}）-->
        <!--          </span>-->
        <!--        </div>-->
        <!--        <GlSettingProperty :componentMeta="cMeta" v-model:propertyInstance="cInstance.props"-->
        <!--                           v-model:slotsInstance="cInstance.slots"-->
        <!--                           v-model:childrenInstance="cInstance.children"></GlSettingProperty>-->
        <table>
          <tr>
            <td style="height:695px;width:1em;padding-top:1em;writing-mode:vertical-lr;background-color: #c6e2ff;font-weight: bold;border-left:solid 4px #0467c2">
              生成的组件元数据JSON及设置器Preview
            </td>
            <td style="vertical-align: top">
              <a-tabs>
                <a-tab-pane key="1">
                  <template #title>
              <span class="gl-title">
                <GlIconfont type="gl-json"/>
              生成组件设置器JSON
              </span>
                  </template>
                  <div style="background-color: #fafafa;padding: 0 0.5em;min-height: 4em">
                    <a-button type="" shape="round" size="small" style="float: right" @click="copyJson(cMeta)">复制
                    </a-button>
                    <VueJsonPretty v-if="refreshFlag" :data="cMeta"></VueJsonPretty>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="2">
                  <template #title>
            <span class="gl-title">
                <GlIconfont type="gl-eye"/>
              生成组件设置器UI
            </span>
                  </template>
                  <GlComponentSetter :componentMeta="cMeta" :componentInstance="cInstance"
                                     @update="(val:any)=>{setInstance(val)}"/>
                  <!--                  <GlComponentPropertiesSetter :componentMeta="cMeta" :componentInstance="cInstance"-->
                  <!--                                     @update="(val)=>{setInstance(val)}">-->

                  <!--                  </GlComponentPropertiesSetter>-->
                </a-tab-pane>
                <a-tab-pane key="3">
                  <template #title>
                    <span class="gl-title">
                        <GlIconfont type="gl-json"/>
                      生成组件默认实例JSON
                    </span>
                  </template>
                  <a-button type="" shape="round" size="small" style="float: right" @click="copyJson(cInstance)">复制
                  </a-button>
                  <VueJsonPretty v-if="refreshFlag" :data="cInstance"></VueJsonPretty>
                </a-tab-pane>
              </a-tabs>
            </td>
          </tr>
        </table>

      </pane>
      <!--
      ========================================================================================
      -->
      <!--      <pane :size="100-paneSize.A-paneSize.B-paneSize.C">-->
      <!--        <template v-if="refreshFlag">-->
      <!--          <splitpanes horizontal class="default-theme gl-bg-white" style="background-color:#FFF">-->
      <!--            <pane size="80">-->
      <!--              <div class="gl-title">-->
      <!--              <span>-->
      <!--                 <GlIconfont type="gl-eye"/>-->
      <!--              生成组件实例预览（{{ cMeta.componentName || '未设置' }}）-->
      <!--              </span>-->
      <!--                <a-button-group>-->
      <!--                  <a-button style="float: right" @click="refreshInstance">刷新</a-button>-->
      <!--                  <a-button @click="previewEnable=!previewEnable;refreshInstance()">{{-->
      <!--                      previewEnable ? '关闭预览' : '启用预览'-->
      <!--                    }}-->
      <!--                  </a-button>-->
      <!--                </a-button-group>-->
      <!--              </div>-->
      <!--              <div v-if="previewEnable">-->
      <!--                <template v-if="cInstance.id&&cInstance.componentName">-->
      <!--                  <gl-component :glComponentInst="cInstance">-->
      <!--                  </gl-component>-->
      <!--                </template>-->
      <!--              </div>-->
      <!--            </pane>-->
      <!--            <pane size="20" v-if="previewEnable">-->
      <!--              <div class="gl-title">-->
      <!--              <span>-->
      <!--                <GlIconfont type="gl-json"/>-->
      <!--              生成组件实例代码-->
      <!--              </span>-->
      <!--              </div>-->
      <!--              <div style="background-color: #fafafa;padding: 0 0.5em;min-height: 4em">-->
      <!--                {{ cInstance }}-->
      <!--              </div>-->
      <!--            </pane>-->
      <!--          </splitpanes>-->
      <!--        </template>-->
      <!--      </pane>-->
    </splitpanes>
  </div>
</template>

<script lang="ts">
import {utils} from "@geelato/gl-ui";
import {Splitpanes, Pane} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import {defineComponent, nextTick, type PropType} from 'vue'
import GlPropertySetterBuilder from './props-builder/GlPropertySetterBuilder.vue'
import GlActionSetterBuilder from "./actions-builder/GlActionSetterBuilder.vue";
import GlOptions from "../setters/GlOptions.vue";
import ClipboardJS from "clipboard";
import VueJsonPretty from 'vue-json-pretty'
import {ComponentMeta} from "@geelato/gl-ui-schema";
import {ComponentInstance, PropertySetterMetaImpl} from "@geelato/gl-ui-schema";
import {ActionSetterMeta} from "@geelato/gl-ui-schema/src/entity/actions/ActionSetterMeta";

enum SetterTarget {
  actions = 'actions',
  props = 'props',
  none = 'none'
}

export default defineComponent({
  name: "GlComponentBuilder",
  components: {GlPropertySetterBuilder, GlActionSetterBuilder, Splitpanes, Pane, GlOptions, VueJsonPretty},
  props: {
    modelValue: {
      type: Object,
      default() {
        return {
          runtimeMeta: {
            // title: '',
            // componentName: '',
            // alias: '',
            // properties: []
          },
          designMeta: {}
        }
      }
    },
    componentMeta: {
      type: Object as PropType<ComponentMeta>,
      default() {
        return new ComponentMeta()
      }
    },
    componentInstance: {
      type: Object as PropType<ComponentInstance>,
      default() {
        return new ComponentInstance()
      }
    },
    // create update
    action: String
  },
  data() {
    return {
      setterTarget: SetterTarget,
      previewEnable: false,
      currentSetterTarget: SetterTarget.none,
      currentProperty: new PropertySetterMetaImpl(),
      currentIndex: -1,
      currentAction: new ActionSetterMeta(),
      currentActionIndex: -1,
      paneSize: {
        A: 18,
        B: 35
      },
      // componentInstance: this.modelValue.runtimeMetaruntimeMeta || ,
      cMeta: this.componentMeta || new ComponentMeta(),
      cInstance: this.componentInstance,
      // 该属性需配置的面板
      // panels: []
      refreshFlag: true
    }
  },
  watch: {
    'cMeta.componentName': {
      handler: function (val, oval) {
        this.cInstance.componentName = val
        this.emitUpdate()
      },
      immediate: true
    },
    'cMeta.alias': {
      handler: function (val, oval) {
        this.cInstance.id = this.modelValue.runtimeMeta.id || utils.gid(val)
        // this.cInstance.templateId = this.modelValue.runtimeMeta.templateId || utils.gid(val)
        this.emitUpdate()
      },
      immediate: true
    },
    'cMeta.title': {
      handler: function (val, oval) {
        this.cInstance.title = val
        this.emitUpdate()
      },
      immediate: true
    },
    'cMeta.group': {
      handler: function (val, oval) {
        // TODO cInstance需要group属性？
        // this.cInstance.group = val
        this.emitUpdate()
      },
      immediate: true
    },
    'cMeta.propsWrapper': {
      handler: function (val, oval) {
        this.cInstance.propsWrapper = val
        this.emitUpdate()
      },
      immediate: true
    },
    'cMeta.useBy': {
      handler: function (val, oval) {
        // TODO cInstance需要useBy属性？
        // this.cInstance.useBy = val
        this.emitUpdate()
      },
      immediate: true
    }
  },
  created() {
    // this.cInstance.id = this.modelValue.runtimeMeta.id
    // this.cInstance.templateId = this.modelValue.runtimeMeta.templateId
    this.cInstance = this.componentInstance
    this.refreshInstance()
  },
  mounted() {
  },
  methods: {
    addProperty() {
      this.currentProperty = new PropertySetterMetaImpl()
      // @ts-ignore
      this.cMeta.properties.push(this.currentProperty)
      // @ts-ignore
      this.currentIndex = this.cMeta.properties.length - 1
      this.emitUpdate()
    },
    selectProperty({element, index}: { element: any, index: number }) {
      this.currentSetterTarget = SetterTarget.props
      this.currentProperty = element
      this.currentIndex = index
      if (this.currentIndex === -1) {
        this.currentProperty = new PropertySetterMetaImpl()
      }
    },
    selectAction({element, index}: { element: any, index: number }) {
      this.currentSetterTarget = SetterTarget.actions
      this.currentAction = element
      this.currentActionIndex = index
      if (this.currentActionIndex === -1) {
        this.currentAction = new ActionSetterMeta()
      }
    },
    selectChild() {

    },
    emitUpdate() {
      this.$emit('update:modelValue', {runtimeMeta: this.cInstance, designMeta: this.cMeta})
    },
    refreshInstance() {
      let that = this
      this.refreshFlag = false
      nextTick(function () {
        that.refreshFlag = true
      })
    },
    getInstance(propertyName: string) {
      // for (let key in this.demoProps as LooseObject) {
      //   if (key === propertyName) {
      //     let kv = new LooseObject()
      //     kv[propertyName] = this.demoProps[key]
      //     return kv
      //   }
      // }
    },
    setInstance(instance: ComponentInstance) {
      let that = this
      // console.log('set instance:', instance,this.cInstance)
      this.cInstance = instance
      this.refreshInstance()
    },
    updateGlPropertySetter(mv: any) {
      console.log('updateGlPropertySetter>', mv)
      this.refreshInstance()
    },
    updateGlActionSetter(mv: any) {
      console.log('updateGlActionSetter>', mv)
      this.refreshInstance()
    },
    copyJson(json?: ComponentMeta | ComponentInstance) {
      if (!json) return
      ClipboardJS.copy(JSON.stringify(json))
    }
  }
})
</script>

<style>

.gl-component-register .gl-title {
  margin: 1em 0em;
  font-weight: bold;
}

.gl-component-register-property-item {
  width: 100%;
  text-align: center;
  padding: 0;
  border-top: 0px;
  /*border-right: 1px solid #178df7;*/
  /*border-bottom: 1px solid #178df7;*/
  /*border-left: 1px solid #178df7;*/
  background-color: #eeeeee;
  margin: 0.5em 0 2px;
}

.gl-component-register-property-item.gl-selected {
  box-shadow: 0 0 0 2px #178df7;
}

.gl-component-register-property-item > input {
  background-color: #eeeeee;
}

.gl-component-register-property-item.gl-first {
  /*border-top: 1px solid #178df7;*/
}

.splitpanes.gl-bg-white .splitpanes__pane {
  background-color: #FFF;
}
</style>
