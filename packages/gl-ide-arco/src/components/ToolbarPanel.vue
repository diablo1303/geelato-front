<template>
  <div class="gl-designer-toolbar" :style="btnStyle" style="text-align: center">
    <img src="../../public/logo_words.svg" style="width: 84px;height: 24px" class="gl-left">
    <a-dropdown class="gl-left">
      <!--<a class="ant-dropdown-link" @click.prevent>-->
      <!--Cascading menu-->
      <!--<DownOutlined/>-->
      <!--</a>-->
      <a-button size="small" :style="btnStyle" @click.prevent>
        应用
      </a-button>
      <template #overlay>
        <a-menu>
          <a-menu-item size="small" key="1" style="font-size: 12px" @click="showProjectForm">
            <BorderOutlined/>
            从空白创建应用
          </a-menu-item>
          <a-menu-item size="small" key="2" style="font-size: 12px" @click="showTemplateProjectForm">
            <AppstoreOutlined/>
            从模板库创建应用
          </a-menu-item>
          <a-menu-item size="small" key="3" style="font-size: 12px" @click="$gl.emitter.emit('GlDesignerToolbar.showProjectList')">
            <AppstoreOutlined/>
            打开已创建应用
          </a-menu-item>
          <a-menu-item size="small" key="4" style="font-size: 12px" @click="showCurrentProjectForm">
            <SettingOutlined/>
            设置当前应用
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
<!--    <a-dropdown class="gl-left">-->
<!--      <a-button size="small" :style="btnStyle">-->
<!--        工具-->
<!--      </a-button>-->
<!--      <template #overlay>-->
<!--        <a-menu>-->
<!--          <a-menu-item size="small" key="1" style="font-size: 12px" @click="comingSoon('工具管理')">-->
<!--            <DeploymentUnitOutlined/>-->
<!--            部署-->
<!--          </a-menu-item>-->
<!--        </a-menu>-->
<!--      </template>-->
<!--    </a-dropdown>-->

    <a-dropdown class="gl-left">
      <a-button size="small" :style="btnStyle">
        扩展
      </a-button>
      <template #overlay>
        <a-menu>
          <a-menu-item size="small" key="1" style="font-size: 12px" @click="comingSoon('工具管理')">
            <AppstoreAddOutlined />
            组件
          </a-menu-item>
          <a-menu-item size="small" key="1" style="font-size: 12px" @click="comingSoon('工具管理')">
            <ApiOutlined />
            插件
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <!--<a-button size="small" :style="btnStyle" @click="comingSoon('设置管理')">设置</a-button>-->
    <a-button size="small" :style="btnStyle" @click="saveFile" class="gl-left">保存</a-button>
    <a-button size="small" :style="btnStyle" @click="preview"
              :disabled="!($ide.currentPage && $ide.currentPage.id)" class="gl-left">预览
      <!--<router-link target="_blank" to="/preview"></router-link>-->
    </a-button>


    <span style="margin-left: -13em">
      <span style="margin-right: 2em">
        <a-button size="small" :style="btnStyle" :disabled="!$ide.history.prevAble"
                  :title="$ide.history.prevAble?'回撤上一步':'无法回撤'" @click="$ide.history.prevStep()"><ArrowLeftOutlined/></a-button>
       <a-button size="small" :style="btnStyle" :disabled="!$ide.history.nextAble"
                 :title="$ide.history.nextAble?'恢复':'无法恢复'" @click="$ide.history.nextStep()"><ArrowRightOutlined/></a-button>
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
      <a-button size="small" :style="btnStyle" style="float: right" v-if="islogined">
      <LogoutOutlined/>
      退出
    </a-button>
    <a-button size="small" :style="btnStyle" style="float: right" v-if="!islogined">
      <LoginOutlined/>
      登录
    </a-button>
    <a-button size="small" :style="btnStyle" href="https://www.geelato.cn" target="_blank"
              style="float: right">
      <QuestionCircleOutlined/>
      帮助
    </a-button>
      <!--<a-button v-if="currentLanguage" size="small" :style="btnStyle" style="float: right"-->
      <!--@click="setI18nLanguage($i18n.locale==='zh-CN'?'en-US':'zh-CN')">-->
      <!--{{$i18n.locale==='zh-CN'?'English':'中文'}}-->
      <!--</a-button>-->
    <a-button size="small" :style="btnStyle" @click="toggleFullScreen" style="float: right"
              title="按ESC键即可退出全屏">
      <template v-if="isFullscreen">
        <FullscreenExitOutlined/>
        退出全屏
      </template>
      <template v-else>
        <FullscreenOutlined/>
        全屏
      </template>
    </a-button>
    </span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {utils} from "@geelato/gl-ui";
import screenfull from 'screenfull'
import {Events} from "@geelato/gl-ide";
import {useThemeStore} from "@geelato/gl-ide";

export default defineComponent({
  name: "GlDesignerToolbar",
  components: {
  },
  setup(props, context) {
    const themeStore = useThemeStore()
    return {
      btnStyle: {background: themeStore.theme.background},
      isFullscreen: false,
      islogined: true,
      zh: {
        title: '中文',
        locale: 'zh-CN',
        toggleTitle: 'English'
      },
      en: {
        title: 'English',
        locale: 'en-US',
        toggleTitle: '中文'
      },
      currentLanguage: undefined,
      currentIconSelected: ''
    }
  },
  created() {
    this.currentLanguage = this.zh
  },
  methods: {
    setI18nLanguage(lang) {
      // this.$gl.i18n.setI18nLanguage(lang)
    },
    showProjectForm() {
      // this.$gl.bus.$emit('GlDesignerToolbar.showProjectForm')
      // this.$ide.currentApp = reactive({id: utils.gid('app'), name: '新项目'})
      // this.$ide.currentApp = {id: utils.gid('app'), name: '新项目'}
      // // this.$ide.currentApp.id = utils.gid('app')
      // // this.$ide.currentApp.name = '新项目'
      // console.log('this.$ide.currentApp:', this.$ide.currentApp)
      console.log(Events.GlIdeToolbarShowNewAppForm, {id: utils.gid('app'), name: '新项目'})
      this.$gl.bus.$emit(Events.GlIdeToolbarShowNewAppForm, {id: utils.gid('app'), name: '新项目'})
    },
    showCurrentProjectForm() {
      this.$gl.bus.$emit('GlDesignerToolbar.showCurrentProjectForm')
    },
    showTemplateProjectForm() {
      this.$gl.bus.$emit('GlDesignerToolbar.showTemplateProjectForm')
    },
    showProjectList() {
      this.$gl.bus.$emit('GlDesignerToolbar.showProjectList')
    },
    saveFile() {
      this.$gl.bus.$emit('GlDesignerToolbar.saveFile')
    },
    openCodeViewer() {
      this.$gl.bus.$emit('GlDesignerToolbar.showCodeViewer')
    },
    /**
     *  打开插件页面
     */
    showPlugins() {
      this.comingSoon()
    },
    comingSoon(text) {
      this.$message.info(text + '正在努力开发中...')
    },
    toolbarEvent() {

    },
    /**
     *  打开预览页面
     */
    preview() {
      if (this.ideStore.editingFile && this.ideStore.editingFile.id) {
        console.log('this.ideStore.editingFile', this.ideStore.editingFile)
        window.open(window.location.origin + `/#/preview/${this.ideStore.editingFile.id}/${this.ideStore.editingFile.extendId}`, '_blank')
      }
    },
    callback(key) {
    },
    toggleFullScreen() {
      screenfull.toggle()
      this.isFullscreen = !this.isFullscreen
    },
    changeLanguages() {
      console.log('this.$i18n:', this.$i18n)
      console.log('this.$i18n.locale:', this.$i18n.locale)
      this.currentLanguage = this.currentLanguage.locale === 'zh-CN' ? this.en : this.zh
      this.setI18nLanguage(this.currentLanguage.locale)
      console.log('this.$i18n.locale:', this.$i18n.locale)
    }
  },
})
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
