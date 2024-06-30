<template>
  <div class="gl-designer">
    <IdeToolbarPanel/>
    <splitpanes class="default-theme" :push-other-panes="false"
                :style="{height:`${themeStore.ideMainHeight}px`}">
      <pane class="gl-ide-sidebar-tab-pane" :size="themeStore.sidebarTabWidthPercent"
            :min-size="themeStore.sidebarTabWidthPercent">
        <IdeSidebarTab/>
      </pane>
      <pane :size="themeStore.sidebarsWidthPercent" :min-size="themeStore.sidebarTabWidthPercent"
            :style="{height:`${themeStore.ideMainHeight}px`}" style="overflow-y: auto">
        <IdeSidebarPanel @switchPanel="onSwitchSidebarPanel"/>
      </pane>
      <pane :size="themeStore.stageWidthPercent"
            :style="{height:`${themeStore.ideMainHeight}px`}">
        <div style="overflow-y: auto"
             :style="{height:`${themeStore.ideMainHeight-themeStore.stageBreadcrumbHeight}px`,'min-height':`${themeStore.ideMainHeight-themeStore.stageBreadcrumbHeight}px`}">
          <IdeStagePanel/>
        </div>
        <div :style="{height:`${themeStore.stageBreadcrumbHeight}px`}">
          <IdeStageBreadcrumb/>
        </div>
      </pane>
      <pane :size="themeStore.setterWidthPercent"
            :style="{height:`${themeStore.ideMainHeight}px`}" style="overflow-y: auto">
        <IdeSetterPanel @update="updateSetter"/>
      </pane>
    </splitpanes>
    <IdeStatusPanel v-show="themeStore.statusHeight!==0"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {Splitpanes, Pane} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import IdeToolbarPanel from './ToolbarPanel.vue'
import IdeSidebarPanel from './SidebarPanel.vue'
import IdeSidebarTab from './SidebarTab.vue'
import IdeStagePanel from './StagePanel.vue'
import IdeSetterPanel from './SetterPanel.vue'
import IdeStatusPanel from './StatusPanel.vue'
import IdeStageBreadcrumb from "./StageBreadcrumb.vue";
import {useThemeStore} from "../stores/UseThemeStore";
import {Utils} from "@geelato/gl-ui";

export default defineComponent({
  name: "GlIde",
  components: {
    Splitpanes,
    Pane,
    IdeToolbarPanel,
    IdeSidebarPanel,
    IdeStagePanel,
    IdeSetterPanel,
    IdeSidebarTab,
    IdeStatusPanel,
    IdeStageBreadcrumb
  },
  setup(props, context) {
    const stagePanels = ref([])
    const themeStore = useThemeStore()
    if (Utils.CheckUtil.isBrowser()) {
      if (typeof window !== 'undefined') {
        window.onresize = () => {
          return (() => {
            themeStore.resize()
          })()
        }
      }
    }

    const onSwitchSidebarPanel = ({showPanel}: { showPanel: boolean }) => {
      if (!showPanel) {
        console.log('showPanel>', showPanel)
        themeStore.sidebarWidth = themeStore.sidebarTabWidth
      }
    }

    return {
      stagePanels,
      themeStore,
      onSwitchSidebarPanel
    }
  },
  created() {
    this.themeStore.resize()
  },
  methods: {
    updateSetter(data: any) {
      console.log('updateSetter:', data)
    }
  }
})
</script>
<style>
.gl-designer .splitpanes__pane {
  background-color: #FFF !important;
}

.gl-designer .splitpanes__splitter {
  /*background-color: #eee !important;*/
}

.gl-ide-sidebar-tab-pane + .splitpanes__splitter {
  display: none;
}
</style>
