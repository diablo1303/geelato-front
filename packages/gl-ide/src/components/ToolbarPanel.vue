<template>
  <div class="gl-designer-toolbar" :style="btnStyle" style="text-align: center">
    <img src="../../public/logo_words.svg" style="width: 84px;height: 24px" class="gl-left">

    <!--<a size="small" :style="btnStyle" @click="comingSoon('设置管理')">设置</a>-->
    <a size="small" :style="btnStyle" @click="saveFile" class="gl-left">保存</a>
    <a size="small" :style="btnStyle" @click="preview"
       :disabled="!(pageStore.currentPage && pageStore.currentPage.id)" class="gl-left">预览
      <!--<router-link target="_blank" to="/preview"></router-link>-->
    </a>

    <span style="margin-left: -13em">
<span style="margin-right: 2em">
        <a-button size="small" :style="btnStyle" :disabled="!historyStore.prevAble"
                  :title="historyStore.prevAble?'回撤上一步':'无法回撤'" @click="historyStore.prevStep()"><ArrowLeftOutlined/></a-button>
       <a-button size="small" :style="btnStyle" :disabled="!historyStore.nextAble"
                 :title="historyStore.nextAble?'恢复':'无法恢复'" @click="historyStore.nextStep()"><ArrowRightOutlined/></a-button>
      </span>
      <GlIconfont type="gl-desktop" :class="{'gl-selected':currentIconSelected==='gl-desktop'}"
                  @click="currentIconSelected='gl-desktop'"></GlIconfont>
      <GlIconfont type="gl-tablet" :class="{'gl-selected':currentIconSelected==='gl-tablet'}"
                  @click="currentIconSelected='gl-tablet'"></GlIconfont>
      <GlIconfont type="gl-mobile" :class="{'gl-selected':currentIconSelected==='gl-mobile'}"
                  @click="currentIconSelected='gl-mobile'"></GlIconfont>
      <GlIconfont type="gl-json" @click="openCodeViewer"></GlIconfont>

    </span>


    <span style="float: right">
      <a-button size="small" :style="btnStyle" style="float: right" v-if="isLogined">
      <GlIconfont type="gl-logout" text="退出"></GlIconfont>
    </a-button>
    <a-button size="small" :style="btnStyle" style="float: right" v-if="!isLogined">
      <GlIconfont type="gl-preview"></GlIconfont>
      登录
    </a-button>
      <GlIconfont type="gl-help" text="帮助" style="float: right"
                   @click="gotoHelpPage"></GlIconfont>
      <!--<a v-if="currentLanguage" size="small" :style="btnStyle" style="float: right"-->
      <!--@click="setI18nLanguage($i18n.locale==='zh-CN'?'en-US':'zh-CN')">-->
      <!--{{$i18n.locale==='zh-CN'?'English':'中文'}}-->
      <!--</a>-->
    <a size="small" :style="btnStyle" @click="toggleFullScreen" style="float: right"
       title="按ESC键即可退出全屏">
      <template v-if="isFullscreen">
        <GlIconfont type="gl-fullscreen-exit" text="退出全屏"></GlIconfont>
      </template>
      <template v-else>
      <GlIconfont type="gl-fullscreen" text="全屏"></GlIconfont>
      </template>
    </a>
    </span>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {utils} from "@geelato/gl-ui";
import screenfull from 'screenfull'
import Events from "../entity/Events"
import {useIdeStore} from "../stores/UseIdeStore";
import {usePageStore} from "../stores/UsePageStore";
import {useThemeStore} from "../stores/UseThemeStore";
import {emitter, useCurrentInstance} from "@geelato/gl-ui";
import {useHistoryStore} from "../stores/UseHistoryStore";

const ideStore = useIdeStore()
const themeStore = useThemeStore()
const pageStore = usePageStore()
const historyStore = useHistoryStore()

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
  emitter.emit('GlDesignerToolbar.saveFile')
}

const openCodeViewer = () => {
  emitter.emit('GlDesignerToolbar.showCodeViewer')
}

const comingSoon = (text: string) => {
  useCurrentInstance().$message.info(text + '正在努力开发中...')
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

const gotoHelpPage = ()=>{
  window.open('https://www.geelato.cn', '_blank');
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
  padding: 4px 10px
}

.gl-designer-toolbar .gutter {
  /*padding-left: 4px;*/
}

.gl-designer-toolbar .ant-btn {
  font-weight: 600;
  margin-left: 1em;
  border: 0;
  /*color: white;*/
  /*box-shadow: 0;*/
}

.gl-designer-toolbar .ant-btn-sm {
  font-size: 12px;
}

.gl-designer-toolbar .gl-left {
  float: left;
}

.gl-designer-toolbar .anticon {
  margin: 0 0.25em;
  font-size: 1.5em;
  line-height: 1em;
}

.gl-designer-toolbar .anticon:hover {
  color: #1890FF;
  cursor: pointer;
}

.gl-designer-toolbar .anticon.gl-selected {
  color: #1890FF;
}

/*.gl-designer-toolbar .ant-dropdown-menu-item{*/
/*font-size: 10px !important;*/
/*}*/
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
