<template>
  <div class="gl-designer-toolbar" :style="btnStyle" style="text-align: center">
    <span class="gl-left" style="vertical-align: middle">
      <!--      <img src="../../public/logo_words.svg" style="width: 84px;height: 24px"/>-->
      <img
        src="../../public/logo.png"
        style="padding: 2px; width: 24px; height: 24px"
        title="GEELATO IDE"
      />
    </span>
    <span class="gl-left">
      <!--      <span title="项目名称">-->
      <!--        {{ appStore.currentApp.name }}-->
      <!--      </span>-->
      <!--<a size="small" :style="btnStyle" @click="comingSoon('设置管理')">设置</a>-->
      <span class="gl-item" style="font-weight: 600">
        {{ appStore.currentApp.name }}
      </span>
      <span class="gl-item" v-if="pageStore.currentPage.sourceContent?.componentName">
        <GlIconfont type="gl-save" text="保存" @click="saveFile"></GlIconfont>
      </span>
      <span class="gl-item" v-if="isLogin()">
        <GlIconfont type="gl-openlink" text="打开站点" @click="openAppSite"></GlIconfont>
      </span>
      <span
        class="gl-item"
        v-if="isLogin()"
        :disabled="!(pageStore.currentPage && pageStore.currentPage.id)"
      >
        <GlIconfont type="gl-preview" text="预览页面" @click="preview"></GlIconfont>
      </span>
      <span class="gl-item" v-if="isLogin()">
        <GlIconfont type="gl-openlink" text="应用配置" @click="openAppSettings"></GlIconfont>
      </span>
    </span>

    <span>
      <a-button
        size="small"
        :style="btnStyle"
        :disabled="!pageStore.currentPageHistory.undoAble"
        :title="pageStore.currentPageHistory.undoAble ? '回撤上一步' : '无法回撤'"
        @click="pageStore.operationUndo()"
      >
        <GlIconfont
          type="gl-undo"
          :class="{ 'gl-selected': currentIconSelected === 'gl-desktop' }"
          @click="currentIconSelected = 'gl-desktop'"
        ></GlIconfont>
      </a-button>
      <a-button
        size="small"
        :style="btnStyle"
        :disabled="!pageStore.currentPageHistory.redoAble"
        :title="pageStore.currentPageHistory.redoAble ? '重做' : '无法重做'"
        @click="pageStore.operationRedo()"
      >
        <GlIconfont
          type="gl-redo"
          :class="{ 'gl-selected': currentIconSelected === 'gl-desktop' }"
          @click="currentIconSelected = 'gl-desktop'"
        ></GlIconfont>
      </a-button>
      <!--      <span class="gl-item" v-if="isLogin()">-->
      <!--        <GlIconfont type="gl-desktop" :class="{'gl-selected':currentIconSelected==='gl-desktop'}"-->
      <!--                    @click="currentIconSelected='gl-desktop'"></GlIconfont>-->
      <!--      </span>-->
      <!--       <span class="gl-item" v-if="isLogin()">-->
      <!--        <GlIconfont type="gl-tablet" :class="{'gl-selected':currentIconSelected==='gl-tablet'}"-->
      <!--                    @click="currentIconSelected='gl-tablet'"></GlIconfont>-->
      <!--      </span>-->
      <!--      <span class="gl-item" v-if="isLogin()">-->
      <!--       <GlIconfont type="gl-mobile" :class="{'gl-selected':currentIconSelected==='gl-mobile'}"-->
      <!--                   @click="currentIconSelected='gl-mobile'"></GlIconfont>-->
      <!--      </span><span class="gl-item" v-if="isLogin()">-->
      <!--        <GlIconfont type="gl-desktop" :class="{'gl-selected':currentIconSelected==='gl-desktop'}"-->
      <!--                    @click="currentIconSelected='gl-desktop'"></GlIconfont>-->
      <!--      </span>-->
      <!--       <span class="gl-item" v-if="isLogin()">-->
      <!--        <GlIconfont type="gl-tablet" :class="{'gl-selected':currentIconSelected==='gl-tablet'}"-->
      <!--                    @click="currentIconSelected='gl-tablet'"></GlIconfont>-->
      <!--      </span>-->
      <!--      <span class="gl-item" v-if="isLogin()">-->
      <!--       <GlIconfont type="gl-mobile" :class="{'gl-selected':currentIconSelected==='gl-mobile'}"-->
      <!--                   @click="currentIconSelected='gl-mobile'"></GlIconfont>-->
      <!--      </span>-->
      <span class="gl-item" v-if="isLogin() && pageStore.currentPage.sourceContent?.componentName">
        <GlIconfont type="gl-json" @click="openCodeViewer"></GlIconfont>
      </span>
    </span>

    <span style="float: right; padding-right: 1em">
      <span class="gl-item" v-if="isLogin()">
        <GlIconfont
          type="gl-refresh"
          text="页面查询替换"
          @click="showPageReplaceEditor"
        ></GlIconfont>
      </span>
      <span class="gl-item" v-if="isLogin()">
        <GlIconfont type="gl-component" text="组件库" @click="showComponents"></GlIconfont>
      </span>
      <span class="gl-item">
        <GlIconfont
          v-if="currentLocalOption"
          type="gl-earth"
          :text="currentLocalOption.label"
          @click="switchLanguages"
        ></GlIconfont>
      </span>
      <span class="gl-item" @click="toggleFullScreen" title="按ESC键即可退出全屏">
        <template v-if="isFullscreen">
          <GlIconfont type="gl-fullscreen-exit" text="退出全屏"></GlIconfont>
        </template>
        <template v-else>
          <GlIconfont type="gl-fullscreen" text="全屏"></GlIconfont>
        </template>
      </span>
      <span class="gl-item">
        <GlIconfont type="gl-help" text="帮助" @click="gotoHelpPage"></GlIconfont>
      </span>
      <span class="gl-item" v-if="isLogin()">
        <GlIconfont type="gl-logout" text="退出" @click="logoutClick"></GlIconfont>
      </span>
      <span class="gl-item" v-if="!isLogin()">
        <GlIconfont type="gl-preview" text="登录"></GlIconfont>
      </span>
      <!--<a v-if="currentLanguage" size="small" :style="btnStyle" style="float: right"-->
      <!--@click="setI18nLanguage($i18n.locale==='zh-CN'?'en-US':'zh-CN')">-->
      <!--{{$i18n.locale==='zh-CN'?'English':'中文'}}-->
      <!--</a>-->
    </span>
    <gl-modal
      :visible="codeViewerVisible"
      title="生成的配置代码预览"
      :fullscreen="true"
      @ok="codeViewerVisible = false"
      @cancel="codeViewerVisible = false"
    >
      <GlMonacoEditor
        v-model="json"
        :height="themeStore.modalBodyHeight - 41"
        language="json"
      ></GlMonacoEditor>
      <template #footer>
        <a-button type="primary" @click="saveCode">暂存（未保存到服务端）</a-button>
        <a-button type="primary" @click="copyCode">仅复制</a-button>
        <a-button type="primary" @click="copyCodeAndChangeId">复制（组件复制成新的Id）</a-button>
      </template>
    </gl-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { CheckUtil, emitter, useGlobal } from '@geelato/gl-ui'
import screenfull from 'screenfull'
import { useIdeStore } from '../stores/UseIdeStore'
import { usePageStore } from '../stores/UsePageStore'
import { useThemeStore } from '../stores/UseThemeStore'
import { copyComponentInst, useComponentStore } from '../stores/UseComponentStore'
import { useAppStore } from '../stores/UseAppStore'
import EventNames from '../entity/EventNames'
import ClipboardJS from 'clipboard'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import { isLogin } from '@geelato/gl-ui/src/m/utils/auth'

const ideStore = useIdeStore()
const appStore = useAppStore()
const componentStore = useComponentStore()
const themeStore = useThemeStore()
const pageStore = usePageStore()
const codeViewerVisible = ref(false)
const global = useGlobal()

const btnStyle = { background: themeStore.theme.background }
const isFullscreen = ref(false)

// 从查询参数中获取参数值
// appStore.currentApp.id = utils.getUrlQueryParam('appId') || ''
// appStore.currentApp.name = decodeURI(utils.getUrlQueryParam('appName') || '')
// appStore.currentApp.tenantCode = utils.getUrlQueryParam('tenantCode') || ''

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

const json = ref('')
const currentLanguage = ref(zh)
const currentIconSelected = ref('')

// const setI18nLanguage = (lang: string) => {
//
// }
// const showProjectForm = () => {
//   emitter.emit(EventNames.GlIdeToolbarShowNewAppForm, {id: utils.gid('app'), name: '新项目'})
// }
// const showCurrentProjectForm = () => {
//   emitter.emit('GlDesignerToolbar.showCurrentProjectForm')
// }

// const showTemplateProjectForm = () => {
//   emitter.emit('GlDesignerToolbar.showTemplateProjectForm')
// }

// const showProjectList = () => {
//   emitter.emit('GlDesignerToolbar.showProjectList')
// }

const saveFile = () => {
  ideStore.savePage()
}

const openCodeViewer = () => {
  emitter.emit(EventNames.GlIdeToolbarShowCodeViewer)
  if (componentStore.currentComponentTree[0]) {
    json.value = JSON.stringify(componentStore.currentComponentTree[0])
  }
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
  if (pageStore.currentPage && pageStore.currentPage.id) {
    // console.log('preview(),currentPage', pageStore.currentPage)
    window.open(
      `${window.location.origin}/idePagePreview.html?pageId=${pageStore.currentPage.id}`,
      '_blank'
    )
  } else {
    // console.log('当前无可预览的页面 > currentPage', pageStore.currentPage)
    global.$message.info('当前无可预览的页面或页面id为空。')
  }
}

/**
 *  打开应用站点
 */
const openAppSite = () => {
  console.log('appStore.currentApp:', appStore.currentApp)
  // geelato/4658755300571090944/page
  window.open(
    `${window.location.origin}/${appStore.currentApp.tenantCode}/${appStore.currentApp.id}/page`,
    '_blank'
  )
}

/**
 *  打开应用配置页面
 */
const openAppSettings = () => {
  window.open(`${window.location.origin}/appSettings.html?appId=${appStore.currentApp.id}&appName=${appStore.currentApp.name}`, '_blank')
}

const showPageReplaceEditor = () => {
  emitter.emit(EventNames.GlIdeToolbarShowPagesReplaceEditor)
}
/**
 *  打开组件库
 */
const showComponents = () => {
  window.open(`${window.location.origin}/ideComponents.html`, '_blank')
}

const toggleFullScreen = () => {
  screenfull.toggle()
  isFullscreen.value = !isFullscreen.value
}

const logoutClick = () => {
  if (isLogin()) {
    emitter.emit(EventNames.GlIdeLogout)
  }
}

const gotoHelpPage = () => {
  if (CheckUtil.isBrowser()) {
    window.open(`${window.location.origin}`, '_blank')
  }
}

const LOCALE_OPTIONS = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
]
const getLocalOption = (value: string) => {
  return LOCALE_OPTIONS.find((option) => {
    return option.value === value
  })
}
const currentLocaleValue = localStorage.getItem('gl-locale') || 'zh-CN'
const currentLocalOption = ref(getLocalOption(currentLocaleValue))
const switchLanguages = () => {
  // console.log('this.$i18n:', this.$i18n)
  // console.log('this.$i18n.locale:', this.$i18n.locale)
  // this.currentLanguage = this.currentLanguage.locale === 'zh-CN' ? this.en : this.zh
  // this.setI18nLanguage(this.currentLanguage.locale)
  // console.log('this.$i18n.locale:', this.$i18n.locale)
  const localValue = localStorage.getItem('gl-locale') || 'zh-CN'
  const newLocalValue = localValue === 'zh-CN' ? 'en-US' : 'zh-CN'
  currentLocalOption.value = getLocalOption(newLocalValue)
  localStorage.setItem('gl-locale', newLocalValue)
}

const saveCode = () => {
  if (json.value) {
    const inst: ComponentInstance = JSON.parse(json.value)
    componentStore.currentComponentTree[0] = inst
    pageStore.operationLog('改代码', inst, inst)
    codeViewerVisible.value = false
  }
}

const copyCode = () => {
  if (componentStore.currentComponentTree[0]) {
    ClipboardJS.copy(JSON.stringify(componentStore.currentComponentTree[0]))
    copyComponentInst(componentStore.currentComponentTree[0])
  }
}

const copyCodeAndChangeId = () => {
  if (componentStore.currentComponentTree[0]) {
    ClipboardJS.copy(JSON.stringify(copyComponentInst(componentStore.currentComponentTree[0])))
  }
}
</script>

<style>
.gl-designer-toolbar {
  padding: 4px 0px 4px 8px
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
  color: #1890ff;
  cursor: pointer;
}

.gl-designer-toolbar .gl-left {
  float: left;
}

.gl-designer-toolbar .gl-item.gl-selected {
  color: #1890ff;
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
