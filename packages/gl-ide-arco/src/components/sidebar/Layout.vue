<template>
  <div class="gl-ide-layout-sidebar">
    <!--:style="{width:`${layout.width-30}px`}"-->
    <!--<a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>-->
    <a-button block v-if="!isComponentManagerMode" @click="isComponentManagerMode=true">切换至组件管理模式</a-button>
    <a-button v-if="isComponentManagerMode" @click="isComponentManagerMode=false">
      <RollbackOutlined/>
      返回
    </a-button>
    <a-button v-if="isComponentManagerMode" @click="onExportMeta" title="导出组件元数据信息">
      <ExportOutlined/>
      导出
    </a-button>
    <!--    <a-button v-if="isComponentManagerMode" @click="onImportMeta" >导入</a-button>-->
    <a-upload v-if="isComponentManagerMode" :file-list="fileList" :before-upload="onImportMeta">
      <a-button title="导入组件元数据信息">
        <upload-outlined/>
        导入
      </a-button>
    </a-upload>
    <div class="gl-title">
      <LayoutOutlined></LayoutOutlined>
      栅格（放置容器或组件）
      <a v-if="isComponentManagerMode" @click="componentMetaRegist(element,'layout')"
         style="float:right;cursor: pointer;font-weight: normal">
        <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;注册
      </a>
    </div>
    <gl-draggable
        v-model="layoutItems"
        handle=".gl-dnd-item-template-handle"
        :group="{ name: 'layoutItems', pull: 'clone', put: false }"
        ghostClass="ghost"
        :sort="false"
        @start="drag=true"
        @end="drag=false"
        @change="onChange"
        @choose="($event)=>onChoose($event,layoutItems)"
        :clone="($event)=>clone($event,layoutItems)"
        itemKey="id"
    >
      <template #item="{element}">
        <div class="gl-dnd-item-template" :class="{'gl-dnd-item-template-handle':!isComponentManagerMode}"
             v-if="isComponentManagerMode||element.draggable!=='false'">
          <div @mousedown="startNodeDrag($event,element)">{{ element.title }}</div>
          <div v-if="isComponentManagerMode" class="gl-dnd-item-template-toolbar">
            <EditOutlined @click="componentMetaEdit(element)"/>&nbsp;
            <a-popconfirm
                title="您确定要删除该组件？"
                ok-text="是"
                cancel-text="否"
                @confirm="componentMetaRemove(element)"
            >
              <DeleteOutlined/>
            </a-popconfirm>
          </div>
        </div>
      </template>
    </gl-draggable>

    <div class="gl-title">
      <FormOutlined/>
      表单组件
      <a v-if="isComponentManagerMode" @click="componentMetaRegist(element,'form')"
         style="float:right;cursor: pointer;font-weight: normal">
        <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;注册
      </a>
    </div>
    <gl-draggable
        v-model="formItems"
        handle=".gl-dnd-item-template-handle"
        :group="{ name: 'layoutItems', pull: 'clone', put: false }"
        ghostClass="ghost"
        :sort="false"
        @start="drag=true"
        @end="drag=false"
        @change="onChange"
        @choose="($event)=>onChoose($event,formItems)"
        :clone="($event)=>clone($event,formItems)"
        itemKey="id"
    >
      <template #item="{element}">
        <div class="gl-dnd-item-template" :class="{'gl-dnd-item-template-handle':!isComponentManagerMode}">
          <div @mousedown="startNodeDrag($event,element)">{{ element.title }}</div>
          <div v-if="isComponentManagerMode" class="gl-dnd-item-template-toolbar">
            <EditOutlined @click="componentMetaEdit(element)"/>
            <a-popconfirm
                title="您确定要删除该组件？"
                ok-text="是"
                cancel-text="否"
                @confirm="componentMetaRemove(element)"
            >
              <DeleteOutlined/>
            </a-popconfirm>
          </div>
        </div>
      </template>
    </gl-draggable>

    <div class="gl-title">
      <span>
        <BuildOutlined/>
      其它组件
      </span>
      <a v-if="isComponentManagerMode" @click="componentMetaRegist(element,'other')"
         style="float:right;cursor: pointer;font-weight: normal">
        <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;注册
      </a>
    </div>
    <gl-draggable
        v-model="otherItems"
        handle=".gl-dnd-item-template-handle"
        :group="{ name: 'layoutItems', pull: 'clone', put: false }"
        ghostClass="ghost"
        :sort="false"
        @start="drag=true"
        @end="drag=false"
        @change="onChange"
        @choose="($event)=>onChoose($event,otherItems)"
        :clone="($event)=>clone($event,otherItems)"
        itemKey="id"
    >
      <template #item="{element}">
        <div class="gl-dnd-item-template" :class="{'gl-dnd-item-template-handle':!isComponentManagerMode}">
          <div @mousedown="startNodeDrag($event,element)">{{ element.title }}</div>
          <div v-if="isComponentManagerMode" class="gl-dnd-item-template-toolbar">
            <EditOutlined @click="componentMetaEdit(element)"/>
            <a-popconfirm
                title="您确定要删除该组件？"
                ok-text="是"
                cancel-text="否"
                @confirm="componentMetaRemove(element)"
            >
              <DeleteOutlined/>
            </a-popconfirm>
          </div>
        </div>
      </template>
    </gl-draggable>
    <a-modal v-model:visible="componentMetaRegisterVisible" :destroyOnClose="true" v-if="componentMetaRegisterVisible"
             title="注册组件"
             class="gl-component-register-modal" style="min-width: 98%;top: 20px">
      <component-register v-model="currentComponentMeta" :action="componentMetaAction"></component-register>
      <template #footer>
        <div style="text-align: center">
          <a-button key="back" type="danger" @click="componentMetaRemove">删除</a-button>
          <a-button key="submit" type="primary" @click="onComponentMetaRegiste">保存</a-button>
          <a-button key="submit" @click="onComponentMetaCopy">复制（TODO）</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">

import ComponentRegister from '../builder/ComponentRegister.vue'
import {ref} from "vue";
import {LooseObject, useCurrentInstance, utils} from "@geelato/gl-ui";

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  preview?: string;
  originFileObj?: any;
  file: string | Blob;
}

export default {
  name: "GlIdePluginCorePanelLayout",
  components: {ComponentRegister},
  data(): any {
    return {
      isComponentManagerMode: false,
      chooseIndex: 0,
      gutter: 8,
      layoutItems: [],
      formItems: [],
      otherItems: [],
      items: this.$ide.componentMetaManager.runtimeMeta,
      chooseContainerIndex: 0,
      containers: [
        {
          title: '自由布局容器',
          activeKey: 0,
          type: 'Flow',
          items: [{title: 'Flow1', items: []}, {title: 'Flow2', items: []}],
          slots: [],
          opts: {}
        }, {
          title: '标签容器',
          activeKey: 0,
          type: 'Tabs',
          items: [{title: 'tab1', items: []}, {title: 'tab2', items: []}],
          slots: [],
          opts: {tabPosition: 'top', type: 'line', size: 'default'}
        }, {
          title: '折叠容器',
          activeKey: 0,
          type: 'Collapse',
          items: [{title: 'panel1', items: []}, {title: 'panel2', items: []}],
          slots: [],
          opts: {}
        }],
      componentMetaRegisterVisible: false,
      // 本地存储
      ls: localStorage,
      // 当前选中的组件元数据
      currentComponentMeta: undefined,
      // 组件元数据操作，是新增，还是修改
      componentMetaAction: 'create',
      fileList: ref<FileItem[]>([])
    }
  },
  created() {
    for (let i = 0; i < this.ls.length; i++) {
      let key = this.ls.key(i)
      let item = this.ls.getItem(key)
      if (key.startsWith('GlRuntimeMeta.')) {
        this.$ide.componentMetaManager.registerOneComponentRuntimeMeta(JSON.parse(item))
      } else if (key.startsWith('GlDesignMeta.')) {
        this.$ide.componentMetaManager.registerOneComponentDesignMeta(JSON.parse(item))
      }
      console.log('key:', key);
    }
    this.resetItems()
  },
  methods: {
    /**
     *  重置组件分组
     */
    resetItems() {
      this.layoutItems = this.$ide.componentMetaManager.runtimeMeta.filter((item) => {
        return item.group === 'layout'
      })
      this.formItems = this.$ide.componentMetaManager.runtimeMeta.filter((item) => {
        return item.group === 'form'
      })
      this.otherItems = this.$ide.componentMetaManager.runtimeMeta.filter((item) => {
        return item.group !== 'layout' && item.group !== 'form'
      })
    },
    componentMetaRegist(result, group = 'other') {
      this.currentComponentMeta = {
        runtimeMeta: {
          // title: '',
          // componentName: '',
          // alias: '',
          // properties: []
        },
        designMeta: {group: group}
      }
      this.componentMetaAction = 'create'
      this.componentMetaRegisterVisible = true
      // this.$ide.componentMetaManager.registerOneComponentMeta()
    },
    componentMetaEdit(element) {
      if (!this.isComponentManagerMode) {
        return
      }
      // console.log('try to edit component meta of', element)
      this.currentComponentMeta = {
        runtimeMeta: element,
        designMeta: this.$ide.componentMetaManager.findComponentDesignMeta(element.componentName)
      }
      console.log('try to edit component meta:', this.currentComponentMeta)

      this.componentMetaAction = 'update'
      console.log('currentComponentMeta:', this.currentComponentMeta)
      this.componentMetaRegisterVisible = true
    },
    componentMetaRemove(element) {
      if (!this.isComponentManagerMode) {
        return
      }
      if (element) {
        this.currentComponentMeta = {
          runtimeMeta: element,
          designMeta: this.$ide.componentMetaManager.findComponentDesignMeta(element.componentName)
        }
      }
      console.log('try to remove component meta:', this.currentComponentMeta)
      this.$ide.componentMetaManager.unRegisterOneComponentRuntimeMeta(this.currentComponentMeta.runtimeMeta)
      this.$ide.componentMetaManager.unRegisterOneComponentDesignMeta(this.currentComponentMeta.designMeta)
      this.componentMetaRegisterVisible = false

      // 从本地缓存中删除，与保存方案保持一致，同采用本地缓存或远程持久化
      this.ls.removeItem('GlRuntimeMeta.' + this.currentComponentMeta.runtimeMeta.templateId)
      // designMeta为空，即该组件为内置编码的组件，非基于页面配置的组件
      if (this.currentComponentMeta.designMeta) {
        this.ls.removeItem('GlDesignMeta.' + this.currentComponentMeta.designMeta.componentName)
      }
      this.resetItems()
    },
    onComponentMetaRegiste(result) {
      // 检查配置
      console.log('try to registe component meta:', this.currentComponentMeta)
      this.$ide.componentMetaManager.registerOneComponentRuntimeMeta(this.currentComponentMeta.runtimeMeta, true)
      this.$ide.componentMetaManager.registerOneComponentDesignMeta(this.currentComponentMeta.designMeta, true)
      this.resetItems()
      // 保存
      this.ls.setItem('GlRuntimeMeta.' + this.currentComponentMeta.runtimeMeta.templateId, JSON.stringify(this.currentComponentMeta.runtimeMeta))
      this.ls.setItem('GlDesignMeta.' + this.currentComponentMeta.designMeta.componentName, JSON.stringify(this.currentComponentMeta.designMeta))
      this.componentMetaRegisterVisible = false
    },
    onComponentMetaCopy() {

    },
    onExportMeta() {
      const result = {}
      for (let i = 0; i < this.ls.length; i++) {
        let key = this.ls.key(i)
        let item = this.ls.getItem(key)
        if (key.startsWith('GlRuntimeMeta.') || key.startsWith('GlDesignMeta.')) {
          result[key] = item
        }
      }
      this.saveJSON(result, 'componentMeta.json')
    },
    onImportMeta(file: any) {
      let that = this
      console.log('file>', file, this.fileList)
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () {
        if (reader.result) {
          console.log('reader.result',)
          const metaData = JSON.parse(reader.result)
          for (let key in metaData) {
            let metaItem = JSON.parse(metaData[key])
            if (key.startsWith('GlRuntimeMeta.')) {
              that.$ide.componentMetaManager.registerOneComponentRuntimeMeta(metaData[key])
              that.ls.setItem('GlRuntimeMeta.' + metaItem.templateId, metaData[key])
            } else if (key.startsWith('GlDesignMeta.')) {
              that.$ide.componentMetaManager.registerOneComponentDesignMeta(metaData[key])
              that.ls.setItem('GlDesignMeta.' + metaItem.componentName, metaData[key])
            }
          }
          that.resetItems()
        }
      }
      return false;
    },
    saveJSON(result: string | object, fileName: string = 'json.json') {
      const jsonString = typeof result === 'object' ? JSON.stringify(result) : result
      const blob = new Blob([jsonString], {type: 'text/json'})
      const e = document.createEvent('MouseEvents')
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
    },
    onSelect(keys) {
      this.$gl.bus.$emit('project_file_selected', keys)
    },
    onExpand() {
    },
    onChange() {
    },
    onChoose(event: any, fromItems: any) {
      this.chooseIndex = event.oldIndex
      const item = JSON.parse(JSON.stringify(fromItems[this.chooseIndex]))
      // console.log('gl-ide-plugin-layout > sidebar > onChoose: ', this.layoutItems, event, item)
      // this.$gl.bus.$emit('GlIdeSidebarComponentSelected', this.clone(event, fromItems))
    },
    /**
     * @param event clone事件
     * @param fromItems clone对象来源的对象数组
     */
    clone(event: any, fromItems: any) {
      let that = this
      const item = JSON.parse(JSON.stringify(fromItems[this.chooseIndex]))

      // 更改id
      function generateId(item: any) {
        let alias = that.$gl.alias[item.componentName]
        if (!alias) {
          console.warn('组件[', item.componentName, ']未设置别名，将直接生成无组件别名前缀的组件id。')
        }
        item.id = utils.gid(alias || '')
        // console.log('gl-runtime > gl-x > clone > generateId > new id:', item.id, 'for', item.componentName)
        if (item.children && item.children.length > 0) {
          for (let i in item.children) {
            item.children[i] = generateId(item.children[i])
            // console.log('gl-runtime > gl-x > clone > child item:', item.children[i])
          }
        }
        // console.log('gl-runtime > gl-x > clone > generateId > return', item.componentName)
        // console.log(JSON.stringify(item))
        return item
      }

      let result = generateId(item)
      // console.log('gl-runtime > gl-x > clone > return', result)
      return result
    },
    onChooseLayoutContainer(e: any) {
      // console.log('gl-ide-plugin-layout > sidebar > onChooseLayoutContainer: ', e)
      this.chooseContainerIndex = e.oldIndex
    },
    cloneLayoutContainer() {
      return JSON.parse(JSON.stringify(this.containers[this.chooseContainerIndex]))
    },
    arrayGroupBy(array: Array<Object>, groupKey: String) {
      let groups: LooseObject = new LooseObject()
      array.forEach(function (item) {
        // @ts-ignore
        groups[groupKey] = groups[groupKey] || []
        // @ts-ignore
        groups[groupKey].push(item)
      });
      // return Object.values(groups);
      let groupAry = []
      for (let key in groups) {
        groupAry.push({group: key, items: groups[key]})
      }
      return groupAry
    },
    startNodeDrag(e: MouseEvent, element: Object) {
      useCurrentInstance().emit('GlPluginCore_StartNodeDrag', {e: e, element: element})
    }
  }
}
</script>

<style>

.gl-ide-layout-sidebar .gl-dnd-item-template {
  /*background-color: #d8d8d8;*/
  width: 30%;
  display: inline-block;
  text-align: center;
  cursor: move;
  margin: 1em 2px 2em 2px;
  padding: 2px;
  vertical-align: top;
  position: relative;
}

.gl-ide-layout-sidebar .gl-dnd-item-template:hover > div {
  border: 1px solid #1890FF;
  box-shadow: #1890FF 0 0 1px 1px;
  background-color: #c3e3ff;
}

.gl-ide-layout-sidebar .gl-dnd-item-template > div {
  position: absolute;
  left: 0px;
  top: 0px;
  line-height: 3em;
  border: 1px solid #d8d8d8;
  /*line-height: 3em;*/
  /*background-color: #e7e7e7;*/
  width: 100%;
}

.gl-ide-layout-sidebar .gl-dnd-item-template-toolbar {
  display: none;
  cursor: default;
}

.gl-ide-layout-sidebar .gl-dnd-item-template:hover .gl-dnd-item-template-toolbar {
  display: block;
}

.gl-ide-layout-sidebar .gl-dnd-item-template-toolbar > span {
  cursor: pointer;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

/*.gl-placeholder {*/
/*!*background-color: #d8d8d8;*!*/
/*}*/
.gl-ide-layout-sidebar .gl-title {
  margin: 1.5em 1em 0 1em;
  font-weight: bold;
  position: relative;
}

.gl-ide-layout-sidebar .gl-dnd-row-handle {
  min-height: 2em;
  cursor: move;
}

.gl-ide-layout-sidebar .ant-row {
  border: 1px solid #f0f0f0;
  margin-bottom: 0.5em;
}

.gl-ide-layout-sidebar .ant-row:hover > div > .item {
  background-color: rgb(107, 209, 255);
}

.gl-ide-layout-sidebar .ant-row > div > .item {
  min-height: 2em;
  background-color: rgba(161, 222, 255, 0.35);
  text-align: center;
}

.gl-ide-layout-sidebar .gl-container-row {
  border: 0;
}

.gl-ide-layout-sidebar .gl-container-item {
  border: #e0e0e0 solid 1px;
  min-height: 2em;
  background-color: rgba(161, 222, 255, 0.35);
  text-align: center;
}

.gl-ide-layout-sidebar .gl-container-item:hover {
  cursor: move;
}

.gl-component-register-modal .ant-modal-body {
  padding: 0 1em !important;
}
</style>
