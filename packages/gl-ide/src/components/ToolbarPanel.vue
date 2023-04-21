<template>
  <div class="gl-designer-toolbar" :style="btnStyle" style="text-align: center">
    <span class="gl-left">
      <img src="../../public/logo_words.svg" style="width: 84px;height: 24px"/>
    </span>
    <span class="gl-left">
      <!--      <span title="项目名称">-->
      <!--        {{ appStore.currentApp.name }}-->
      <!--      </span>-->
      <!--<a size="small" :style="btnStyle" @click="comingSoon('设置管理')">设置</a>-->
       <span class="gl-item">
        <GlIconfont type="gl-project" text="项目" @click="projectConfig"></GlIconfont>
      </span>
      <span class="gl-item">
        <GlIconfont type="gl-save" text="保存" @click="saveFile"></GlIconfont>
      </span>
      <span class="gl-item" v-if="isLogined" :disabled="!(pageStore.currentPage && pageStore.currentPage.id)">
        <GlIconfont type="gl-preview" text="预览" @click="preview"></GlIconfont>
        <!--<router-link target="_blank" to="/preview"></router-link>-->
      </span>
    </span>


    <span>
<!--        <a-button size="small" :style="btnStyle" :disabled="!historyStore.prevAble"-->
      <!--                  :title="historyStore.prevAble?'回撤上一步':'无法回撤'" @click="historyStore.prevStep()">-->
      <!--           <GlIconfont type="gl-desktop" :class="{'gl-selected':currentIconSelected==='gl-desktop'}"-->
      <!--                       @click="currentIconSelected='gl-desktop'"></GlIconfont>-->
      <!--        </a-button>-->
      <!--       <a-button size="small" :style="btnStyle" :disabled="!historyStore.nextAble"-->
      <!--                 :title="historyStore.nextAble?'恢复':'无法恢复'" @click="historyStore.nextStep()">-->
      <!--         <GlIconfont type="gl-desktop" :class="{'gl-selected':currentIconSelected==='gl-desktop'}"-->
      <!--                     @click="currentIconSelected='gl-desktop'"></GlIconfont>-->
      <!--       </a-button>-->
      <span class="gl-item" v-if="isLogined">
        <GlIconfont type="gl-desktop" :class="{'gl-selected':currentIconSelected==='gl-desktop'}"
                    @click="currentIconSelected='gl-desktop'"></GlIconfont>
      </span>
       <span class="gl-item" v-if="isLogined">
        <GlIconfont type="gl-tablet" :class="{'gl-selected':currentIconSelected==='gl-tablet'}"
                    @click="currentIconSelected='gl-tablet'"></GlIconfont>
      </span>
      <span class="gl-item" v-if="isLogined">
       <GlIconfont type="gl-mobile" :class="{'gl-selected':currentIconSelected==='gl-mobile'}"
                   @click="currentIconSelected='gl-mobile'"></GlIconfont>
      </span>
       <span class="gl-item" v-if="isLogined">
       <GlIconfont type="gl-json" @click="openCodeViewer"></GlIconfont>
      </span>
    </span>


    <span style="float: right;padding-right: 1em">
      <span class="gl-item" v-if="isLogined">
        <GlIconfont type="gl-logout" text="退出"></GlIconfont>
      </span>
       <span class="gl-item" v-if="!isLogined">
        <GlIconfont type="gl-preview" text="登录"></GlIconfont>
      </span>
       <span class="gl-item">
        <GlIconfont type="gl-help" text="帮助" @click="gotoHelpPage"></GlIconfont>
      </span>
       <span class="gl-item" @click="toggleFullScreen" title="按ESC键即可退出全屏">
        <template v-if="isFullscreen">
          <GlIconfont type="gl-fullscreen-exit" text="退出全屏"></GlIconfont>
        </template>
        <template v-else>
        <GlIconfont type="gl-fullscreen" text="全屏"></GlIconfont>
        </template>
      </span>

      <!--<a v-if="currentLanguage" size="small" :style="btnStyle" style="float: right"-->
      <!--@click="setI18nLanguage($i18n.locale==='zh-CN'?'en-US':'zh-CN')">-->
      <!--{{$i18n.locale==='zh-CN'?'English':'中文'}}-->
      <!--</a>-->
    </span>
    <gl-modal :visible="codeViewerVisible"
              title="生成的配置代码预览"
              :fullscreen="true"
              @ok="codeViewerVisible=false"
              @cancel="codeViewerVisible=false">
      <VueJsonPretty :data="componentStore.currentComponentTree[0]"></VueJsonPretty>
    </gl-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {utils, CheckUtil} from "@geelato/gl-ui";
import screenfull from 'screenfull'
import Events from "../entity/Events"
import {useIdeStore} from "../stores/UseIdeStore";
import {usePageStore} from "../stores/UsePageStore";
import {useThemeStore} from "../stores/UseThemeStore";
import {emitter, useGlobal} from "@geelato/gl-ui";
import {useHistoryStore} from "../stores/UseHistoryStore";
import {useComponentStore} from "../stores/UseComponentStore";
import {useAppStore} from "../stores/UseAppStore";
import EventNames from "../entity/Events";
import VueJsonPretty from "vue-json-pretty";

const ideStore = useIdeStore()
const appStore = useAppStore()
const componentStore = useComponentStore()
const themeStore = useThemeStore()
const pageStore = usePageStore()
const historyStore = useHistoryStore()

const codeViewerVisible = ref(false)

const global = useGlobal()

const btnStyle = {background: themeStore.theme.background}
const isFullscreen = ref(false)
const isLogined = ref(true)
const zh = {
  title: '中文',
  locale: 'zh-CN',
  toggleTitle: 'English'
}
const en = {
  title: 'English',
  locale: 'en-US',
  toggleTitle: '中文'
}
const currentLanguage = ref(zh)
const currentIconSelected = ref('')

const setI18nLanguage = (lang: string) => {

}
const showProjectForm = () => {
  emitter.emit(Events.GlIdeToolbarShowNewAppForm, {id: utils.gid('app'), name: '新项目'})
}
const showCurrentProjectForm = () => {
  emitter.emit('GlDesignerToolbar.showCurrentProjectForm')
}

const showTemplateProjectForm = () => {
  emitter.emit('GlDesignerToolbar.showTemplateProjectForm')
}

const showProjectList = () => {
  emitter.emit('GlDesignerToolbar.showProjectList')
}

const saveFile = () => {
  ideStore.savePage()
  emitter.emit(EventNames.GlIdeToolbarSaveFile)
}

const projectConfig = ()=>{

}

const openCodeViewer = () => {
  emitter.emit(EventNames.GlIdeToolbarShowCodeViewer)
  codeViewerVisible.value = true
}

const comingSoon = (text: string) => {
  global.$message.info(text + '正在努力开发中...')
}
/**
 *  打开插件页面
 */
const showPlugins = () => {
  comingSoon('')
}

/**
 *  打开预览页面
 */
const preview = () => {
  // if (ideStore.editingFile && ideStore.editingFile.id) {
  //   console.log('this.ideStore.editingFile', this.ideStore.editingFile)
  //   window.open(window.location.origin + `/#/preview/${this.ideStore.editingFile.id}/${this.ideStore.editingFile.extendId}`, '_blank')
  // }
}

const toggleFullScreen = () => {
  screenfull.toggle()
  isFullscreen.value = !isFullscreen.value
}

const gotoHelpPage = () => {
  if (CheckUtil.isBrowser()) {
    window.open('https://www.geelato.cn', '_blank');
  }
}

const changeLanguages = () => {
  // console.log('this.$i18n:', this.$i18n)
  // console.log('this.$i18n.locale:', this.$i18n.locale)
  // this.currentLanguage = this.currentLanguage.locale === 'zh-CN' ? this.en : this.zh
  // this.setI18nLanguage(this.currentLanguage.locale)
  // console.log('this.$i18n.locale:', this.$i18n.locale)
}

</script>

<style>

.gl-designer-toolbar {
  /*padding: 4px 4px*/
}

.gl-designer-toolbar .gutter {
  /*padding-left: 4px;*/
}

.gl-designer-toolbar > span {
  display: inline-block;
}

.gl-designer-toolbar .gl-item {
  display: inline-block;
  font-weight: 500;
  margin-left: 1em;
  border: 0;
  height: 28px;
  line-height: 28px;
}

.gl-designer-toolbar .gl-item:hover {
  color: #1890FF;
  cursor: pointer;
}

.gl-designer-toolbar .gl-left {
  float: left;
}

.gl-designer-toolbar .gl-item.gl-selected {
  color: #1890FF;
}

.full-modal .ant-modal {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}

.full-modal .ant-modal-content-x {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
}

.full-modal .ant-modal-body {
  flex: 1;
}

</style>
