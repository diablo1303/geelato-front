<template>
  <div class="gl-designer">
    <DesignerToolbarPanel></DesignerToolbarPanel>
    <splitpanes class="default-theme" :push-other-panes="false"
                :style="{height:`${themeStore.ideMainHeight}px`}">
      <pane class="gl-ide-sidebar-tab-pane" :size="themeStore.sidebarTabWidthPercent"
            :min-size="themeStore.sidebarTabWidthPercent">
        <DesignerSidebarTab></DesignerSidebarTab>
      </pane>
      <pane :size="themeStore.sidebarsWidthPercent" :min-size="themeStore.sidebarTabWidthPercent"
            :style="{height:`${themeStore.ideMainHeight}px`}" style="overflow-y: auto">
        <DesignerSidebarPanel @switchPanel="onSwitchSidebarPanel"></DesignerSidebarPanel>
      </pane>
      <pane :size="themeStore.stageWidthPercent"
            :style="{height:`${themeStore.ideMainHeight}px`}" style="overflow-y: auto">
        <DesignerStagePanel></DesignerStagePanel>
      </pane>
      <pane :size="themeStore.setterWidthPercent"
            :style="{height:`${themeStore.ideMainHeight}px`}" style="overflow-y: auto">
        <DesignerSetterPanel @update="updateSetter"></DesignerSetterPanel>
      </pane>
    </splitpanes>
    <DesignerStatusPanel v-show="themeStore.statusHeight!==0"></DesignerStatusPanel>
  </div>
</template>

<script lang="ts">
import {provide, defineComponent, ref, nextTick} from 'vue'
import {Splitpanes, Pane} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import DesignerToolbarPanel from './ToolbarPanel.vue'
import DesignerSidebarPanel from './SidebarPanel.vue'
import DesignerSidebarTab from './SidebarTab.vue'
import DesignerStagePanel from './StagePanel.vue'
import DesignerSetterPanel from './SetterPanel.vue'
import DesignerStatusPanel from './StatusPanel.vue'
import {useThemeStore} from "../stores/UseThemeStore";
import AllUtils from "@geelato/gl-ui/src/m/utils/AllUtils";

export default defineComponent({
  name: "GlIde",
  components: {
    Splitpanes,
    Pane,
    DesignerToolbarPanel,
    DesignerSidebarPanel,
    DesignerStagePanel,
    DesignerSetterPanel,
    DesignerSidebarTab,
    DesignerStatusPanel
  },
  setup(props, context) {
    const stagePanels = ref([])
    const themeStore = useThemeStore()
    if (AllUtils.CheckUtil.isBrowser()) {
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
